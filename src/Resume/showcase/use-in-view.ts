'use client'

import { type RefObject, useEffect, useRef } from 'react'

// Calls `onChange` as the element enters and leaves `margin` of the viewport.
export const useInView = (
  ref: RefObject<HTMLElement | null>,
  onChange: (inView: boolean) => void,
  margin = '0px',
) => {
  const callback = useRef(onChange)
  useEffect(() => {
    callback.current = onChange
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => callback.current(Boolean(entry?.isIntersecting)),
      { rootMargin: margin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, margin])
}
