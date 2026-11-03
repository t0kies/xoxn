import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate-global'
import { ownerOnly } from '@/access/roles'
import { auditGlobal } from '@/hooks/audit-log'

// what visitors see; read through the local API, gated in (frontend)/layout.tsx
export const SiteStatus: GlobalConfig = {
  slug: 'site-status',
  label: 'Site status',
  access: {
    read: ownerOnly,
    update: ownerOnly,
  },
  admin: {
    description:
      'Controls what every visitor sees on the public site. Only you (Owner) can change this.',
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'live',
      options: [
        { label: 'Live', value: 'live' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Coming soon', value: 'coming-soon' },
        { label: 'Under construction', value: 'under-construction' },
        { label: 'Offline', value: 'offline' },
      ],
      admin: {
        description:
          'Editors previewing via draft mode still see the real site regardless of this setting.',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      admin: {
        description: 'Shown to visitors on the status page.',
        condition: (data) => data.status !== 'live',
      },
    },
    {
      name: 'estimatedReturnTime',
      type: 'date',
      admin: {
        description: 'If set, the maintenance page counts down to this time.',
        condition: (data) => data.status === 'maintenance',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'bypassPaths',
      type: 'array',
      admin: {
        description: 'Paths still reachable during under-construction (e.g. /about, /contact).',
        condition: (data) => data.status === 'under-construction',
      },
      fields: [{ name: 'path', type: 'text', required: true }],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal(), auditGlobal],
  },
}
