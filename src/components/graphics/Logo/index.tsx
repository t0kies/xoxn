import React from 'react'

import { MaskedMark } from '@/components/MaskedMark'
import { brandCmsLogo } from '@/brand/assets'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaAsset } from '@/utilities/media-file-url'

export default async function Logo() {
  const cmsSettings = await getCachedGlobal('cms-settings', 1)()
  const siteName = cmsSettings?.siteName || 'xoxn'
  const logo = getMediaAsset(cmsSettings?.logo) ?? brandCmsLogo

  // Single-color SVGs are tinted with the admin theme's own text color, so
  // the same file is correct on the light and dark login screens alike.
  if (logo.isSvg) {
    return <MaskedMark asset={logo} color="var(--theme-text)" height={40} label={siteName} />
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={siteName} src={logo.url} style={{ height: 'auto', maxWidth: '200px' }} />
  )
}
