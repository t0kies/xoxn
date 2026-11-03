import React from 'react'

import { defaultTheme, themeLocalStorageKey } from '../shared'
import { ThemeFallback } from './Fallback'

// Runs before first paint: the stored choice, else the system preference.
const script = `(function () {
  var theme = '${defaultTheme}'
  try {
    var stored = window.localStorage.getItem('${themeLocalStorageKey}')
    if (stored === 'light' || stored === 'dark') theme = stored
    else if (window.matchMedia) theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch (e) {}
  document.documentElement.setAttribute('data-theme', theme)
})()`

export const InitTheme: React.FC = () => (
  <>
    <script dangerouslySetInnerHTML={{ __html: script }} />
    <ThemeFallback />
  </>
)
