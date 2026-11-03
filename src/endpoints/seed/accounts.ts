import type { Payload } from 'payload'

import { ensureSuperAdmin } from '@/accounts/ensure-superadmin'

// The owner comes from env on startup; outside production the seed makes sure it exists.
// The seed is reachable over HTTP, so it never creates logins in production.
export const seedAccounts = async (payload: Payload) => {
  if (process.env.NODE_ENV !== 'production') await ensureSuperAdmin(payload)
  const owner = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
    where: { role: { equals: 'superadmin' } },
  })
  return { ownerId: owner.docs[0]?.id }
}
