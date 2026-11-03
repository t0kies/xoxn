import type { Field } from 'payload'

// publishedAt, the authors, and populatedAuthors: a read-only copy the
// populateAuthors hook fills, since users can't be read publicly.
export const postSidebar: Field[] = [
  {
    name: 'publishedAt',
    type: 'date',
    admin: { date: { pickerAppearance: 'dayAndTime' }, position: 'sidebar' },
    hooks: {
      beforeChange: [
        ({ siblingData, value }) =>
          siblingData._status === 'published' && !value ? new Date() : value,
      ],
    },
  },
  {
    name: 'authors',
    type: 'relationship',
    admin: { position: 'sidebar' },
    hasMany: true,
    relationTo: 'users',
  },
  {
    name: 'populatedAuthors',
    type: 'array',
    access: { update: () => false },
    admin: { disabled: true, readOnly: true },
    fields: [
      { name: 'id', type: 'text' },
      { name: 'name', type: 'text' },
    ],
  },
]
