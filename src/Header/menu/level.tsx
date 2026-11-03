'use client'
import Link from 'next/link'
import React from 'react'

import type { NavNode } from '../nav-tree'
import { linkProps } from './link-props'

const MAX_ITEMS = 8 // long auto-filled submenus end with "all (n)"

type Props = {
  level: NavNode[]
  depth: number
  parent?: NavNode
  open: string[]
  pathname: string
  hover: (node: NavNode, depth: number, hasMenu: boolean) => void
}

export const Level: React.FC<Props> = ({ level, depth, parent, open, pathname, hover }) => (
  <>
    {(depth > 1 ? level.slice(0, MAX_ITEMS) : level).map((node) => {
      const hasMenu = Boolean(node.children?.length) && depth < 3
      const isOpen = open[depth - 1] === node.name
      return (
        <li
          data-depth={depth}
          data-name={node.name}
          data-open={isOpen || undefined}
          data-submenu={hasMenu ? '' : undefined}
          key={node.name}
          onMouseEnter={() => hover(node, depth, hasMenu)}
        >
          <Link
            {...linkProps(node, pathname)}
            aria-expanded={hasMenu ? isOpen : undefined}
            aria-haspopup={hasMenu ? 'menu' : undefined}
            title={depth > 1 && node.label.length > 32 ? node.label : undefined}
          >
            {depth === 1 ? node.name : <span className="truncate">{node.label}</span>}
          </Link>
          {hasMenu && isOpen && (
            <ul className={depth === 1 ? 'tui-menu tui-shadow' : 'tui-menu-branch'}>
              <Level
                {...{ open, pathname, hover }}
                depth={depth + 1}
                level={node.children!}
                parent={node}
              />
            </ul>
          )}
        </li>
      )
    })}
    {parent && level.length > MAX_ITEMS && (
      <li data-depth={depth} data-name="__all">
        <Link className="text-dim" href={parent.href}>
          all ({level.length}) →
        </Link>
      </li>
    )}
  </>
)
