import { createLocalReq, getPayload } from 'payload'
import { seed } from '@/endpoints/seed'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

import { isSeedAllowed } from '@/endpoints/seed/allowed'
import { isOwner } from '@/access/roles'

export const maxDuration = 60 // in s

export async function POST(): Promise<Response> {
  // Checked before auth: with ALLOW_SEED unset the route is dead for everyone.
  if (!isSeedAllowed()) {
    return new Response('Seeding is disabled. Set ALLOW_SEED=true and restart.', { status: 403 })
  }

  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  // Only the admin UI's "Seed your database" button calls this, so a
  // logged-in superadmin session is the one way in.
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user || !isOwner(user)) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    // Create a Payload request object to pass to the Local API for transactions
    const payloadReq = await createLocalReq({ user }, payload)

    await seed({ payload, req: payloadReq })

    // Seeding skips the per-document revalidation hooks, so drop every cached
    // page and global at once; otherwise the site keeps serving pre-seed data.
    revalidatePath('/', 'layout')

    return Response.json({ success: true })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error seeding data' })
    return new Response('Error seeding data.', { status: 500 })
  }
}
