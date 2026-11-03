import React from 'react'

import { HEX_PATTERN } from '@/fields/ColorPickerField/validate'
import { departureMono } from '@/fonts'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getContrastColor } from '@/utilities/contrast-color'
import { paletteCss } from '@/themes/css'

// admin accent, palettes and Departure Mono as CSS variables; custom.scss applies them
export const AdminThemeProvider: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
  const cmsSettings = await getCachedGlobal('cms-settings', 0)()
  const accent = cmsSettings?.adminAccentColor

  // One typeface across the whole admin, same as the site
  const mono = departureMono.style.fontFamily
  const vars: string[] = [
    `--font-body:${mono}`,
    `--font-mono:${mono}`,
    `--font-serif:${mono}`,
    `--xn-font-mono:${mono}`,
  ]
  if (accent && HEX_PATTERN.test(accent)) {
    vars.push(`--xn-admin-accent:${accent}`)
    vars.push(`--xn-admin-accent-foreground:${getContrastColor(accent)}`)
  }

  return (
    <React.Fragment>
      <style>{`:root{${vars.join(';')};}${paletteCss(cmsSettings?.adminPalettes, 'admin')}`}</style>
      {children}
    </React.Fragment>
  )
}

export default AdminThemeProvider
