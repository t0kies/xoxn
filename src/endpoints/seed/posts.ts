import type { Payload } from 'payload'

import type { Category, Post } from '@/payload-types'

import { context } from './context'
import { sentence, slugify, title } from './lorem'
import type { SeedMedia } from './media'
import { article, reference } from './post-content'
import { seedCategories } from './taxonomy'

const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString()

// Three categories and six posts, cross-linked as related posts.
export const seedPosts = async ({
  payload,
  media,
  authorId,
}: {
  payload: Payload
  media: SeedMedia
  authorId?: number
}): Promise<{ categories: Category[]; posts: Post[] }> => {
  const categories = await seedCategories(payload)
  const [notes, guides, updates] = categories

  const drafts: {
    title: string
    content: Post['content']
    categories: Category[]
    hero?: number
    days: number
  }[] = [
    {
      title: 'Formatting reference',
      content: reference(media),
      categories: [guides],
      hero: media['tidal-flats-evening'].id,
      days: 2,
    },
    {
      title: title(4, 11),
      content: article(11, media['breadboard-prototype'].id),
      categories: [notes],
      hero: media['breadboard-prototype'].id,
      days: 9,
    },
    { title: title(3, 12), content: article(12), categories: [guides, notes], days: 17 },
    {
      title: title(4, 13),
      content: article(13, media['pcb-layout-and-board'].id),
      categories: [updates],
      days: 26,
    },
    {
      title: title(3, 14),
      content: article(14),
      categories: [notes],
      hero: media['spice-jars'].id,
      days: 40,
    },
    { title: title(5, 15), content: article(15), categories: [updates, guides], days: 63 },
  ]

  const posts: Post[] = []
  for (const draft of drafts) {
    posts.push(
      await payload.create({
        collection: 'posts',
        context,
        overrideAccess: true,
        data: {
          title: draft.title,
          slug: slugify(draft.title),
          content: draft.content,
          categories: draft.categories.map((category) => category.id),
          heroImage: draft.hero,
          authors: authorId ? [authorId] : undefined,
          meta: { title: draft.title, description: sentence(16, draft.days), image: draft.hero },
          publishedAt: daysAgo(draft.days),
          _status: 'published',
        },
      }),
    )
  }

  // Each post points at the next two, so every post page ends with "see also".
  for (const [i, post] of posts.entries()) {
    await payload.update({
      collection: 'posts',
      id: post.id,
      context,
      overrideAccess: true,
      data: { relatedPosts: [posts[(i + 1) % posts.length].id, posts[(i + 2) % posts.length].id] },
    })
  }

  return { categories, posts }
}
