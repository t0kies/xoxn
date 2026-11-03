import React from 'react'

import { brandCmsIcon } from '@/brand/assets'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaAsset } from '@/utilities/media-file-url'

// fills the breadcrumb link box, which crops anything with its own pixel size
const fillBox = { inset: 0, position: 'absolute' } as const

export default async function Icon() {
  const cmsSettings = await getCachedGlobal('cms-settings', 1)()
  const siteName = cmsSettings?.siteName || 'xoxn'
  const icon = getMediaAsset(cmsSettings?.icon) ?? brandCmsIcon

  // Single-color SVG, tinted with the admin text color so one file fits both themes.
  if (icon.isSvg) {
    const mask = `url("${icon.url}") no-repeat center / contain`
    return (
      <span
        aria-label={siteName}
        role="img"
        style={{
          ...fillBox,
          backgroundColor: 'var(--theme-text)',
          display: 'block',
          height: '100%',
          mask,
          WebkitMask: mask,
          width: '100%',
        }}
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={siteName}
      src={icon.url}
      style={{ ...fillBox, height: '100%', objectFit: 'contain', width: '100%' }}
    />
  )
}
