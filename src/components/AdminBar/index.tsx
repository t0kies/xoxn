'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { useCurrentDoc } from './use-current-doc'

type Me = { id: number | string; role?: string; name?: string | null; email?: string }
// The owner's tmux-style toolbar under the status line: edit what's on screen, start a post or
// project, flip draft previews, see the site status, jump to the dashboard, sign out.
export const AdminBar: React.FC<{ draft?: boolean }> = ({ draft }) => {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)
  const [me, setMe] = useState<Me | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const owner = me?.role === 'superadmin'
  const doc = useCurrentDoc(pathname, owner)

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setMe(data?.user ?? null))
      .catch(() => setMe(null))
  }, [])

  useEffect(() => {
    if (!owner) return
    fetch('/api/globals/site-status?depth=0', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setStatus(data?.status ?? null))
      .catch(() => setStatus(null))
  }, [owner])

  useEffect(() => {
    const root = document.documentElement.style
    const el = ref.current
    if (!owner || !el) return root.setProperty('--admin-bar-height', '0px') // the status line sits above
    const publish = () => root.setProperty('--admin-bar-height', `${el.offsetHeight}px`)
    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(el)
    return () => {
      observer.disconnect()
      root.setProperty('--admin-bar-height', '0px')
    }
  }, [owner])

  if (!owner) return null

  const logout = async () => {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
    window.location.reload()
  }

  const draftHref = `/next/draft?${new URLSearchParams({ mode: draft ? 'off' : 'on', path: pathname })}`

  return (
    <div className="tui-adminbar print:hidden" ref={ref}>
      <span className="tui-adminbar-mode">admin</span>
      {doc ? (
        <Link href={doc.href} prefetch={false}>
          edit {doc.label}
        </Link>
      ) : (
        <span className="text-dim">nothing to edit here</span>
      )}
      <Link href="/admin/collections/posts/create" prefetch={false}>
        + post
      </Link>
      <Link href="/admin/collections/projects/create" prefetch={false}>
        + project
      </Link>
      <a className={draft ? 'text-yellow' : undefined} href={draftHref}>
        drafts: {draft ? 'on' : 'off'}
      </a>
      {status && (
        <Link
          className={status === 'live' ? 'text-green' : 'text-yellow'}
          href="/admin/globals/site-status"
          prefetch={false}
        >
          site: {status.replace(/-/g, ' ')}
        </Link>
      )}
      <span className="flex-1" />
      <Link href="/admin" prefetch={false}>
        dashboard
      </Link>
      <button onClick={logout} type="button">
        log out
      </button>
    </div>
  )
}
