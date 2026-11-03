import type { Tab } from 'payload'

import { projectLinks } from './links'

// kind, stage, stack, links and dates
export const overviewTab: Tab = {
  label: 'Overview',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'kind',
          type: 'select',
          required: true,
          defaultValue: 'product',
          admin: { width: '50%' },
          options: [
            { label: 'Client work', value: 'client' },
            { label: 'Product', value: 'product' },
            { label: 'Demo', value: 'demo' },
            { label: 'Hardware', value: 'hardware' },
            { label: 'Open source', value: 'oss' },
          ],
        },
        {
          name: 'stage',
          type: 'select',
          required: true,
          defaultValue: 'active',
          admin: {
            components: { Cell: '@/components/admin/cells#PillCell' },
            width: '50%',
          },
          options: [
            { label: 'Planning', value: 'planning' },
            { label: 'In progress', value: 'active' },
            { label: 'Shipped', value: 'shipped' },
            { label: 'Maintained', value: 'maintained' },
            { label: 'Archived', value: 'archived' },
          ],
        },
      ],
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'technologies',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
      label: 'Stack',
    },
    projectLinks,
    {
      type: 'row',
      fields: [
        {
          name: 'startedOn',
          type: 'date',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
          },
        },
        {
          name: 'shippedOn',
          type: 'date',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
          },
        },
      ],
    },
  ],
}
