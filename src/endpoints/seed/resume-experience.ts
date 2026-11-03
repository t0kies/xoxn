import type { Resume } from '@/payload-types'

import { sentence } from './lorem'
import { HARDWARE, WEB } from './resume-targets'

export const resumeExperience = (): NonNullable<Resume['experience']> => [
  {
    role: 'Independent Designer & Engineer',
    company: 'Demo Studio',
    location: 'Lorem City',
    start: '2021',
    end: null,
    bullets: [
      { text: sentence(16, 72), tailorTags: [HARDWARE] },
      { text: sentence(15, 73) },
      { text: sentence(14, 74), tailorTags: [WEB] },
      { text: sentence(13, 75), tailorTags: [HARDWARE] },
    ],
  },
  {
    role: 'Product Engineer',
    company: 'Example Software',
    location: 'Remote',
    start: '2018',
    end: '2021',
    bullets: [
      { text: sentence(15, 76) },
      { text: sentence(13, 77), tailorTags: [WEB] },
      { text: sentence(12, 78) },
    ],
  },
  {
    role: 'Lab Technician',
    company: 'Sample College',
    location: 'Lorem City',
    start: '2015',
    end: '2018',
    bullets: [{ text: sentence(14, 79), tailorTags: [HARDWARE] }, { text: sentence(12, 80) }],
  },
]
