import type { Field } from 'payload'

export const projectSidebar: Field[] = [
  {
    name: 'visibility',
    type: 'select',
    required: true,
    defaultValue: 'private',
    admin: {
      components: { Cell: '@/components/admin/cells#PillCell' },
      position: 'sidebar',
      description:
        'Public: on /projects once published. Private: only you.',
    },
    options: [
      { label: 'Public', value: 'public' },
      { label: 'Private', value: 'private' },
    ],
  },
  {
    name: 'featured',
    type: 'checkbox',
    defaultValue: false,
    admin: { position: 'sidebar', description: 'Pin to the top of /projects.' },
  },
  {
    name: 'publishedAt',
    type: 'date',
    admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
  },
]
