import { type RefObject, useEffect, useState } from 'react'

import { useCorner } from './use-corner'
import { useIntro } from './use-intro'

export type { Intro } from './use-intro'

export const DESK = '(hover: hover) and (min-width: 48rem)' // same as the `desk` variant in globals.css

// The desk header: follows DESK, publishes the bar's height, plays the corner
// hint's intro and reveals the header near the corner or on `/`.
export const useDeskHeader = (headerRef: RefObject<HTMLElement | null>) => {
  const [isDesk, setIsDesk] = useState(false)
  const [promptOpen, setPromptOpen] = useState(false)
  const intro = useIntro(isDesk)
  const { nearCorner, revealed } = useCorner(headerRef, isDesk, () => setPromptOpen(true))

  useEffect(() => {
    const query = window.matchMedia(DESK)
    const update = () => setIsDesk(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const publish = () =>
      document.documentElement.style.setProperty(
        '--header-height',
        isDesk ? '0px' : `${el.offsetHeight}px`,
      )
    publish() // page content clears the bar on touch; on desk the header floats over it
    const observer = new ResizeObserver(publish)
    observer.observe(el)
    return () => observer.disconnect()
  }, [headerRef, isDesk])

  useEffect(() => {
    document.documentElement.dataset.prompt = promptOpen ? 'open' : 'closed' // the status line's mode
  }, [promptOpen])

  return { intro, isDesk, nearCorner, promptOpen, revealed, setPromptOpen }
}
