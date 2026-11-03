import type { Media } from '@/payload-types'

export const getMediaFileUrl = (media?: Media | null | number | string): null | string => {
  if (media && typeof media === 'object' && 'url' in media) {
    return media.url ?? null
  }
  return null
}

export type MediaAsset = {
  url: string
  // Single-color SVG marks get CSS-tinted instead of needing color variants
  isSvg: boolean
  // width / height when known, for sizing masked marks
  ratio: null | number
}

export const getMediaAsset = (media?: Media | null | number | string): MediaAsset | null => {
  if (!media || typeof media !== 'object' || !('url' in media) || !media.url) return null

  const isSvg = media.mimeType === 'image/svg+xml' || media.url.toLowerCase().endsWith('.svg')
  const ratio = media.width && media.height ? media.width / media.height : null

  return { url: media.url, isSvg, ratio }
}
