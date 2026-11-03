import type { Category } from '@/payload-types'
import Link from 'next/link'
import React from 'react'

export const href = (next: { category?: string; page?: number }) => {
  const params = new URLSearchParams()
  if (next.category) params.set('category', next.category)
  if (next.page && next.page > 1) params.set('page', String(next.page))
  const query = params.toString()
  return `/blog${query ? `?${query}` : ''}`
}

export const CategoryNav: React.FC<{ categories: Category[]; current?: Category }> = ({
  categories,
  current,
}) => {
  if (categories.length === 0) return null
  return (
    <nav aria-label="Categories" className="flex flex-wrap gap-x-[1ch] text-sm">
      <Link aria-current={!current ? 'page' : undefined} className="tui-link" href={href({})}>
        all
      </Link>
      {categories.map((c) => (
        <Link
          aria-current={c.id === current?.id ? 'page' : undefined}
          className="tui-link"
          href={href({ category: c.slug || undefined })}
          key={c.id}
        >
          {c.slug || c.title}
        </Link>
      ))}
    </nav>
  )
}

type Pages = {
  page?: number | null
  totalPages: number
  hasPrevPage: boolean
  hasNextPage: boolean
}

export const Pager: React.FC<{ category?: string; page: number; posts: Pages }> = ({
  category,
  page,
  posts,
}) => {
  if (posts.totalPages <= 1) return null
  return (
    <nav aria-label="Pages" className="flex items-center gap-[2ch] text-sm">
      {posts.hasPrevPage && (
        <Link className="tui-link" href={href({ category, page: page - 1 })}>
          &lt; prev
        </Link>
      )}
      <span className="text-dim">
        page {posts.page}/{posts.totalPages}
      </span>
      {posts.hasNextPage && (
        <Link className="tui-link" href={href({ category, page: page + 1 })}>
          next &gt;
        </Link>
      )}
    </nav>
  )
}
