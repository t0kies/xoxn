import type { CollectionConfig } from 'payload'

import { ownerOnly } from '@/access/roles'

// written by hooks only (hooks/audit-log.ts), shown as Activity
export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  labels: { singular: 'Activity entry', plural: 'Activity' },
  access: {
    create: () => false,
    update: () => false,
    delete: () => false,
    read: ownerOnly,
  },
  admin: {
    group: 'System',
    useAsTitle: 'docTitle',
    defaultColumns: ['createdAt', 'action', 'target', 'docTitle', 'userLabel'],
    description:
      'Read-only log of publishes, edits, deletes and sign-ins. Draft autosaves are not logged. Entries older than 12 months are purged.',
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'action',
      type: 'select',
      required: true,
      index: true,
      options: ['create', 'update', 'delete', 'publish', 'unpublish', 'login'],
    },
    {
      name: 'target',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Collection or global' },
    },
    { name: 'docId', type: 'text', index: true },
    { name: 'docTitle', type: 'text' },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'userLabel', type: 'text', admin: { description: 'Email at the time of the action' } },
    { name: 'changedFields', type: 'json' },
  ],
  timestamps: true,
}
