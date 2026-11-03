import type { CollectionConfig } from 'payload'

import { canUseAdmin, ownerOnly, selfOrOwner } from '@/access/roles'
import { rateLimitAnonymous } from '@/hooks/rate-limit'
import { userFields } from './fields'
import { disableFirstRegister } from './endpoints/disable-first-register'
import { checkLoginAllowed } from './hooks/check-login-allowed'
import { enforceSingleSuperAdmin, preventSoleSuperAdminDeletion } from './hooks/one-superadmin'
import { enforcePasswordPolicy } from './hooks/password-policy'
import { auditAfterChange, auditAfterDelete, auditLogin } from '@/hooks/audit-log'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Account', plural: 'Accounts' },
  access: {
    admin: ({ req }) => canUseAdmin(req.user),
    create: ownerOnly,
    delete: ownerOnly,
    read: selfOrOwner,
    update: selfOrOwner,
  },
  endpoints: [disableFirstRegister],
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    description: 'The owner account, set from SUPERADMIN_EMAIL. There is exactly one.',
    group: 'Work',
    useAsTitle: 'name',
  },
  auth: {
    maxLoginAttempts: 0, // no lockout: anyone knowing the email could keep it locked; the IP limit slows guessing
    tokenExpiration: 8 * 60 * 60, // in s, a working day
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  hooks: {
    beforeOperation: [
      enforcePasswordPolicy,
      // 10 sign-ins per IP per 15 minutes, 5 reset emails per IP per hour.
      rateLimitAnonymous('login', 10, 15 * 60_000, ['login']),
      rateLimitAnonymous('forgot', 5, 60 * 60_000, ['forgotPassword']),
    ],
    beforeLogin: [checkLoginAllowed],
    afterLogin: [auditLogin],
    beforeChange: [enforceSingleSuperAdmin],
    beforeDelete: [preventSoleSuperAdminDeletion],
    afterChange: [auditAfterChange],
    afterDelete: [auditAfterDelete],
  },
  fields: userFields,
  timestamps: true,
}
