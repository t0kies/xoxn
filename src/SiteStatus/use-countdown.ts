'use client'
import { useEffect, useState } from 'react'

// hh:mm:ss until target, ticking every second
export const useCountdown = (target?: string) => {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!target) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])

  if (!target) return null

  const diff = new Date(target).getTime() - now
  if (diff <= 0) return '00:00:00'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':')
}
