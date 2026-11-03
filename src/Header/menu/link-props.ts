import type { NavNode } from '../nav-tree'

export const isCurrent = (href: string, pathname: string) =>
  href === pathname || (href !== '/' && pathname.startsWith(`${href}/`))

export const linkProps = (node: NavNode, pathname: string) => ({
  'aria-current': isCurrent(node.href, pathname) ? ('page' as const) : undefined,
  href: node.href,
  ...(node.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}),
})
