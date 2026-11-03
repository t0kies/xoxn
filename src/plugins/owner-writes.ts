import { anyone, ownerOnly } from '@/access/roles'

// The plugins default to "any signed-in user can write"; here only the owner can.
export const ownerWrites = { read: anyone, create: ownerOnly, update: ownerOnly, delete: ownerOnly }
