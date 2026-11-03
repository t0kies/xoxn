import { isLightTheme, type KittyColors } from '@/themes/kitty'

// One fetch per admin session for the list, one per theme for its colors.
let namesRequest: Promise<string[]> | null = null
export const loadNames = () =>
  (namesRequest ??= fetch('/next/palettes')
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .catch((error) => {
      namesRequest = null
      throw error
    }))
const colorCache = new Map<string, Promise<KittyColors | null>>()
export const loadColors = (name: string) => {
  if (!colorCache.has(name)) {
    colorCache.set(
      name,
      fetch(`/next/palettes?name=${encodeURIComponent(name)}`).then((res) =>
        res.ok ? res.json() : null,
      ),
    )
  }
  return colorCache.get(name)!
}

export const label = (name: string) => name.replace(/_/g, ' ')

// A colorful cursor makes a natural accent; a gray one doesn't, so fall back to blue.
export const defaultAccent = (colors: KittyColors) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(colors.cursor.slice(i, i + 2), 16))
  const colorful = Math.max(r, g, b) - Math.min(r, g, b) > 60
  return colorful ? colors.cursor : colors[isLightTheme(colors) ? 'color4' : 'color12']
}
