import React from 'react'

import type { MediaAsset } from '@/utilities/media-file-url'

// a one-color SVG through a CSS mask, tinted with any color
export const MaskedMark: React.FC<{
  asset: MediaAsset
  className?: string
  color?: string
  height: number
  label?: string
  // fixed width for square slots like the nav icon; SVGs without a size would overflow
  width?: number
}> = ({ asset, className, color = 'currentColor', height, label, width }) => {
  const mask = `url("${asset.url}") no-repeat left center / contain`

  return (
    <span
      aria-label={label}
      className={className}
      role={label ? 'img' : undefined}
      style={{
        backgroundColor: color,
        display: 'inline-block',
        flexShrink: 0,
        height: `${height}px`,
        mask,
        WebkitMask: mask,
        width: `${width ?? Math.round(height * (asset.ratio || 3))}px`,
      }}
    />
  )
}
