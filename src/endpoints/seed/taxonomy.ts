import type { Payload } from 'payload'

import type { Technology } from '@/payload-types'
import { context } from './context'
import { slugify } from './lorem'

const CATEGORIES = ['Notes', 'Guides', 'Updates'] as const

export const seedCategories = (payload: Payload) =>
  Promise.all(
    CATEGORIES.map((name) =>
      payload.create({
        collection: 'categories',
        data: { title: name, slug: slugify(name) },
        context,
        overrideAccess: true,
      }),
    ),
  )

// the stack vocabulary projects pick from
const STACK: Pick<Technology, 'name' | 'category'>[] = [
  { name: 'TypeScript', category: 'language' },
  { name: 'Rust', category: 'language' },
  { name: 'C++', category: 'language' },
  { name: 'React', category: 'framework' },
  { name: 'Next.js', category: 'framework' },
  { name: 'PostgreSQL', category: 'platform' },
  { name: 'Docker', category: 'platform' },
  { name: 'ESP32', category: 'hardware' },
  { name: 'KiCad', category: 'tool' },
]

export const seedStack = async (payload: Payload) => {
  const stack = new Map<string, number>()
  for (const tech of STACK) {
    const created = await payload.create({
      collection: 'technologies',
      data: {
        ...tech,
        slug: tech.name
          .toLowerCase()
          .replace(/\+/g, 'p')
          .replace(/[^a-z0-9]+/g, '-'),
      },
      context,
      overrideAccess: true,
    })
    stack.set(tech.name, created.id)
  }
  return stack
}
