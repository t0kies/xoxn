import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

export type Features = { projects: boolean }

// Which optional sections have something to show. Empty ones get no nav link or sitemap entry.
export const getFeatures = unstable_cache(
  async (): Promise<Features> => {
    const payload = await getPayload({ config: configPromise })
    const projects = await payload.count({
      collection: 'projects',
      overrideAccess: false,
      where: { visibility: { equals: 'public' }, _status: { equals: 'published' } },
    })
    return { projects: projects.totalDocs > 0 }
  },
  ['features'],
  { tags: ['features', 'collection_projects'], revalidate: 3600 },
)

const FEATURE_PATHS: Record<keyof Features, string> = {
  projects: '/projects',
}

// never in menus: the resume is sent directly
const UNLISTED_PATHS = ['/resume']

const under = (href: string, path: string) => href === path || href.startsWith(`${path}/`)

// True for a custom-URL nav link that is unlisted or points into a section with nothing to show.
export const isHiddenPath = (href: string | null | undefined, features: Features): boolean => {
  if (!href) return false
  if (UNLISTED_PATHS.some((path) => under(href, path) || href.startsWith(`${path}.`))) return true
  return (Object.keys(FEATURE_PATHS) as (keyof Features)[]).some(
    (key) => !features[key] && under(href, FEATURE_PATHS[key]),
  )
}

type NavItem = { link?: { type?: string | null; url?: string | null } | null }

export const visibleNavItems = <T extends NavItem>(
  items: T[] | null | undefined,
  features: Features,
) =>
  (items || []).filter(
    (item) => !(item.link?.type === 'custom' && isHiddenPath(item.link.url, features)),
  )
