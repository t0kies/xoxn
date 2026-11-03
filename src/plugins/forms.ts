import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { ownerOnly, ownerOnlyField } from '@/access/roles'
import { rejectHoneypot } from '@/collections/FormSubmissions/hooks/reject-honeypot'
import { rateLimitAnonymous } from '@/hooks/rate-limit'
import { ownerWrites } from './owner-writes'

const confirmationEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    FixedToolbarFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
  ],
})

export const forms = formBuilderPlugin({
  fields: { payment: false, country: false, state: false }, // a contact form, no payments or address pickers
  formOverrides: {
    access: ownerWrites,
    fields: ({ defaultFields }) =>
      defaultFields.map((field) => {
        if ('name' in field && field.name === 'emails') {
          return { ...field, access: { read: ownerOnlyField } } // inbox addresses stay private
        }
        if ('name' in field && field.name === 'confirmationMessage') {
          return { ...field, editor: confirmationEditor }
        }
        return field
      }),
  },
  formSubmissionOverrides: {
    access: { read: ownerOnly, update: ownerOnly, delete: ownerOnly },
    hooks: {
      beforeOperation: [rateLimitAnonymous('form', 10, 60 * 60_000)], // 10 an hour per IP
      beforeValidate: [rejectHoneypot],
    },
  },
})
