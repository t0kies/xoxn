import type React from 'react'
import type { Page, Post } from '@/payload-types'

import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, redirect } from 'next/navigation'
import { docPath } from '@/utilities/doc-path'

interface Props {
  disableNotFound?: boolean
  url: string
}

// redirects from the CMS, server side
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await getCachedRedirects()()

  const redirectItem = redirects.find((redirect) => redirect.from === url)

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url)
    }

    let redirectUrl: string

    if (typeof redirectItem.to?.reference?.value === 'string') {
      const collection = redirectItem.to?.reference?.relationTo
      const id = redirectItem.to?.reference?.value

      const document = (await getCachedDocument(collection, id)()) as Page | Post
      redirectUrl = docPath(collection, document?.slug || '')
    } else {
      const value = redirectItem.to?.reference?.value
      redirectUrl = redirectItem.to?.reference
        ? docPath(
            redirectItem.to.reference.relationTo,
            typeof value === 'object' ? value?.slug || '' : '',
          )
        : ''
    }

    if (redirectUrl) redirect(redirectUrl)
  }

  if (disableNotFound) return null

  notFound()
}
