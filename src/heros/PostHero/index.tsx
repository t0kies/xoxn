import React from 'react'

import type { Category, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { PageHead } from '@/components/page-head'
import { categoryInk } from '@/utilities/category-ink'
import { formatAuthors } from '@/utilities/formatAuthors'

// `cat ~/blog/<slug>.md`: categories, title, an ls -l style metadata line, the hero image.
export const PostHero: React.FC<{ post: Post }> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, slug, title } = post
  const authors = populatedAuthors?.length ? formatAuthors(populatedAuthors) : ''
  const cats = (categories || []).filter((c): c is Category => typeof c === 'object' && c !== null)

  return (
    <>
      <PageHead cmd={`cat ~/blog/${slug}.md`} title={title}>
        <p className="flex flex-wrap gap-x-[2ch] text-sm text-dim">
          <span>-rw-r--r--</span>
          {authors && <span className="text-body">{authors}</span>}
          {publishedAt && <time dateTime={publishedAt}>{publishedAt.slice(0, 10)}</time>}
          {cats.map((category) => (
            <span is-="badge" key={category.id} variant-={categoryInk(category.title)}>
              {category.title}
            </span>
          ))}
        </p>
      </PageHead>

      {heroImage && typeof heroImage === 'object' && (
        <div className="container mb-[2lh]">
          <div className="tui-window tui-shadow" data-title={heroImage.filename || 'image'}>
            <Media imgClassName="w-full object-cover" priority resource={heroImage} />
          </div>
        </div>
      )}
    </>
  )
}
