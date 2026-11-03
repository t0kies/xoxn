'use client'

import { useEffect } from 'react'

import { applyTheme, themeIsValid, themeLocalStorageKey } from '../shared'

// a notFound() shell never runs the inline theme script, so set it here
export const ThemeFallback = () => {
  useEffect(() => {
    if (document.documentElement.dataset.theme) return
    const stored = window.localStorage.getItem(themeLocalStorageKey)
    applyTheme(themeIsValid(stored) ? stored : null)
  }, [])
  return null
}
