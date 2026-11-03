import type { Payload } from 'payload'

// one owner from SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD; run from the server to take control back
// a new email moves the account instead of adding a second
export const ensureSuperAdmin = async (payload: Payload): Promise<void> => {
  const email = process.env.SUPERADMIN_EMAIL
  const password = process.env.SUPERADMIN_PASSWORD

  if (!email || !password) {
    payload.logger.warn(
      'SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD not set, skipping the owner account. Set both to create the superadmin account.',
    )
    return
  }

  if (password.length < 12) {
    throw new Error('SUPERADMIN_PASSWORD must be at least 12 characters.')
  }

  // The owner account, whatever email it has now: a changed SUPERADMIN_EMAIL moves it.
  const existing = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { role: { equals: 'superadmin' } },
  })

  if (existing.docs.length > 0) {
    await payload.update({
      id: existing.docs[0].id,
      collection: 'users',
      data: {
        email,
        role: 'superadmin',
        password,
      },
      overrideAccess: true,
    })
    payload.logger.info(`Superadmin ${email} updated: role asserted, password reset.`)
  } else {
    await payload.create({
      collection: 'users',
      data: {
        name: 'Owner',
        email,
        password,
        role: 'superadmin',
      },
      overrideAccess: true,
    })
    payload.logger.info(`Superadmin ${email} created.`)
  }
}
