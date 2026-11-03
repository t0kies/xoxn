import type { Field } from 'payload'

import { validateExternalUrl } from '@/utilities/validate-url'

export const socialLinks: Field = {
  name: 'socialLinks',
  type: 'array',
  fields: [
    {
      name: 'platform',
      type: 'select',
      required: true,
      options: [
        { label: 'Instagram', value: 'instagram' },
        { label: 'Twitch', value: 'twitch' },
        { label: 'YouTube', value: 'youtube' },
        { label: 'TikTok', value: 'tiktok' },
        { label: 'GitHub', value: 'github' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      validate: validateExternalUrl,
    },
  ],
}
