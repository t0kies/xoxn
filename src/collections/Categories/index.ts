import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'
import { capPublicReadLimit } from '@/hooks/cap-public-read-limit'
import { anyone, ownerOnly } from '@/access/roles'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit-log'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: ownerOnly,
    delete: ownerOnly,
    read: anyone,
    update: ownerOnly,
  },
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    beforeOperation: [capPublicReadLimit],
    afterChange: [auditAfterChange],
    afterDelete: [auditAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}
