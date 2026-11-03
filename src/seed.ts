import 'dotenv/config'
import { createLocalReq, getPayload } from 'payload'

import config from '@payload-config'
import { seed } from './endpoints/seed'

const run = async (): Promise<void> => {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)

  await seed({ payload, req })

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
