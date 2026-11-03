import type { CollectionConfig } from 'payload'

import { rateLimitAnonymous } from '../../hooks/rate-limit'
import { rejectHoneypot } from './hooks/reject-honeypot'
import { anyone, ownerOnly } from '@/access/roles'

export const Waitlist: CollectionConfig = {
  slug: 'waitlist',
  labels: {
    singular: 'Waitlist signup',
    plural: 'Waitlist',
  },
  access: {
    create: anyone,
    delete: ownerOnly,
    read: ownerOnly,
    update: ownerOnly,
  },
  hooks: {
    beforeOperation: [rateLimitAnonymous('waitlist', 5, 60 * 60_000)],
    beforeValidate: [rejectHoneypot],
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'createdAt'],
    description: 'Emails collected from the coming-soon status page.',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
  ],
  timestamps: true,
}
