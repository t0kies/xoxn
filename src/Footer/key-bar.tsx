'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export type Key = { label: string; href: string; newTab?: boolean }

const isCurrent = (href: string, pathname: string) =>
  href === pathname || (href !== '/' && pathname.startsWith(`${href}/`))

// key bar: 1-9 opens that link (not while typing); touch shows labels only
export const KeyBar: React.FC<{ keys: Key[] }> = ({ keys }) => {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || !/^[1-9]$/.test(e.key)) return
      const target = e.target as HTMLElement | null
      if (
        target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')
      )
        return
      const key = keys[Number(e.key) - 1]
      if (!key) return
      e.preventDefault()
      if (key.newTab) window.open(key.href, '_blank', 'noopener')
      else router.push(key.href)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [keys, router])

  return (
    <nav aria-label="Footer" className="tui-keybar">
      {keys.map((key, i) => (
        <Link
          aria-current={isCurrent(key.href, pathname) ? 'page' : undefined}
          aria-keyshortcuts={i < 9 ? String(i + 1) : undefined}
          href={key.href}
          key={key.href}
          title={i < 9 ? `press ${i + 1}` : undefined}
          {...(key.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
        >
          <kbd className="hidden desk:inline">{i < 9 ? i + 1 : ' '}</kbd>
          <span>{key.label}</span>
        </Link>
      ))}
    </nav>
  )
}
