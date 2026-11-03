import type { Block } from 'payload'

import { videoFields } from './model-video'
import { caption } from './shared'

export const codeScene: Block = {
  slug: 'sceneCode',
  interfaceName: 'SceneCode',
  labels: { singular: 'Code (optionally with video)', plural: 'Code' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'language',
          type: 'select',
          defaultValue: 'go',
          options: [
            { label: 'Go', value: 'go' },
            { label: 'TypeScript', value: 'tsx' },
            { label: 'JavaScript', value: 'javascript' },
            { label: 'C / C++', value: 'cpp' },
            { label: 'Python', value: 'python' },
            { label: 'SQL', value: 'sql' },
            { label: 'Rust', value: 'rust' },
            { label: 'Shell', value: 'bash' },
          ],
          admin: { width: '30%' },
        },
        { name: 'filename', type: 'text', admin: { width: '70%', placeholder: 'firmware/main.c' } },
      ],
    },
    { name: 'code', type: 'code', required: true },
    ...videoFields,
    {
      name: 'cues',
      type: 'array',
      admin: {
        description: 'Sync the code to the video: at each timestamp, the given lines light up.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'at',
              type: 'number',
              required: true,
              min: 0,
              admin: { width: '25%', description: 'Seconds' },
            },
            {
              name: 'from',
              type: 'number',
              required: true,
              min: 1,
              admin: { width: '25%', description: 'First line' },
            },
            {
              name: 'to',
              type: 'number',
              min: 1,
              admin: { width: '25%', description: 'Last line' },
            },
            { name: 'note', type: 'text', admin: { width: '25%' } },
          ],
        },
      ],
    },
    caption,
  ],
}
