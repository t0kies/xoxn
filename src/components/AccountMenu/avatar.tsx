'use client'
import React from 'react'

import { type AppUser, roleOf } from '@/access/roles'

export type FullUser = AppUser & {
  name?: string | null
  email?: string
  company?: string | null
  profilePhoto?:
    { url?: string | null; focalX?: number | null; focalY?: number | null } | number | null
}

const photoOf = (user: FullUser | null) => {
  const photo = user?.profilePhoto
  return photo && typeof photo === 'object' && photo.url ? photo : null
}

const initialsOf = (user: FullUser | null) =>
  (user?.name || user?.email || '?')
    .trim()
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?'

export const Avatar: React.FC<{ user: FullUser | null; size?: number }> = ({ user, size = 28 }) => {
  const photo = photoOf(user)
  return (
    <span
      className="account-menu__avatar"
      data-role={roleOf(user) ?? undefined}
      style={{ height: size, width: size, fontSize: Math.max(9, size * 0.4) }} // in px
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          src={photo.url!}
          style={{ objectPosition: `${photo.focalX ?? 50}% ${photo.focalY ?? 50}%` }}
        />
      ) : (
        initialsOf(user)
      )}
    </span>
  )
}
