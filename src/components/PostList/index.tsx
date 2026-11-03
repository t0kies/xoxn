import Link from 'next/link'
import React from 'react'

import { categoryInk } from '@/utilities/category-ink'
import { docPath } from '@/utilities/doc-path'

type CategoryRef = { id?: null | number | string; slug?: null | string; title?: null | string }

// A post or a search result: anything with a slug, a title and maybe categories.
export type PostListItem = {
  slug?: null | string
  title: string
  publishedAt?: null | string
  meta?: { description?: null | string } | null
  categories?: (CategoryRef | number | string | null)[] | null
}

const isoDate = (value?: null | string) => (value ? value.slice(0, 10) : '----------')

// one entry per post: date and title, then categories and description dimmed
export const PostList: React.FC<{ posts: PostListItem[]; total?: number }> = ({ posts, total }) => {
  if (posts.length === 0) return <p className="text-dim">ls: no posts here</p>

  return (
    <div>
      <p className="mb-[0.5lh] text-sm text-dim">total {total ?? posts.length}</p>
      <ul className="tui-ls list-none p-0">
        {posts.map((post) => {
          const categories = (post.categories || []).filter(
            (c): c is CategoryRef => typeof c === 'object' && c !== null,
          )
          return (
            <li className="mb-[0.75lh]" key={post.slug}>
              <div className="flex gap-[2ch]">
                <span className="shrink-0 text-dim">
                  {post.publishedAt ? (
                    <time dateTime={post.publishedAt}>{isoDate(post.publishedAt)}</time>
                  ) : (
                    isoDate()
                  )}
                </span>
                <Link href={docPath('posts', post.slug || '')}>{post.title}</Link>
              </div>
              <div className="flex gap-[2ch] text-dim">
                <span className="shrink-0 whitespace-nowrap">
                  {categories.map((category) => (
                    <span
                      className="mr-[1ch]"
                      key={category.id ?? category.title}
                      style={{ color: `var(--ansi-${categoryInk(category.title)})` }}
                    >
                      {category.slug || category.title?.toLowerCase()}
                    </span>
                  ))}
                </span>
                <span className="hidden min-w-0 truncate md:block">{post.meta?.description}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
