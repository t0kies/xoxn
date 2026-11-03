import type { Project } from '@/payload-types'

import { sentence } from './lorem'
import type { SeedMedia } from './media'
import { caseStudy, daysAgo, moreProjects } from './project-list-more'
import { DEMO_CPP, DEMO_TSX } from './samples'

type Args = {
  media: SeedMedia
  boardModel: number
  ids: (...names: string[]) => number[]
}

export const projectList = ({
  media,
  boardModel,
  ids,
}: Args): Omit<Project, 'id' | 'createdAt' | 'updatedAt'>[] => [
  {
    title: 'Lorem Station',
    slug: 'lorem-station',
    summary: sentence(18, 21),
    kind: 'hardware',
    stage: 'shipped',
    visibility: 'public',
    featured: true,
    heroImage: media['pcb-layout-and-board'].id,
    technologies: ids('ESP32', 'C++', 'KiCad'),
    startedOn: daysAgo(320),
    shippedOn: daysAgo(120),
    links: [
      { kind: 'source', label: 'Firmware', url: 'https://example.com/lorem-station' },
      { kind: 'docs', label: 'Build guide', url: 'https://example.com/lorem-station/docs' },
    ],
    caseStudy: caseStudy(21),
    scenes: [
      {
        blockType: 'sceneSchematic',
        image: media['pcb-layout-and-board'].id,
        caption: sentence(10, 22),
      },
      {
        blockType: 'sceneModel',
        model: boardModel,
        caption: 'Drag to look around. ' + sentence(6, 23),
      },
      {
        blockType: 'sceneCode',
        language: 'cpp',
        filename: 'firmware/main.cpp',
        code: DEMO_CPP,
        caption: sentence(9, 24),
      },
      {
        blockType: 'scenePhoto',
        image: media['breadboard-prototype'].id,
        caption: sentence(8, 25),
      },
    ],
    publishedAt: daysAgo(120),
    _status: 'published',
  },
  {
    title: 'Ipsum App',
    slug: 'ipsum-app',
    summary: sentence(16, 31),
    kind: 'product',
    stage: 'maintained',
    visibility: 'public',
    heroImage: media['spice-jars'].id,
    technologies: ids('TypeScript', 'React', 'PostgreSQL'),
    startedOn: daysAgo(500),
    links: [
      { kind: 'live', label: 'Open the app', url: 'https://example.com/ipsum' },
      { kind: 'demo', label: 'Demo account', url: 'https://example.com/ipsum/demo' },
    ],
    caseStudy: caseStudy(31),
    scenes: [
      { blockType: 'scenePhoto', image: media['spice-jars'].id, caption: sentence(8, 32) },
      {
        blockType: 'sceneCode',
        language: 'tsx',
        filename: 'app/list.tsx',
        code: DEMO_TSX,
        caption: sentence(9, 33),
      },
    ],
    publishedAt: daysAgo(60),
    _status: 'published',
  },
  ...moreProjects({ media, ids }),
]
