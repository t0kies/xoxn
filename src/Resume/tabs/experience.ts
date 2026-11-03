import type { Tab } from 'payload'

import { validateUrl } from '@/utilities/validate-url'

import { tailorTags } from '../fields'
import { scenes } from '@/blocks/scenes'

// The Experience tab: jobs with their bullets, and projects with showcase scenes.
export const experienceTab: Tab = {
  label: 'Experience',
  fields: [
    {
      name: 'experience',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'role', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'company', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'location', type: 'text', admin: { width: '34%' } },
            {
              name: 'start',
              type: 'text',
              required: true,
              admin: { width: '33%', description: 'e.g. "2021" or "Mar 2021"' },
            },
            {
              name: 'end',
              type: 'text',
              admin: { width: '33%', description: 'Leave empty for "Present".' },
            },
          ],
        },
        tailorTags,
        {
          name: 'bullets',
          type: 'array',
          maxRows: 8,
          fields: [{ name: 'text', type: 'textarea', required: true }, tailorTags],
        },
      ],
    },
    {
      name: 'projectsOnSheet',
      type: 'checkbox',
      defaultValue: true,
      label: 'Also list projects on the one-pager',
      admin: {
        description:
          'Off: projects only appear in the portfolio under the one-pager (handy when your experience bullets already cover them and the page must print on one sheet).',
      },
    },
    {
      name: 'projects',
      type: 'array',
      maxRows: 10,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'url', type: 'text', validate: validateUrl, admin: { width: '60%' } },
          ],
        },
        { name: 'description', type: 'textarea' },
        {
          name: 'tags',
          type: 'text',
          admin: { description: 'Comma-separated, e.g. "Next.js, Postgres"' },
        },
        tailorTags,
        {
          name: 'scenes',
          type: 'blocks',
          label: 'Portfolio scenes',
          blocks: scenes,
          admin: {
            description:
              'Optional. Shown in the scrolling portfolio below the one-pager (screen only, never printed). The project URL above becomes the "View project" link.',
            initCollapsed: true,
          },
        },
      ],
    },
  ],
}
