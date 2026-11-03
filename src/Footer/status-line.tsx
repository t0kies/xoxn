'use client'

import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

// vim's ruler: Top, Bot, All, or how far down the page you are.
const scrollPosition = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight
  if (max <= 0) return 'All'
  if (window.scrollY <= 0) return 'Top'
  if (window.scrollY >= max - 1) return 'Bot'
  return `${Math.round((window.scrollY / max) * 100)}%`
}

// The pinned vim-style status line: mode, current path, scroll position.
export const StatusLine: React.FC<{ siteName: string }> = ({ siteName }) => {
  const pathname = usePathname()
  const [position, setPosition] = useState('Top')

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setPosition(scrollPosition()))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [pathname])

  return (
    <div aria-hidden className="tui-statusline print:hidden">
      <span className="tui-statusline-mode" />
      <span className="min-w-0 flex-1 truncate">
        <span className="text-green">{siteName}</span>:
        <span className="text-blue">~{pathname === '/' ? '' : pathname}</span>
      </span>
      <span className="hidden text-dim desk:inline">/ to browse · 1-9 footer links</span>
      <span>{position}</span>
    </div>
  )
}
