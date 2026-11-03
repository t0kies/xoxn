import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { anyone, ownerOnly } from '@/access/roles'
import { capPublicReadLimit } from '@/hooks/cap-public-read-limit'
import { revalidateCollection } from '@/hooks/revalidate-collection'
import { validateExternalUrl } from '@/utilities/validate-url'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit-log'

const revalidate = revalidateCollection('technologies', () => ['/projects'])

// The stack vocabulary: one row per language, framework, chip or tool, tagged on projects.
export const Technologies: CollectionConfig = {
  slug: 'technologies',
  labels: { singular: 'Technology', plural: 'Stack' },
  access: {
    create: ownerOnly,
    delete: ownerOnly,
    read: anyone,
    update: ownerOnly,
  },
  admin: {
    defaultColumns: ['name', 'category', 'updatedAt'],
    description: 'Languages, frameworks, hardware and tools you tag projects with.',
    group: 'Work',
    useAsTitle: 'name',
  },
  defaultPopulate: { name: true, slug: true, category: true },
  hooks: {
    beforeOperation: [capPublicReadLimit],
    afterChange: [revalidate.afterChange, auditAfterChange],
    afterDelete: [revalidate.afterDelete, auditAfterDelete],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'language',
          admin: { width: '50%' },
          options: [
            { label: 'Language', value: 'language' },
            { label: 'Framework / library', value: 'framework' },
            { label: 'Platform / infra', value: 'platform' },
            { label: 'Hardware', value: 'hardware' },
            { label: 'Tool', value: 'tool' },
          ],
        },
      ],
    },
    {
      name: 'url',
      type: 'text',
      label: 'Homepage',
      validate: validateExternalUrl,
    },
    slugField({ useAsSlug: 'name' }),
  ],
}
