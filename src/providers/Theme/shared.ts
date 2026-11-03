export type Theme = 'dark' | 'light'

export const themeLocalStorageKey = 'payload-theme'

export const defaultTheme: Theme = 'light'

export const themeIsValid = (value: null | string): value is Theme =>
  value === 'dark' || value === 'light'

const systemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

// Applies a theme choice: a fixed theme is remembered, null follows the system.
export const applyTheme = (theme: Theme | null) => {
  if (theme) window.localStorage.setItem(themeLocalStorageKey, theme)
  else window.localStorage.removeItem(themeLocalStorageKey)
  document.documentElement.setAttribute('data-theme', theme ?? systemTheme())
}
