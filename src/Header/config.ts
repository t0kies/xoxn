import type { ArrayField, Field, GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateGlobal } from '@/hooks/revalidate-global'
import { anyone, ownerOnly } from '@/access/roles'
import { auditGlobal } from '@/hooks/audit-log'

const navArray = (name: string, fields: Field[], maxRows: number): ArrayField => ({
  name,
  type: 'array',
  fields: [link({ appearances: false }), ...fields],
  maxRows,
  admin: {
    initCollapsed: true,
    components: {
      RowLabel: '@/Header/RowLabel#RowLabel',
    },
  },
})

// header menu, three levels; labels are also prompt commands, so keep them short
export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: anyone,
    update: ownerOnly,
  },
  fields: [
    navArray(
      'navItems',
      [
        {
          name: 'autoChildren',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Projects (each with its links)', value: 'projects' },
            { label: 'Blog (categories, each with its posts)', value: 'posts' },
          ],
          admin: {
            description:
              'Fill this item’s submenu from content, so it stays current on its own. Items added below come after.',
          },
        },
        navArray('submenu', [navArray('items', [], 12)], 12),
      ],
      8,
    ),
  ],
  hooks: {
    afterChange: [revalidateGlobal(), auditGlobal],
  },
}
