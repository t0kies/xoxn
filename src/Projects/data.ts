import type { Project, User } from '@/payload-types'

import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'
import { getPayload } from 'payload'


// Public, published projects for /projects: featured first, then newest. Cached until a project changes.
export const getPublicProjects = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'projects',
      depth: 1,
      limit: 100,
      overrideAccess: false,
      sort: ['-featured', '-publishedAt'],
      where: { visibility: { equals: 'public' }, _status: { equals: 'published' } },
    })
    return result.docs
  },
  ['public-projects'],
  { tags: ['collection_projects'] },
)

// the owner gets drafts and private projects, visitors the published public one
export const getProjectForViewer = async (
  slug: string,
): Promise<{ project: Project | null; viewer: User | null }> => {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  const viewer = (user as User | null) ?? null

  const result = await payload.find({
    collection: 'projects',
    depth: 2,
    draft: Boolean(viewer),
    limit: 1,
    overrideAccess: false,
    user: viewer ?? undefined,
    where: { slug: { equals: slug } },
  })

  return { project: result.docs[0] ?? null, viewer }
}


export const KIND_LABELS: Record<Project['kind'], string> = {
  client: 'Client work',
  product: 'Product',
  demo: 'Demo',
  hardware: 'Hardware',
  oss: 'Open source',
}

export const STAGE_LABELS: Record<Project['stage'], string> = {
  planning: 'Planning',
  active: 'In progress',
  shipped: 'Shipped',
  maintained: 'Maintained',
  archived: 'Archived',
}

export const stackNames = (project: Pick<Project, 'technologies'>): string[] =>
  (project.technologies || [])
    .map((tech) => (typeof tech === 'object' && tech ? tech.name : null))
    .filter((name): name is string => Boolean(name))

export const yearRange = (project: Pick<Project, 'startedOn' | 'shippedOn'>): string | null => {
  const start = project.startedOn ? new Date(project.startedOn).getUTCFullYear() : null
  const end = project.shippedOn ? new Date(project.shippedOn).getUTCFullYear() : null
  if (start && end) return start === end ? String(start) : `${start}–${end}`
  return start ? `${start}–now` : end ? String(end) : null
}
