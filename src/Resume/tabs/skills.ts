import type { Tab } from 'payload'

import { tailorTags } from '../fields'

// The Skills & education tab: skill groups, education and extras.
export const skillsTab: Tab = {
  label: 'Skills & education',
  fields: [
    {
      name: 'skills',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'group', type: 'text', required: true },
        {
          name: 'items',
          type: 'text',
          required: true,
          admin: { description: 'Comma-separated.' },
        },
        tailorTags,
      ],
    },
    {
      name: 'education',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'credential', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'school', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'year', type: 'text', admin: { width: '20%' } },
          ],
        },
        tailorTags,
      ],
    },
    {
      name: 'extras',
      type: 'array',
      admin: {
        description: 'Small labelled facts, e.g. Languages / English, Spanish.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '35%' } },
            { name: 'value', type: 'text', required: true, admin: { width: '65%' } },
          ],
        },
        tailorTags,
      ],
    },
  ],
}
