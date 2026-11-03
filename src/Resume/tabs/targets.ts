import type { Tab, TextFieldSingleValidation } from 'payload'

import { randomBytes } from 'crypto'

const validateSlug: TextFieldSingleValidation = (value) => {
  if (!value) return 'Required'
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
    ? true
    : 'Lowercase letters, numbers and single dashes only (e.g. acme-frontend).'
}

export const resumeSections = [
  { label: 'Summary', value: 'summary' },
  { label: 'Highlights', value: 'highlights' },
  { label: 'Experience', value: 'experience' },
  { label: 'Projects (sheet and portfolio)', value: 'projects' },
  { label: 'Skills', value: 'skills' },
  { label: 'Education', value: 'education' },
  { label: 'More (extras)', value: 'extras' },
] as const

// The Tailored versions tab: one copy of the resume per job application.
export const targetsTab: Tab = {
  label: 'Tailored versions',
  description:
    'One per job application. Each lives at /resume/<slug>--<random key> (copy it from "Link to send"), is never indexed by search engines, and shows a "Prepared for" line plus your note. Highlights, jobs, bullets, projects, skill groups, education and extras each have a "Tailored versions" picker: a version shows only what is ticked for it. Hide sections drops whole sections here.',
  fields: [
    {
      name: 'targets',
      type: 'array',
      admin: { initCollapsed: true },
      validate: (rows: unknown) => {
        const slugs = ((rows as { slug?: string }[] | null) || []).map((r) => r?.slug)
        const dupe = slugs.find((slug, i) => slug && slugs.indexOf(slug) !== i)
        return dupe ? `Two versions share the slug "${dupe}".` : true
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'slug',
              type: 'text',
              required: true,
              validate: validateSlug,
              admin: { width: '34%', description: 'Start of the link, e.g. acme-frontend' },
            },
            { name: 'company', type: 'text', required: true, admin: { width: '33%' } },
            { name: 'role', type: 'text', admin: { width: '33%' } },
          ],
        },
        // The random half of the link (see targetPath.ts), made once on first save.
        {
          name: 'key',
          type: 'text',
          admin: { hidden: true },
          hooks: {
            beforeChange: [({ value }) => value || randomBytes(6).toString('hex')],
          },
        },
        {
          name: 'link',
          type: 'ui',
          admin: { components: { Field: '@/Resume/target-link-field#TargetLinkField' } },
        },
        {
          name: 'note',
          type: 'textarea',
          admin: { description: 'One or two lines on why you fit this role.' },
        },
        {
          name: 'summary',
          type: 'textarea',
          admin: { description: 'Replaces the main summary for this version. Optional.' },
        },
        {
          name: 'emphasize',
          type: 'text',
          admin: {
            description:
              'Comma-separated skills to highlight for this role (matched against your skills, case-insensitive).',
          },
        },
        {
          name: 'hideSections',
          type: 'select',
          hasMany: true,
          options: [...resumeSections],
          admin: { description: 'Sections to leave off this version entirely.' },
        },
      ],
    },
  ],
}
