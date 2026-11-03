'use client'
import { useEffect, useState } from 'react'

export type Doc = { label: string; href: string } | null

// what the current URL shows, as the admin collection and slug to look up
const routeDoc = (pathname: string): { collection: string; slug: string } | Doc => {
  const [first, second] = pathname.split('/').filter(Boolean)
  if (!first) return { collection: 'pages', slug: 'home' }
  if (first === 'resume') return { label: 'resume', href: '/admin/globals/resume' }
  if (first === 'blog' || first === 'projects') {
    const collection = first === 'blog' ? 'posts' : first // the blog is the posts collection
    return second
      ? { collection, slug: decodeURIComponent(second) }
      : { label: first, href: `/admin/collections/${collection}` }
  }
  if (first === 'search' || first === 'privacy-policy') return null
  return { collection: 'pages', slug: decodeURIComponent(first) }
}

export const useCurrentDoc = (pathname: string, enabled: boolean): Doc => {
  const [doc, setDoc] = useState<Doc>(null)
  useEffect(() => {
    if (!enabled) return
    const route = routeDoc(pathname)
    if (!route || 'href' in route) return setDoc(route)
    const params = new URLSearchParams({
      'where[slug][equals]': route.slug,
      limit: '1',
      depth: '0',
      draft: 'true',
      'select[id]': 'true',
    })
    let cancelled = false
    fetch(`/api/${route.collection}?${params}`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const id = data?.docs?.[0]?.id
        if (!cancelled)
          setDoc(
            id
              ? {
                  label: route.collection.replace(/s$/, ''),
                  href: `/admin/collections/${route.collection}/${id}`,
                }
              : null,
          )
      })
      .catch(() => !cancelled && setDoc(null))
    return () => {
      cancelled = true
    }
  }, [pathname, enabled])
  return doc
}
