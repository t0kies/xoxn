'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

// The end of a pager: `(END)`, and `q` (outside a text field) goes back to `href`.
export const PagerEnd: React.FC<{ href: string; label: string }> = ({ href, label }) => {
  const router = useRouter()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'q' || e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (
        target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')
      )
        return
      e.preventDefault()
      router.push(href)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [href, router])

  return (
    <p className="text-sm text-dim">
      (END){' '}
      <Link aria-keyshortcuts="q" className="tui-link" href={href} title="press q">
        q
      </Link>{' '}
      {label}
    </p>
  )
}
