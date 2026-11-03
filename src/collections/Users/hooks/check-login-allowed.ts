import type { CollectionBeforeLoginHook } from 'payload'
import { APIError } from 'payload'

import { canUseAdmin } from '@/access/roles'

// Only the owner signs in.
export const checkLoginAllowed: CollectionBeforeLoginHook = ({ user }) => {
  if (!canUseAdmin(user)) {
    throw new APIError('This account can\'t sign in.', 403)
  }
  return user
}
