import { hexColorValidate } from './ColorPickerField/validate'

// a hex color with the picker
export const colorField = (name: string, defaultValue: string, description?: string) => ({
  name,
  type: 'text' as const,
  defaultValue,
  validate: hexColorValidate,
  admin: {
    ...(description ? { description } : {}),
    components: {
      Field: '@/fields/ColorPickerField#ColorPickerField',
    },
  },
})
