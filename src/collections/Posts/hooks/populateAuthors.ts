import type { CollectionAfterReadHook } from 'payload'
import { User } from 'src/payload-types'

// users aren't public, so authors are copied into populatedAuthors here
export const populateAuthors: CollectionAfterReadHook = async ({ doc, req: { payload } }) => {
  if (doc?.authors && doc?.authors?.length > 0) {
    const authorIds = (doc.authors as (number | User)[]).map((author) =>
      typeof author === 'object' ? author?.id : author,
    )

    try {
      const { docs: authorDocs } = await payload.find({
        collection: 'users',
        depth: 0,
        limit: authorIds.length,
        where: { id: { in: authorIds } },
      })

      // A single batched query can return docs out of order relative to `authorIds`,
      // so look them back up by id rather than relying on result order.
      const authorDocsById = new Map(
        authorDocs.map((authorDoc) => [String(authorDoc.id), authorDoc]),
      )

      doc.populatedAuthors = authorIds
        .map((id) => authorDocsById.get(String(id)))
        .filter((authorDoc): authorDoc is User => Boolean(authorDoc))
        .map((authorDoc) => ({ id: authorDoc.id, name: authorDoc.name }))
    } catch {
      // swallow error
    }
  }

  return doc
}
