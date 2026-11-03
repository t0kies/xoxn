import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

type Doc = Record<string, unknown>

// Revalidates the listed paths plus a `collection_<slug>` tag on change/delete.
export const revalidateCollection = (slug: string, paths: (doc: Doc) => string[]) => {
  const run = (doc: Doc, previousDoc?: Doc) => {
    const all = new Set([...paths(doc), ...(previousDoc ? paths(previousDoc) : [])])
    try {
      all.forEach((p) => revalidatePath(p))
      revalidateTag(`collection_${slug}`, 'max')
      revalidateTag('features', 'max')
    } catch {
      // Outside a Next.js request (CLI scripts) there is no cache to revalidate.
    }
  }

  const afterChange: CollectionAfterChangeHook = ({ doc, previousDoc, req: { context } }) => {
    if (!context.disableRevalidate) run(doc, previousDoc)
    return doc
  }

  const afterDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
    if (!context.disableRevalidate) run(doc)
    return doc
  }

  return { afterChange, afterDelete }
}

// Refreshes feature availability (nav/sitemap visibility) when content that gates a feature changes.
export const revalidateFeatures = () => {
  try {
    revalidateTag('features', 'max')
  } catch {
    // CLI scripts: no Next.js cache
  }
}
