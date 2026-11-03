import clsx from 'clsx'
import React from 'react'

import type { MediaAsset } from '@/utilities/media-file-url'

import { MaskedMark } from '@/components/MaskedMark'
import { brandLogo } from '@/brand/assets'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  logo?: MediaAsset | null
  siteName?: null | string
}

export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    logo,
    siteName,
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'
  const name = siteName || 'xoxn'

  // Use CMS logo if set, otherwise fall back to code-bundled default
  const effectiveLogo = logo || brandLogo

  // one-color SVGs take the text color, so one file fits every background
  if (effectiveLogo.isSvg) {
    return (
      <MaskedMark asset={effectiveLogo} className={className} height={36} label={`${name} logo`} />
    )
  }

  // Raster logos display as-is
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={`${name} logo`}
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] w-full h-[34px] object-contain', className)}
      src={effectiveLogo.url}
    />
  )
}
