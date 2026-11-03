import type React from 'react'

type Open = string[]

// ←/→ along the bar, ↑/↓ in a menu, → opens a branch, ← closes it, Esc closes.
export const menuKeys =
  (bar: React.RefObject<HTMLUListElement | null>, open: Open, setOpen: (path: Open) => void) =>
  (e: React.KeyboardEvent) => {
    const link = (e.target as HTMLElement).closest('a')
    const item = link?.parentElement
    if (!link || !item) return
    const depth = Number(item.dataset.depth)
    const name = item.dataset.name!
    const hasMenu = item.dataset.submenu !== undefined
    const siblings = [...(item.parentElement?.children || [])] as HTMLElement[]
    const move = (step: number) => {
      const next = siblings[(siblings.indexOf(item) + step + siblings.length) % siblings.length]
      next?.querySelector<HTMLElement>(':scope > a')?.focus()
      return next?.dataset.name
    }
    const focusChild = () =>
      requestAnimationFrame(() => item.querySelector<HTMLElement>(':scope > ul > li > a')?.focus())
    const vertical = e.key === 'ArrowDown' || e.key === 'ArrowUp'
    const horizontal = e.key === 'ArrowRight' || e.key === 'ArrowLeft'

    if (e.key === 'Escape') {
      setOpen([])
      bar.current?.querySelector<HTMLElement>(`[data-name="${open[0]}"] > a`)?.focus()
    } else if (depth === 1 && horizontal) {
      const next = move(e.key === 'ArrowRight' ? 1 : -1)
      if (open.length && next) setOpen([next])
    } else if (depth === 1 && e.key === 'ArrowDown' && hasMenu) {
      setOpen([name])
      focusChild()
    } else if (depth > 1 && vertical) {
      const next = move(e.key === 'ArrowDown' ? 1 : -1)
      if (depth === 2 && next) setOpen([open[0], next])
    } else if (depth === 2 && e.key === 'ArrowRight' && hasMenu) {
      setOpen([open[0], name])
      focusChild()
    } else if (depth === 2 && e.key === 'ArrowLeft' && open[1] === name) {
      setOpen([open[0]])
    } else if (depth === 3 && e.key === 'ArrowLeft') {
      setOpen([open[0]])
      item.parentElement?.parentElement?.querySelector<HTMLElement>(':scope > a')?.focus()
    } else {
      return
    }
    e.preventDefault()
  }
