import type { Field } from 'payload'

import { validateUrl } from '@/utilities/validate-url'

// live site, repo, demo, store page; the first one is the main call to action
export const projectLinks: Field = {
  name: 'links',
  type: 'array',
  labels: { singular: 'Link', plural: 'Links' },
  admin: {
    description: 'Live site, repo, demo, store page. The first one is the main call to action.',
    initCollapsed: true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'kind',
          type: 'select',
          defaultValue: 'live',
          admin: { width: '25%' },
          options: [
            { label: 'Live', value: 'live' },
            { label: 'Demo', value: 'demo' },
            { label: 'Source', value: 'source' },
            { label: 'Docs', value: 'docs' },
            { label: 'Other', value: 'other' },
          ],
        },
        { name: 'label', type: 'text', admin: { width: '25%' } },
        {
          name: 'url',
          type: 'text',
          required: true,
          validate: validateUrl,
          admin: { width: '50%' },
        },
      ],
    },
  ],
}
