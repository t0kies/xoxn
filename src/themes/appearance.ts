import type { Appearance } from '@/payload-types'

import { getContrastColor } from '@/utilities/contrast-color'
import { paletteCss } from './css'

// The Appearance colors as CSS variables (html:root out-ranks palette.css's :root
// defaults), then the kitty themes picked per mode, which come later and win.
export const appearanceCss = (appearance: Appearance | null | undefined): string => {
  const { ink, paper, accent } = appearance?.colors || {}
  const { cyan, magenta, yellow } = appearance?.inks || {}
  const styleTokens: Record<string, string> = {}
  const setColor = (name: string, value?: null | string) => {
    if (!value) return
    styleTokens[name] = value
    styleTokens[`${name}-fg`] = getContrastColor(value)
  }
  if (ink) styleTokens['--ink'] = ink
  if (paper) styleTokens['--paper'] = paper
  setColor('--accent', accent)
  setColor('--ansi-cyan', cyan)
  setColor('--ansi-magenta', magenta)
  setColor('--ansi-yellow', yellow)

  return (
    `html:root{${Object.entries(styleTokens)
      .map(([name, value]) => `${name}:${value}`)
      .join(';')}}` + paletteCss(appearance?.palettes, 'site')
  )
}
