'use client'
import { useAuth } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

import type { FullUser } from './avatar'

// The signed-in account with its photo populated.
export const useFullUser = (): FullUser | null => {
  const { fetchFullUser, user } = useAuth()
  const [fullUser, setFullUser] = useState<FullUser | null>(null)
  const userId = user?.id
  useEffect(() => {
    if (!userId) return
    let cancelled = false
    fetchFullUser().then((u) => {
      if (!cancelled) setFullUser(u as unknown as FullUser)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]) // keyed on the id: fetchFullUser updates the auth context, which would loop
  if (!user) return null
  return fullUser ?? (user as unknown as FullUser)
}
