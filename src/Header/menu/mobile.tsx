'use client'
import Link from 'next/link'
import React from 'react'

import type { NavNode } from '../nav-tree'
import { linkProps } from './link-props'

// touch devices: the top level only, one link per line
export const MobileMenu: React.FC<{ nodes: NavNode[]; pathname: string }> = ({
  nodes,
  pathname,
}) => (
  <ul
    className="container flex flex-col border-t-2 border-line py-[0.5lh] desk:hidden [&_a]:block [&_a]:py-[0.25lh] [&_a]:text-body [&_a[aria-current]]:text-link"
    id="mobile-menu"
  >
    {nodes.map((node) => (
      <li key={node.name}>
        <Link {...linkProps(node, pathname)}>{node.name}</Link>
      </li>
    ))}
  </ul>
)
