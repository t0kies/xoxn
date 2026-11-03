'use client'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import type { NavNode } from '../nav-tree'
import { menuKeys } from './keys'
import { Level } from './level'

export { MobileMenu } from './mobile'

const OPEN_DELAY = 90 // in ms, hover intent
const CLOSE_DELAY = 300 // in ms, forgives a pointer slipping off the bar

// The desk menu bar: one menu open at a time, by hover, click or ↓. A menu drops down from its
// item, nudged left only to stay on screen; the third level unfolds inline like a `tree` branch.
export const MenuBar: React.FC<{ nodes: NavNode[]; pathname: string }> = ({ nodes, pathname }) => {
  const barRef = useRef<HTMLUListElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [open, setOpen] = useState<string[]>([]) // [top] or [top, child]

  const later = (fn: () => void, ms: number) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(fn, ms)
  }
  useEffect(() => () => clearTimeout(timer.current), [])

  useLayoutEffect(() => {
    const menu = barRef.current?.querySelector<HTMLElement>(':scope > li[data-open] > .tui-menu')
    if (!menu) return
    menu.style.left = '0px'
    const overflow =
      menu.getBoundingClientRect().right - (document.documentElement.clientWidth - 16)
    if (overflow > 0) menu.style.left = `${-overflow}px`
  }, [open])

  const hover = (node: NavNode, depth: number, hasMenu: boolean) => {
    if (depth === 3) return clearTimeout(timer.current)
    const path = depth === 1 ? [node.name] : [open[0], node.name]
    if (depth === 1 && open.length) return later(() => setOpen(path), 0) // already browsing: switch at once
    later(() => setOpen(hasMenu || depth === 1 ? path : path.slice(0, -1)), OPEN_DELAY)
  }

  return (
    <ul
      className="tui-menubar hidden desk:flex"
      onBlur={(e) => {
        if (!barRef.current?.contains(e.relatedTarget as Node)) setOpen([])
      }}
      onKeyDown={(e) => menuKeys(barRef, open, setOpen)(e)}
      onMouseEnter={() => clearTimeout(timer.current)}
      onMouseLeave={() => later(() => setOpen([]), CLOSE_DELAY)}
      ref={barRef}
    >
      <Level depth={1} hover={hover} level={nodes} open={open} pathname={pathname} />
    </ul>
  )
}
