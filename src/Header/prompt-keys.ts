import type React from 'react'

type Actions = {
  run: () => void
  close: () => void
  accept: () => void
  canComplete: () => boolean // Tab completes
  canAccept: () => boolean // → completes, at the end of the line
  step: (step: number) => boolean // false when there's nothing to pick
}

const handle = (key: string, a: Actions): boolean => {
  if (key === 'Enter') a.run()
  else if (key === 'Escape') a.close()
  else if (key === 'Tab' && a.canComplete()) a.accept()
  else if (key === 'ArrowRight' && a.canAccept()) a.accept()
  else if (key === 'ArrowDown' || key === 'ArrowUp') return a.step(key === 'ArrowDown' ? 1 : -1)
  else return false
  return true
}

// ↵ go · esc close · tab or → complete · ↑↓ pick
export const promptKeys = (actions: Actions) => (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (handle(e.key, actions)) e.preventDefault()
}
