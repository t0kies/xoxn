import type { Metadata } from 'next'

import type { Media, Page, Post, Project, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getCachedGlobal } from './getGlobals'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  // no image of its own: the page has no social image, rather than a stock one
  if (!image || typeof image !== 'object' || !('url' in image)) return null
  const ogUrl = image.sizes?.og?.url
  return ogUrl ? serverUrl + ogUrl : serverUrl + image.url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<Project> | null
}): Promise<Metadata> => {
  const { doc } = args

  const cmsSettings = await getCachedGlobal('cms-settings', 0)()
  const siteName = cmsSettings?.siteName || 'xoxn'

  const ogImage = getImageURL(doc?.meta?.image)

  const docTitle = doc?.meta?.title
  const title =
    docTitle && !docTitle.endsWith(siteName) ? `${docTitle} | ${siteName}` : docTitle || siteName

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    // Already carries the site name, so it skips the layout's title template.
    title: { absolute: title },
  }
}
