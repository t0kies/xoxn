import { useEffect, useRef, useState } from 'react'

// Every page shows the corner hint by itself: the full sentence (longer on
// the first page of a visit), then the short `~/ $` form, then nothing.
const INTRO_FIRST_MS = 5000
const INTRO_REPEAT_MS = 5000
const INTRO_SHORT_MS = 2000
const INTRO_SEEN_KEY = 'tui-corner-hint-seen'

export type Intro = 'full' | 'short' | null

export const useIntro = (isDesk: boolean): Intro => {
  const [intro, setIntro] = useState<Intro>(null)
  const firstVisit = useRef<boolean>(undefined) // decided once per mount, so a dev re-run keeps it

  useEffect(() => {
    if (!isDesk) return
    if (firstVisit.current === undefined) {
      try {
        firstVisit.current = !window.sessionStorage.getItem(INTRO_SEEN_KEY)
        window.sessionStorage.setItem(INTRO_SEEN_KEY, '1')
      } catch {
        firstVisit.current = false // storage blocked: the short intro on every page
      }
    }
    const full = firstVisit.current ? INTRO_FIRST_MS : INTRO_REPEAT_MS
    // eslint-disable-next-line react-hooks/set-state-in-effect -- needs sessionStorage, so client-only
    setIntro('full')
    const toShort = setTimeout(() => setIntro('short'), full)
    const toEnd = setTimeout(() => setIntro(null), full + INTRO_SHORT_MS)
    return () => {
      clearTimeout(toShort)
      clearTimeout(toEnd)
    }
  }, [isDesk])

  return intro
}
