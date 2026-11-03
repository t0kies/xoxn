import type { Resume } from '@/payload-types'

import { sentence } from './lorem'

// fixed row ids for the two tailored versions, so items can be ticked for them
export const HARDWARE = '6a1f00000000000000000001'
export const WEB = '6a1f00000000000000000002'
export const BOTH = [HARDWARE, WEB]

export const resumeTargets = (): NonNullable<Resume['targets']> => [
  {
    id: HARDWARE,
    slug: 'acme-hardware',
    // Demo content, so a fixed key keeps the seeded nav links working.
    key: 'demo',
    company: 'Acme Corp',
    role: 'Embedded Engineer',
    note: sentence(16, 82),
    summary: null,
    emphasize: 'ESP32, C++, KiCad',
    hideSections: ['extras'],
  },
  {
    id: WEB,
    slug: 'globex-web',
    key: 'demo',
    company: 'Globex',
    role: 'Full-stack Engineer',
    note: sentence(15, 83),
    summary: sentence(18, 84),
    emphasize: 'TypeScript, React, Next.js',
    hideSections: ['highlights'],
  },
]
