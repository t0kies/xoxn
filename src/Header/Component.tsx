import { HeaderClient } from './Component.client'
import { getNavTree } from './nav-tree'
import { getFeatures } from '@/utilities/features'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaAsset } from '@/utilities/media-file-url'
import React from 'react'

export async function Header() {
  const [headerData, cmsSettings, appearance, features] = await Promise.all([
    getCachedGlobal('header', 1)(),
    getCachedGlobal('cms-settings', 0)(),
    getCachedGlobal('appearance', 1)(),
    getFeatures(),
  ])

  return (
    <HeaderClient
      logo={getMediaAsset(appearance?.branding?.logo)}
      nav={await getNavTree(headerData, features)}
      siteName={cmsSettings?.siteName}
    />
  )
}
