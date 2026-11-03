import type { Category, Post } from '@/payload-types'

import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import { getPublicProjects } from '@/Projects/data'
import { docPath } from '@/utilities/doc-path'
import { commandName, type NavNode, uniqueByName } from './nav-node'

const nonEmpty = (nodes: NavNode[]) => (nodes.length ? nodes : undefined)

const projectNodes = async (): Promise<NavNode[]> =>
  (await getPublicProjects()).map((project) => ({
    name: project.slug || String(project.id),
    label: project.title,
    href: `/projects/${project.slug}`,
    children: nonEmpty(
      uniqueByName(
        (project.links || []).map((link) => {
          const name = commandName(link.label || link.kind || 'link')
          return name ? { name, label: link.label || name, href: link.url, newTab: true } : null
        }),
      ),
    ),
  }))

const getPostsByCategory = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      select: { title: true, slug: true, categories: true },
      sort: '-publishedAt',
    })
    return docs as Pick<Post, 'categories' | 'slug' | 'title'>[]
  },
  ['nav-posts-by-category'],
  { tags: ['posts-sitemap'], revalidate: 3600 },
)

const postNodes = async (): Promise<NavNode[]> => {
  const posts = await getPostsByCategory()
  const toNode = (post: (typeof posts)[number]): NavNode => ({
    name: post.slug || commandName(post.title),
    label: post.title,
    href: docPath('posts', post.slug || ''),
  })

  const categories = new Map<number, { category: Category; posts: NavNode[] }>()
  const loose: NavNode[] = []
  for (const post of posts) {
    const cats = (post.categories || []).filter((c): c is Category => typeof c === 'object')
    if (cats.length === 0) loose.push(toNode(post))
    for (const category of cats) {
      const entry = categories.get(category.id) ?? { category, posts: [] }
      entry.posts.push(toNode(post))
      categories.set(category.id, entry)
    }
  }

  return uniqueByName([
    ...[...categories.values()].map(({ category, posts }) => ({
      name: category.slug || commandName(category.title),
      label: category.title,
      href: `/blog?category=${category.slug}`,
      children: posts,
    })),
    ...loose,
  ])
}

// submenus filled from content: projects with their links, posts by category
export const autoChildren = { projects: projectNodes, posts: postNodes } as const
