// themes from kitty-themes (github.com/dexpota/kitty-themes, MIT, Fabrizio Destro)
// only the server fetches them, cached a day; picked colors are stored with the setting

const REPO = 'dexpota/kitty-themes'

// Shown wherever the palettes are offered: the collection is MIT licensed and its author is credited.
export const KITTY_CREDIT = {
  name: 'kitty-themes',
  author: 'Fabrizio Destro',
  license: 'MIT',
  url: `https://github.com/${REPO}`,
  // each theme's original author is listed in the collection's README
  themesUrl: `https://github.com/${REPO}#themes`,
} as const
const DAY = 60 * 60 * 24

// Every color a kitty theme defines: the 16 ANSI colors plus the UI ones.
export type KittyColors = {
  background: string
  foreground: string
  cursor: string
  selection_background: string
  selection_foreground: string
} & Record<`color${number}`, string>

// What a palette field stores. `accent` is one of the theme's colors.
export type PaletteValue = { name: string; accent: string; colors: KittyColors }

export const THEME_NAME = /^[\w().+-]+$/
export const HEX = /^#[0-9a-f]{6}$/i
const ANSI = Array.from({ length: 16 }, (_, i) => `color${i}` as const)

export const listThemes = async (): Promise<string[]> => {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/themes`, {
    headers: { Accept: 'application/vnd.github+json' },
    next: { revalidate: DAY },
  })
  if (!res.ok) throw new Error(`GitHub answered ${res.status}`)
  const files = (await res.json()) as { name: string }[]
  return files
    .map((file) => file.name.replace(/\.conf$/, ''))
    .filter((name) => THEME_NAME.test(name))
    .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
}

// Parses a kitty .conf; missing UI colors fall back to the theme's own.
export const parseConf = (conf: string): KittyColors | null => {
  const values: Record<string, string> = {}
  for (const line of conf.split('\n')) {
    const match = line.match(/^\s*(\w+)\s+(#[0-9a-f]{6})\b/i)
    if (match) values[match[1]] = match[2].toLowerCase()
  }
  if (!values.background || !values.foreground || ANSI.some((key) => !values[key])) return null
  return {
    ...(Object.fromEntries(ANSI.map((key) => [key, values[key]])) as Record<
      `color${number}`,
      string
    >),
    background: values.background,
    foreground: values.foreground,
    cursor: values.cursor || values.foreground,
    selection_background: values.selection_background || values.color8,
    selection_foreground: values.selection_foreground || values.foreground,
  }
}

export const getTheme = async (name: string): Promise<KittyColors | null> => {
  if (!THEME_NAME.test(name)) return null
  const res = await fetch(
    `https://raw.githubusercontent.com/${REPO}/master/themes/${encodeURIComponent(name)}.conf`,
    { next: { revalidate: DAY } },
  )
  return res.ok ? parseConf(await res.text()) : null
}

// Relative luminance of the background: is this a light or a dark theme?
export const isLightTheme = (colors: Pick<KittyColors, 'background'>): boolean => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(colors.background.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4
}

// Server-side check of a stored palette: a known shape with real hex colors.
export const isPaletteValue = (value: unknown): value is PaletteValue => {
  const v = value as PaletteValue
  return (
    typeof v?.name === 'string' &&
    THEME_NAME.test(v.name) &&
    typeof v.accent === 'string' &&
    HEX.test(v.accent) &&
    typeof v.colors === 'object' &&
    [
      'background',
      'foreground',
      'cursor',
      'selection_background',
      'selection_foreground',
      ...ANSI,
    ].every((key) => HEX.test(v.colors[key as keyof KittyColors] ?? ''))
  )
}
