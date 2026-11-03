import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { ownerOnly, publishedOrOwner } from '@/access/roles'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { FormBlock } from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { seoTab } from '@/fields/seo-tab'
import { hero } from '@/heros/config'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit-log'
import { capPublicReadLimit } from '@/hooks/cap-public-read-limit'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: ownerOnly,
    delete: ownerOnly,
    read: publishedOrOwner,
    readVersions: ownerOnly, // versions hold every draft
    update: ownerOnly,
  },
  defaultPopulate: { title: true, slug: true }, // what a page carries when linked
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => generatePreviewPath({ slug: data?.slug, collection: 'pages', req }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({ slug: data?.slug as string, collection: 'pages', req }),
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        { fields: [hero], label: 'Hero' },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock],
              required: true,
              admin: { initCollapsed: true },
            },
          ],
          label: 'Content',
        },
        seoTab,
      ],
    },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    slugField(),
  ],
  hooks: {
    beforeOperation: [capPublicReadLimit],
    afterChange: [revalidatePage, auditAfterChange],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete, auditAfterDelete],
  },
  versions: {
    drafts: { autosave: { interval: 100 }, schedulePublish: true }, // in ms, for live preview
    maxPerDoc: 50,
  },
}
