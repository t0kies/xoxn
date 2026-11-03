import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

// drops global_<slug> and any extra tags
export const revalidateGlobal =
  (...extraTags: string[]): GlobalAfterChangeHook =>
  ({ doc, global, req: { payload, context } }) => {
    if (!context.disableRevalidate) {
      payload.logger.info(`Revalidating ${global.slug}`)
      for (const tag of [`global_${global.slug}`, ...extraTags]) revalidateTag(tag, 'max')
    }
    return doc
  }
