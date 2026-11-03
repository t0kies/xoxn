type UploadedFile = { data?: Buffer; mimetype?: string; name?: string }

// By type, by extension, or by an `<svg` near the start of the file (types can be wrong).
export const looksLikeSvg = (file: UploadedFile | undefined): boolean => {
  if (!file) return false
  if (file.mimetype === 'image/svg+xml') return true
  if (file.name?.toLowerCase().endsWith('.svg')) return true
  const head = file.data?.subarray(0, 1024).toString('utf8') ?? ''
  return /<svg\b/i.test(head)
}

// "512" or "512px" as a number; anything relative (%, em) is not usable for a viewBox.
const numericAttr = (tag: string, name: string): null | number => {
  const value = tag.match(new RegExp(`\\s${name}\\s*=\\s*["']\\s*([\\d.]+)(px)?\\s*["']`, 'i'))?.[1]
  const n = value ? Number(value) : NaN
  return Number.isFinite(n) && n > 0 ? n : null
}

// adds a viewBox from width/height so small renders don't crop; null when not needed
export const withViewBox = (source: string): null | string => {
  const svgTag = source.match(/<svg\b[^>]*>/i)?.[0]
  if (!svgTag || /\sviewBox\s*=/i.test(svgTag)) return null
  const width = numericAttr(svgTag, 'width')
  const height = numericAttr(svgTag, 'height')
  if (!width || !height) return null
  return source.replace(
    svgTag,
    svgTag.replace(/^<svg\b/i, `<svg viewBox="0 0 ${width} ${height}"`),
  )
}
