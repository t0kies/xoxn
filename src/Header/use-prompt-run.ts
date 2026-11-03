import { useRouter } from 'next/navigation'

import type { NavNode } from './nav-tree'

import { BUILTINS } from './resolve'

type Args = {
  close: () => void
  pathname: string
  isUp: boolean
  query?: string
  partial: string
  exact?: NavNode
  active?: NavNode
  trail: NavNode[]
}

// what Enter does: go up, search, or open the typed or highlighted page
export const usePromptRun = ({
  close,
  pathname,
  isUp,
  query,
  partial,
  exact,
  active,
  trail,
}: Args) => {
  const router = useRouter()

  const go = (node: NavNode, search?: string) => {
    close()
    const href = search ? `${node.href}?q=${encodeURIComponent(search)}` : node.href
    if (node.newTab || /^https?:\/\//.test(href)) window.open(href, '_blank', 'noopener')
    else router.push(href)
  }

  const run = () => {
    if (isUp) {
      close()
      router.push(pathname.replace(/\/[^/]*\/?$/, '') || '/')
      return
    }
    if (query !== undefined) return go(BUILTINS[1], query)
    const target = partial ? (exact ?? active) : trail.at(-1) // `blog/` runs blog, `blog/how` the highlighted match
    if (target) go(target)
  }

  return { go, run }
}
