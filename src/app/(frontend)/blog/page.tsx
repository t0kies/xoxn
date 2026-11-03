import type { Metadata } from 'next/types'
import type { Where } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { PageHead } from '@/components/page-head'
import { PostList, type PostListItem } from '@/components/PostList'
import { CategoryNav, Pager } from './nav'

export const dynamic = 'force-dynamic' // Railway's build can't reach Postgres

const PER_PAGE = 20

type Args = {
  searchParams: Promise<{ category?: string; page?: string }>
}

export default async function Page({ searchParams }: Args) {
  const { category: categorySlug, page: pageParam } = await searchParams
  const page = Math.max(1, Number.parseInt(pageParam || '1', 10) || 1)
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 50,
    overrideAccess: false,
    pagination: false,
    sort: 'title',
  })
  const category = categories.docs.find((c) => c.slug === categorySlug)
  const where: Where | undefined = category ? { categories: { in: [category.id] } } : undefined

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: PER_PAGE,
    page,
    overrideAccess: false,
    sort: '-publishedAt',
    where,
    select: { title: true, slug: true, categories: true, meta: true, publishedAt: true },
  })

  return (
    <main className="pt-[var(--header-height)] pb-[3lh]">
      <PageHead cmd={`ls -l ~/blog${category ? `/${category.slug}` : ''}`} title="Blog" />

      <div className="container flex flex-col gap-[1lh]">
        <CategoryNav categories={categories.docs} current={category} />

        <PostList posts={posts.docs as PostListItem[]} total={posts.totalDocs} />

        <Pager category={categorySlug} page={page} posts={posts} />
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return { title: 'Blog' }
}
