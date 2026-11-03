import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ req, originalDoc, searchDoc }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  const { slug, id, categories, title, meta } = originalDoc

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
    meta: {
      ...meta,
      title: meta?.title || title,
      image: meta?.image?.id || meta?.image,
      description: meta?.description,
    },
    categories: [],
  }

  if (categories && Array.isArray(categories) && categories.length > 0) {
    // Batch the lookup for any categories that are still bare ids (not already
    // populated objects) into a single query instead of one findByID per category.
    const categoryIdsToFetch = categories.filter(
      (category): category is string | number => Boolean(category) && typeof category !== 'object',
    )

    const fetchedCategories =
      categoryIdsToFetch.length > 0
        ? (
            await req.payload.find({
              collection: 'categories',
              depth: 0,
              limit: categoryIdsToFetch.length,
              select: { title: true },
              where: { id: { in: categoryIdsToFetch } },
              req,
            })
          ).docs
        : []

    const fetchedCategoriesById = new Map(
      fetchedCategories.map((fetchedDoc) => [String(fetchedDoc.id), fetchedDoc]),
    )

    const populatedCategories: { id: string | number; title: string }[] = []
    for (const category of categories) {
      if (!category) {
        continue
      }

      if (typeof category === 'object') {
        populatedCategories.push(category)
        continue
      }

      const doc = fetchedCategoriesById.get(String(category))

      if (doc) {
        populatedCategories.push(doc)
      } else {
        console.error(
          `Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`,
        )
      }
    }

    modifiedDoc.categories = populatedCategories.map((each) => ({
      relationTo: 'categories',
      categoryID: String(each.id),
      title: each.title,
    }))
  }

  return modifiedDoc
}
