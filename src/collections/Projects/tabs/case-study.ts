import type { Tab } from 'payload'

import { scenes } from '@/blocks/scenes'

export const caseStudyTab: Tab = {
  label: 'Case study',
  fields: [
    {
      name: 'caseStudy',
      type: 'richText',
      admin: {
        description: 'The problem, what you built, and what changed. Shown on the project page.',
      },
    },
    {
      name: 'scenes',
      type: 'blocks',
      blocks: scenes,
      label: 'Showcase scenes',
      admin: {
        description:
          'Photos, schematics, 3D models, code and video that scroll past the story, same as the resume portfolio.',
        initCollapsed: true,
      },
    },
  ],
}
