import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getServerSideURL } from '@/utilities/getURL'

const getProjectsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL() || 'https://example.com'

    const results = await payload.find({
      collection: 'projects',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: { visibility: { equals: 'public' }, _status: { equals: 'published' } },
      select: { slug: true, updatedAt: true },
    })

    const dateFallback = new Date().toISOString()
    const entries = results.docs
      .filter((project) => Boolean(project?.slug))
      .map((project) => ({
        loc: `${SITE_URL}/projects/${project.slug}`,
        lastmod: project.updatedAt || dateFallback,
      }))

    // The index page only exists once there is a public project.
    return entries.length > 0
      ? [{ loc: `${SITE_URL}/projects`, lastmod: entries[0].lastmod }, ...entries]
      : []
  },
  ['projects-sitemap'],
  { tags: ['collection_projects'] },
)

export async function GET() {
  return getServerSideSitemap(await getProjectsSitemap())
}
