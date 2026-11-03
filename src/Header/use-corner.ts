import { type RefObject, useEffect, useState } from 'react'

const CORNER_APPROACH_PX = 280 // the hint shows within this of the top-left corner
const CORNER_REVEAL_PX = 72 // the header drops down within this
const LEAVE_PX = 24 // it goes back up once the pointer is this far below it
const HIDE_DELAY = 450 // in ms, a folding submenu can leave the pointer below the bar for a moment

const isTyping = (target: HTMLElement | null) =>
  target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')

// Reveals the desk header near the corner, hides it when the pointer leaves or on Esc; `/` opens the prompt.
export const useCorner = (
  headerRef: RefObject<HTMLElement | null>,
  isDesk: boolean,
  openPrompt: () => void,
) => {
  const [nearCorner, setNearCorner] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!isDesk) return
    let hideTimer: ReturnType<typeof setTimeout> | undefined
    const onMouseMove = (e: MouseEvent) => {
      if (e.movementX === 0 && e.movementY === 0) return // a header appearing under a still pointer
      const header = headerRef.current
      const top = header?.offsetTop ?? 0 // ignores the slide-up transform
      const distance = Math.hypot(e.clientX, e.clientY - top)
      setNearCorner(distance < CORNER_APPROACH_PX)
      if (distance < CORNER_REVEAL_PX || header?.contains(e.target as Node)) {
        clearTimeout(hideTimer)
        hideTimer = undefined
        setRevealed(true)
      } else if (e.clientY > top + (header?.offsetHeight ?? 0) + LEAVE_PX) {
        hideTimer ??= setTimeout(() => {
          hideTimer = undefined
          setRevealed(false)
        }, HIDE_DELAY)
      }
    }
    const onMouseLeave = () => setNearCorner(false)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return setRevealed(false)
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return
      if (isTyping(e.target as HTMLElement | null)) return
      e.preventDefault()
      openPrompt()
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('keydown', onKeyDown)
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    return () => {
      clearTimeout(hideTimer)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('keydown', onKeyDown)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerRef, isDesk])

  return { nearCorner, revealed }
}
