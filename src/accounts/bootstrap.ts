import type { Payload } from 'payload'

import { ensureSuperAdmin } from './ensure-superadmin'

// runs on every start, so changing the owner's email or password in the env and redeploying applies it
export const bootstrapAccounts = async (payload: Payload): Promise<void> => {
  await ensureSuperAdmin(payload)
}
