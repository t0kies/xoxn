import 'dotenv/config'
import { getPayload } from 'payload'

import config from '@payload-config'
import { ensureSuperAdmin } from './accounts/ensure-superadmin'

const run = async (): Promise<void> => {
  const payload = await getPayload({ config })

  await ensureSuperAdmin(payload)

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
