import type { Field } from 'payload'

import { ROLE_LABELS, ROLES, ownerOnlyField } from '@/access/roles'

export const userFields: Field[] = [
  {
    name: 'name',
    type: 'text',
  },
  {
    name: 'role',
    type: 'select',
    required: true,
    defaultValue: 'superadmin',
    options: ROLES.map((value) => ({ label: ROLE_LABELS[value], value })),
    access: {
      create: ownerOnlyField,
      update: ownerOnlyField,
    },
    admin: {
      components: { Cell: '@/components/admin/cells#PillCell' },
      description: 'Owner is set from SUPERADMIN_EMAIL and there is exactly one.',
    },
  },
  {
    name: 'profilePhoto',
    type: 'upload',
    relationTo: 'media',
    admin: {
      description: 'Shown in the admin panel account menu.',
    },
  },
]
