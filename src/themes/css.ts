import { getContrastColor } from '@/utilities/contrast-color'

import { isLightTheme, isPaletteValue, type PaletteValue } from './kitty'

const mix = (a: string, percent: number, b: string) => `color-mix(in oklab, ${a} ${percent}%, ${b})`

const NAMES = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan'] as const

// ANSI hues: bright set (9-14) on dark, normal (1-6) on light
const hues = ({ colors }: PaletteValue) => {
  const offset = isLightTheme(colors) ? 1 : 9
  return Object.fromEntries(NAMES.map((name, i) => [name, colors[`color${offset + i}`]])) as Record<
    (typeof NAMES)[number],
    string
  >
}

// site tokens from a kitty theme
const siteVars = (p: PaletteValue): string[] => {
  const { background: bg, foreground: fg } = p.colors
  const h = hues(p)
  return [
    `--background0:${bg}`,
    `--background1:${mix(bg, 92, fg)}`,
    `--background2:${mix(bg, 84, fg)}`,
    `--background3:${mix(bg, 68, fg)}`,
    `--foreground0:${fg}`,
    `--foreground1:${mix(fg, 86, bg)}`,
    `--foreground2:${mix(fg, 58, bg)}`,
    `--box-border-color:${mix(p.colors.color8, 70, fg)}`,
    `--accent:${p.accent}`,
    `--accent-fg:${getContrastColor(p.accent)}`,
    `--link:${p.accent}`,
    `--cursor:${p.colors.cursor}`,
    `--selection-bg:${p.colors.selection_background}`,
    `--selection-fg:${p.colors.selection_foreground}`,
    ...NAMES.flatMap((name) => [
      `--ansi-${name}:${h[name]}`,
      `--ansi-${name}-fg:${getContrastColor(h[name])}`,
    ]),
  ]
}

// Payload's admin theme: elevation-0 is the background, 1000 the text.
const adminVars = (p: PaletteValue): string[] => {
  const { background: bg, foreground: fg } = p.colors
  const h = hues(p)
  return [
    `--theme-bg:${bg}`,
    `--theme-text:${fg}`,
    `--theme-input-bg:${mix(bg, 94, fg)}`,
    ...Array.from({ length: 21 }, (_, i) => i * 50).map(
      (step) => `--theme-elevation-${step}:${mix(fg, step / 10, bg)}`,
    ),
    `--xn-admin-accent:${p.accent}`,
    `--xn-admin-accent-foreground:${getContrastColor(p.accent)}`,
    ...NAMES.map((name) => `--xn-${name}:${h[name]}`),
  ]
}

type Picks = { dark?: unknown; light?: unknown } | null | undefined

// CSS for the picked themes, '' when both are custom
export const paletteCss = (picks: Picks, target: 'admin' | 'site'): string =>
  (['dark', 'light'] as const)
    .map((mode) => {
      const palette = picks?.[mode]
      if (!isPaletteValue(palette)) return ''
      const selector =
        target === 'site'
          ? `html[data-theme=${mode}],html [data-theme=${mode}]`
          : `:root[data-theme=${mode}]`
      return `${selector}{${(target === 'site' ? siteVars : adminVars)(palette).join(';')}}`
    })
    .join('')
