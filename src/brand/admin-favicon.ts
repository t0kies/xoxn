import type { Metadata } from 'next'

import { brandFavicon } from '@/brand/assets'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaAsset } from '@/utilities/media-file-url'

// admin tab icon per request: CMS settings favicon, its icon, then the built-in one
export const withAdminFavicon = async (metadata: Promise<Metadata>): Promise<Metadata> => {
  const [meta, settings] = await Promise.all([
    metadata,
    // Depth 1 so the uploads come back populated.
    getCachedGlobal('cms-settings', 1)().catch(() => null),
  ])
  const favicon = getMediaAsset(settings?.favicon) ?? getMediaAsset(settings?.icon) ?? brandFavicon

  return {
    ...meta,
    icons: {
      icon: [{ url: favicon.url, ...(favicon.isSvg ? { type: 'image/svg+xml' } : {}) }],
      apple: favicon.isSvg ? undefined : [{ url: favicon.url }],
    },
  }
}
