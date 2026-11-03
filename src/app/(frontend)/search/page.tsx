import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { PageHead } from '@/components/page-head'
import { PostList, type PostListItem } from '@/components/PostList'
import { Search } from '@/search/Component'

// forced: searchParams alone didn't keep the database out of the build
export const dynamic = 'force-dynamic'

type Args = {
  searchParams: Promise<{ q?: string }>
}

export default async function Page({ searchParams }: Args) {
  const { q: query } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const results = await payload.find({
    collection: 'search',
    depth: 0,
    limit: 50,
    pagination: false,
    select: { title: true, slug: true, categories: true, meta: true },
    ...(query
      ? {
          where: {
            or: [
              { title: { like: query } },
              { 'meta.description': { like: query } },
              { 'meta.title': { like: query } },
              { slug: { like: query } },
            ],
          },
        }
      : {}),
  })

  const posts: PostListItem[] = results.docs.map((doc) => ({
    slug: doc.slug,
    title: doc.title || doc.slug || 'untitled',
    meta: doc.meta,
    categories: (doc.categories || []).map((c) => ({ id: c.categoryID, title: c.title })),
  }))

  return (
    <main className="pt-[var(--header-height)] pb-[3lh]">
      <PageHead cmd={query ? `grep -ri "${query}" ~/blog` : 'grep -ri ~/blog'} title="Search">
        <div className="mt-[0.5lh] max-w-[60ch]">
          <Search initial={query} />
        </div>
      </PageHead>
      <div className="container">
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <p className="text-dim">grep: no matches{query ? ` for "${query}"` : ''}</p>
        )}
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return { title: 'Search' }
}
