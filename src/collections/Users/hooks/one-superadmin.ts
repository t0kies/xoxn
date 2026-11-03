import type { CollectionBeforeChangeHook, CollectionBeforeDeleteHook } from 'payload'
import { APIError } from 'payload'

// one owner only
export const enforceSingleSuperAdmin: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (data?.role !== 'superadmin') return data

  const existing = await req.payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [
        { role: { equals: 'superadmin' } },
        ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
      ],
    },
  })

  if (existing.docs.length > 0) {
    throw new APIError(
      `A superadmin already exists (${existing.docs[0].email}). Only one is allowed, set by SUPERADMIN_EMAIL.`,
      400,
    )
  }

  return data
}

// the owner can't be deleted
export const preventSoleSuperAdminDeletion: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const target = await req.payload.findByID({
    collection: 'users',
    id,
    depth: 0,
    overrideAccess: true,
  })

  if (target?.role === 'superadmin') {
    throw new APIError(
      'The superadmin account cannot be deleted. Change SUPERADMIN_EMAIL to reassign the role first.',
      400,
    )
  }
}
