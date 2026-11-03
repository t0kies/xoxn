import type { Resume } from '@/payload-types'

import { sentence } from './lorem'
import type { SeedMedia } from './media'
import { DEMO_CPP, DEMO_TSX } from './samples'
import { HARDWARE, WEB } from './resume-targets'

// on the sheet and in the showcase, with scenes
export const resumeProjects = (
  media: SeedMedia,
  boardModel: number,
): NonNullable<Resume['projects']> => [
  {
    name: 'Lorem Station',
    description: sentence(18, 21),
    tags: 'ESP32, C++, KiCad',
    url: 'https://example.com/lorem-station',
    tailorTags: [HARDWARE],
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
    ],
  },
  {
    name: 'Ipsum App',
    description: sentence(16, 31),
    tags: 'TypeScript, React, PostgreSQL',
    url: 'https://example.com/ipsum',
    tailorTags: [WEB],
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
  },
  {
    name: 'Dolor CLI',
    description: sentence(14, 41),
    tags: 'Rust, Docker',
    url: 'https://example.com/dolor-cli',
  },
]
