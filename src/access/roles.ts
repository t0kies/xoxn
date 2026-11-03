import type { Access, FieldAccess, PayloadRequest } from 'payload'

// One account runs the site: the owner, set from env (SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD).
// Every rule is enforced here or in hooks on the server; the admin only mirrors it.
export const ROLES = ['superadmin'] as const
export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  superadmin: 'Owner',
}

type ID = number | string

// structural, so it works on req.user and before the types are regenerated
export type AppUser = {
  id: ID
  role?: string | null
}

const asUser = (user: unknown): AppUser | null =>
  user && typeof user === 'object' ? (user as AppUser) : null

export const roleOf = (user: unknown): Role | null => {
  const role = asUser(user)?.role
  return ROLES.includes(role as Role) ? (role as Role) : null
}

export const isOwner = (user: unknown): boolean => roleOf(user) === 'superadmin'

// Can this account sign in and use the admin panel? Only the owner can.
export const canUseAdmin = (user: unknown): boolean => isOwner(user)

// access functions
export const anyone: Access = () => true

export const ownerOnly: Access = ({ req }) => isOwner(req.user)

export const ownerOnlyField: FieldAccess = ({ req }) => isOwner(req.user)

// Drafts for the owner only; everyone else sees published docs.
export const publishedOrOwner: Access = ({ req }) => {
  if (isOwner(req.user)) return true
  return { _status: { equals: 'published' } }
}

// The owner sees every account; anyone else only their own.
export const selfOrOwner: Access = ({ req, id }) => {
  const user = asUser(req.user)
  if (!user) return false
  if (isOwner(user)) return true
  if (id !== undefined) return String(user.id) === String(id)
  return { id: { equals: user.id } }
}

export const requestIsOwner = (req: PayloadRequest): boolean => isOwner(req.user)
