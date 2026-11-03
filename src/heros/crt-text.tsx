'use client'
import React, { useEffect, useRef } from 'react'

import { cn } from '@/utilities/ui'

// The first glitch comes once the hero has settled, then one every GAP, at
// most MAX per page: rare enough to stay a surprise. Each is one smooth
// LENGTH ms drift with no change in brightness, so nothing flashes.
const FIRST: [number, number] = [5000, 12000]
const GAP: [number, number] = [12000, 35000]
const MAX = 4
const LENGTH = 700

const between = ([min, max]: [number, number]) => min + Math.random() * (max - min)

// fringes, glow and a rare glitch; still with effects off, reduced motion or a hidden tab
export const CrtText: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || document.documentElement.dataset.effects === 'false') return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer: ReturnType<typeof setTimeout> | undefined
    let count = 0

    const schedule = (range: [number, number]) => {
      timer = setTimeout(glitch, between(range))
    }
    const glitch = () => {
      if (calm.matches || document.hidden) return schedule(GAP)
      el.dataset.glitch = ''
      timer = setTimeout(() => {
        delete el.dataset.glitch
        if (++count < MAX) schedule(GAP)
      }, LENGTH)
    }

    schedule(FIRST)
    return () => {
      clearTimeout(timer)
      delete el.dataset.glitch
    }
  }, [])

  return (
    <div className={cn('crt-text', className)} ref={ref}>
      {children}
    </div>
  )
}
