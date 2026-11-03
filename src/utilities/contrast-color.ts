const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

// black or white text for a background (WCAG luminance)
export const getContrastColor = (hex: string | null | undefined): string => {
  if (!hex || !HEX_PATTERN.test(hex)) return '#ffffff'

  let value = hex.slice(1)
  if (value.length === 3) {
    value = value
      .split('')
      .map((c) => c + c)
      .join('')
  }

  const [r, g, b] = [0, 2, 4].map((i) => {
    const channel = parseInt(value.slice(i, i + 2), 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
  })

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

  return luminance > 0.4 ? '#111111' : '#ffffff'
}
