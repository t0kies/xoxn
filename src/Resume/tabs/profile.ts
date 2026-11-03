import type { Tab } from 'payload'

import { validateUrl } from '@/utilities/validate-url'

import { tailorTags } from '../fields'

// The Profile tab: who you are, how to reach you, the summary and highlights.
export const profileTab: Tab = {
  label: 'Profile',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Senior Frontend Engineer"' },
    },
    {
      type: 'row',
      fields: [
        { name: 'location', type: 'text', admin: { width: '50%' } },
        {
          name: 'availability',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Short status line, e.g. "Open to remote roles".',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', admin: { width: '50%' } },
        { name: 'phone', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional square photo or mark.' },
    },
    {
      name: 'links',
      type: 'array',
      maxRows: 6,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '35%' } },
            {
              name: 'url',
              type: 'text',
              required: true,
              validate: validateUrl,
              admin: { width: '65%' },
            },
          ],
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: { description: 'Two to four sentences. Tailored versions can replace it.' },
    },
    {
      name: 'highlights',
      type: 'array',
      maxRows: 4,
      admin: {
        description: 'Big-number stats across the top, e.g. "9 yrs" / "shipping web apps".',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', required: true, admin: { width: '30%' } },
            { name: 'label', type: 'text', required: true, admin: { width: '70%' } },
          ],
        },
        tailorTags,
      ],
    },
  ],
}
