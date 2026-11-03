import type { NavNode } from './nav-tree'

// Built-ins next to the nav tree.
export const BUILTINS: NavNode[] = [
  { name: 'home', label: 'Home', href: '/' },
  { name: 'search', label: 'Search', href: '/search' },
]

export type Resolved = {
  // Fully typed path segments that matched, in order.
  trail: NavNode[]
  // The segment being typed (after the last `/`).
  partial: string
  // Candidates for `partial` among the current node's children.
  matches: NavNode[]
  // A typed segment (before the last `/`) that matches nothing.
  broken?: string
  // `search <query>`
  query?: string
}

// Shell habits are forgiven: `cd blog`, `./blog`, `/blog` and `~/blog` all
// mean `blog`; segments are separated by `/`.
export const resolve = (raw: string, roots: NavNode[]): Resolved => {
  const input = raw
    .trimStart()
    .toLowerCase()
    .replace(/^cd\s+/, '')
    .replace(/^(~\/|\.\/|\/)/, '')

  const search = input.match(/^search\s+(.*)$/)
  if (search) {
    return { trail: [BUILTINS[1]], partial: '', matches: [], query: search[1].trim() }
  }

  const segments = input.split('/')
  const partial = segments.pop() ?? ''
  const trail: NavNode[] = []
  let level = roots
  for (const segment of segments) {
    const node = level.find((n) => n.name === segment)
    if (!node) return { trail, partial, matches: [], broken: segment }
    trail.push(node)
    level = node.children || []
  }
  // `search <words>` works anywhere, but it's only offered once you start typing it.
  const offered = (n: NavNode) => partial || trail.length || n.name !== 'search'
  return { trail, partial, matches: level.filter((n) => n.name.startsWith(partial) && offered(n)) }
}
