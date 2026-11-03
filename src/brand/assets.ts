import type { StaticImageData } from 'next/image'

import type { MediaAsset } from '@/utilities/media-file-url'

import cmsIconSvg from '@/assets/brand/xoxn-cms-icon.svg'
import cmsLogoSvg from '@/assets/brand/xoxn-cms-logo.svg'
import faviconSvg from '@/assets/brand/favicon.svg'

// built-in marks, bundled so a fresh database has them; uploads override
const toAsset = (file: StaticImageData): MediaAsset => ({
  url: file.src,
  isSvg: true,
  ratio: file.width && file.height ? file.width / file.height : null,
})

// the plain mark doubles as the site logo until one is uploaded in Appearance
export const brandLogo = toAsset(cmsIconSvg)
export const brandFavicon = toAsset(faviconSvg)
export const brandCmsLogo = toAsset(cmsLogoSvg)
export const brandCmsIcon = toAsset(cmsIconSvg)
