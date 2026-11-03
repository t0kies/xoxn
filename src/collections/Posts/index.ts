import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { ownerOnly, publishedOrOwner } from '@/access/roles'
import { seoTab } from '@/fields/seo-tab'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit-log'
import { capPublicReadLimit } from '@/hooks/cap-public-read-limit'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'
import { postSidebar } from './sidebar'
import { contentTab, metaTab } from './tabs'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  labels: { singular: 'Blog post', plural: 'Blog posts' },
  access: {
    create: ownerOnly,
    delete: ownerOnly,
    read: publishedOrOwner,
    readVersions: ownerOnly, // versions hold every draft
    update: ownerOnly,
  },
  // what a post carries when embedded; listings show its date
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    publishedAt: true,
    meta: { image: true, description: true },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => generatePreviewPath({ slug: data?.slug, collection: 'posts', req }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({ slug: data?.slug as string, collection: 'posts', req }),
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { type: 'tabs', tabs: [contentTab, metaTab, seoTab] },
    ...postSidebar,
    slugField(),
  ],
  hooks: {
    beforeOperation: [capPublicReadLimit],
    afterChange: [revalidatePost, auditAfterChange],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete, auditAfterDelete],
  },
  versions: {
    drafts: { autosave: { interval: 100 }, schedulePublish: true }, // in ms, for live preview
    maxPerDoc: 50,
  },
}
