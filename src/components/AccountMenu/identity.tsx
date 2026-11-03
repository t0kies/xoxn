'use client'
import React from 'react'

import { ROLE_LABELS, roleOf } from '@/access/roles'
import { Avatar, type FullUser } from './avatar'

// who is signed in, and as what
export const Identity: React.FC<{ user: FullUser }> = ({ user }) => {
  const role = roleOf(user)
  return (
    <div className="account-menu__identity">
      <Avatar size={40} user={user} />
      <div>
        <strong>{user.name || 'Your account'}</strong>
        <span>{user.email}</span>
        <span className="account-menu__role" data-role={role ?? undefined}>
          {role ? ROLE_LABELS[role] : 'No role'}
        </span>
      </div>
    </div>
  )
}
