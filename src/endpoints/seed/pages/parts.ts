import type { RequiredDataFromCollectionSlug } from 'payload'

import type { Category, Form, Post } from '@/payload-types'
import type { SeedMedia } from '../media'
import { doc, h, p } from '../rich-text'

export type PageData = RequiredDataFromCollectionSlug<'pages'>
export type PageArgs = {
  categories: Category[]
  contactForm: Form
  media: SeedMedia
  posts: Post[]
}
type Column = NonNullable<
  Extract<PageData['layout'][number], { blockType: 'content' }>['columns']
>[number]

export const button = (
  label: string,
  url: string,
  appearance: 'default' | 'outline' = 'default',
) => ({
  link: { type: 'custom' as const, label, url, appearance },
})

export const column = (
  size: Column['size'],
  heading: string,
  body: string,
  cta?: { label: string; url: string },
): Column => ({
  size,
  richText: doc(h('h3', heading), p(body)),
  enableLink: Boolean(cta),
  ...(cta
    ? {
        link: {
          type: 'custom' as const,
          label: cta.label,
          url: cta.url,
          appearance: 'outline' as const,
        },
      }
    : {}),
})
