import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import type { Plugin } from 'payload'


import { capPublicReadLimit } from '@/hooks/cap-public-read-limit'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import type { Page, Post } from '@/payload-types'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { searchFields } from '@/search/fieldOverrides'
import { getServerSideURL } from '@/utilities/getURL'
import { forms } from './forms'
import { ownerWrites } from './owner-writes'
import { storage } from './storage'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) =>
  doc?.title ? `${doc.title} | xoxn` : 'xoxn'

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()
  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      access: ownerWrites,
      // @ts-expect-error - mapped fields don't resolve to the same type
      fields: ({ defaultFields }) =>
        defaultFields.map((field) =>
          'name' in field && field.name === 'from'
            ? {
                ...field,
                admin: {
                  description: 'You will need to rebuild the website when changing this field.',
                },
              }
            : field,
        ),
      hooks: { afterChange: [revalidateRedirects] },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({ generateTitle, generateURL }),
  forms,
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      access: ownerWrites,
      hooks: { beforeOperation: [capPublicReadLimit] },
      fields: ({ defaultFields }) => [...defaultFields, ...searchFields],
    },
  }),
  storage,
]
