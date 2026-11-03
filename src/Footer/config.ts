import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateGlobal } from '@/hooks/revalidate-global'
import { anyone, ownerOnly } from '@/access/roles'
import { auditGlobal } from '@/hooks/audit-log'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: anyone,
    update: ownerOnly,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal(), auditGlobal],
  },
}
