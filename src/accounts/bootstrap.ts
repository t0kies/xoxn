import type { Payload } from 'payload'

import { ensureSuperAdmin } from './ensure-superadmin'

// runs on every init: the standalone image can't run pnpm scripts
// only re-asserts the owner when SUPERADMIN_EMAIL changed, so admin password changes stick
export const bootstrapAccounts = async (payload: Payload): Promise<void> => {
  const superAdminEmail = process.env.SUPERADMIN_EMAIL
  const configuredSuperAdmin = await payload.count({
    collection: 'users',
    overrideAccess: true,
    where: {
      and: [{ role: { equals: 'superadmin' } }, { email: { equals: superAdminEmail ?? '' } }],
    },
  })

  if (configuredSuperAdmin.totalDocs === 0) {
    await ensureSuperAdmin(payload)
  }

}
