export const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export const hexColorValidate = (value: string | null | undefined): true | string => {
  if (!value) return true
  return HEX_PATTERN.test(value) || 'Enter a hex color, e.g. #0a7d5a'
}
