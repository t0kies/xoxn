import type { Header } from '@/payload-types'

import { resolveLinkHref } from '@/components/Link'
import { type Features, visibleNavItems } from '@/utilities/features'
import { autoChildren } from './auto-lists'
import { commandName, type NavNode, uniqueByName } from './nav-node'

export type { NavNode } from './nav-node'
export { NAV_DEPTH, commandName } from './nav-node'

type LinkData = NonNullable<Header['navItems']>[number]['link']

const fromLink = (link: LinkData, children?: NavNode[]): NavNode | null => {
  const href = resolveLinkHref(link)
  const name = commandName(link.label || '')
  if (!href || !name) return null
  return {
    name,
    label: link.label,
    href,
    newTab: link.newTab || undefined,
    children: children?.length ? children : undefined,
  }
}

// the Header global as the menu tree, auto-filled submenus included
export const getNavTree = async (header: Header, features: Features): Promise<NavNode[]> => {
  const items = visibleNavItems(header.navItems, features)

  return uniqueByName(
    await Promise.all(
      items.map(async (item) => {
        const auto =
          item.autoChildren && item.autoChildren !== 'none'
            ? await autoChildren[item.autoChildren]()
            : []
        const manual = (item.submenu || []).map((child) =>
          fromLink(
            child.link,
            uniqueByName((child.items || []).map((grandchild) => fromLink(grandchild.link))),
          ),
        )
        return fromLink(item.link, uniqueByName([...auto, ...manual]))
      }),
    ),
  )
}
