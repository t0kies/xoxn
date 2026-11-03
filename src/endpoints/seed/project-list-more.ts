import type { Project } from '@/payload-types'

import { paragraph, sentence } from './lorem'
import type { SeedMedia } from './media'
import { doc, h, p } from './rich-text'

export const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString()

export const caseStudy = (at: number) =>
  doc(
    p(paragraph(3, at)),
    h('h2', 'Lorem ipsum'),
    p(paragraph(3, at + 1)),
    h('h2', 'Dolor sit amet'),
    p(paragraph(2, at + 2)),
  )

type Args = { media: SeedMedia; ids: (...names: string[]) => number[] }

// an open-source tool and an archived private one
export const moreProjects = ({
  media,
  ids,
}: Args): Omit<Project, 'id' | 'createdAt' | 'updatedAt'>[] => [
  {
    title: 'Dolor CLI',
    slug: 'dolor-cli',
    summary: sentence(14, 41),
    kind: 'oss',
    stage: 'active',
    visibility: 'public',
    heroImage: media['dec-vt100'].id,
    technologies: ids('Rust', 'Docker'),
    startedOn: daysAgo(90),
    links: [
      { kind: 'source', label: 'Repository', url: 'https://example.com/dolor-cli' },
      { kind: 'docs', url: 'https://example.com/dolor-cli/docs' },
    ],
    caseStudy: caseStudy(41),
    publishedAt: daysAgo(30),
    _status: 'published',
  },
  {
    title: 'Consectetur Archive',
    slug: 'consectetur-archive',
    summary: sentence(12, 61),
    kind: 'demo',
    stage: 'archived',
    visibility: 'private',
    heroImage: media['soil-moisture-probe'].id,
    technologies: ids('TypeScript'),
    startedOn: daysAgo(900),
    shippedOn: daysAgo(700),
    caseStudy: caseStudy(61),
    _status: 'published',
  },
]
