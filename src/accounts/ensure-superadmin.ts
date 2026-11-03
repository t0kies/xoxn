import type { Payload } from 'payload'

import { pbkdf2, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

// same settings Payload hashes passwords with (local auth strategy)
const hashOf = async (password: string, salt: string) =>
  (await promisify(pbkdf2)(password, salt, 25000, 512, 'sha256')).toString('hex')

const samePassword = async (password: string, salt?: unknown, hash?: unknown) => {
  if (typeof salt !== 'string' || typeof hash !== 'string') return false
  const given = Buffer.from(await hashOf(password, salt), 'hex')
  const stored = Buffer.from(hash, 'hex')
  return given.length === stored.length && timingSafeEqual(given, stored)
}

// SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD are the source of truth, checked on every start:
// no owner makes one, a changed email or password updates it, anything else is left alone
export const ensureSuperAdmin = async (payload: Payload): Promise<void> => {
  const email = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.SUPERADMIN_PASSWORD

  if (!email || !password) {
    payload.logger.warn('SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD not set, skipping the owner account.')
    return
  }

  if (password.length < 12) {
    throw new Error('SUPERADMIN_PASSWORD must be at least 12 characters.')
  }

  const existing = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    showHiddenFields: true, // salt and hash
    where: { role: { equals: 'superadmin' } },
  })
  const owner = existing.docs[0] as (typeof existing.docs)[number] & { salt?: string; hash?: string }

  if (!owner) {
    await payload.create({
      collection: 'users',
      data: { name: 'Owner', email, password, role: 'superadmin' },
      overrideAccess: true,
    })
    payload.logger.info(`Owner ${email} created.`)
    return
  }

  const emailChanged = owner.email !== email
  const passwordChanged = !(await samePassword(password, owner.salt, owner.hash))
  if (!emailChanged && !passwordChanged) return

  await payload.update({
    id: owner.id,
    collection: 'users',
    data: { email, ...(passwordChanged ? { password } : {}) },
    overrideAccess: true,
  })
  payload.logger.info(
    `Owner updated from env: ${[emailChanged && 'email', passwordChanged && 'password'].filter(Boolean).join(' and ')}.`,
  )
}
