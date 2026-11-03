import type { GroupField, JSONFieldValidation } from 'payload'

import { isPaletteValue } from '@/themes/kitty'

const validate: JSONFieldValidation = (value) =>
  value === null || value === undefined || isPaletteValue(value)
    ? true
    : 'Pick a theme from the list.'

// a dark and a light theme: name, colors and accent; empty means custom colors
export const palettes = (name: string, description: string): GroupField => ({
  name,
  type: 'group',
  label: 'Themes',
  admin: { description },
  fields: (['dark', 'light'] as const).map((mode) => ({
    name: mode,
    type: 'json' as const,
    label: mode === 'dark' ? 'Dark mode' : 'Light mode',
    validate,
    admin: { components: { Field: '@/fields/PaletteField#PaletteField' } },
  })),
})
