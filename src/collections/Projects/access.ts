import type { Access, Where } from 'payload'

import { isOwner } from '@/access/roles'

const publicAndPublished: Where = {
  and: [{ visibility: { equals: 'public' } }, { _status: { equals: 'published' } }],
}

// The owner reads everything; everyone else reads public, published projects.
export const readProjects: Access = ({ req: { user } }) =>
  isOwner(user) ? true : publicAndPublished
