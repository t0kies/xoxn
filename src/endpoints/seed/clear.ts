import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from 'payload'

import { context } from './context'

// Cleared one at a time, dependents before their targets: parallel deletes deadlock in Postgres.
const collections: CollectionSlug[] = [
  'search',
  'form-submissions',
  'waitlist',
  'projects',
  'technologies',
  'showcase-files',
  'posts',
  'pages',
  'forms',
  'categories',
  'media',
]

// narrowed so updateGlobal types `data` against these two (both have navItems)
const globals = ['header', 'footer'] as const satisfies readonly GlobalSlug[]

export const clearContent = async (payload: Payload, req: PayloadRequest) => {
  for (const global of globals) {
    await payload.updateGlobal({
      slug: global,
      data: { navItems: [] },
      depth: 0,
      context,
      overrideAccess: true,
    })
  }
  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }
}
