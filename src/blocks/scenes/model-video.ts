import type { Block } from 'payload'

import { caption, requiredUpload } from './shared'

export const modelScene: Block = {
  slug: 'sceneModel',
  interfaceName: 'SceneModel',
  labels: { singular: '3D model', plural: '3D models' },
  fields: [
    {
      name: 'model',
      type: 'upload',
      relationTo: 'showcase-files',
      validate: requiredUpload,
      filterOptions: { filename: { like: '.glb' } },
      admin: {
        description:
          'A .glb file (Blender / KiCad 3D export). Keep it under ~5 MB. It turns slowly; visitors can drag to orbit.',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Still image shown while the model loads.' },
    },
    caption,
  ],
}

export const videoFields = [
  {
    name: 'video',
    type: 'upload' as const,
    relationTo: 'showcase-files' as const,
    admin: { description: 'Short muted MP4/WebM loop. Plays while on screen.' },
  },
  {
    name: 'videoUrl',
    type: 'text' as const,
    admin: {
      description: 'Or a direct .mp4/.webm URL, or a YouTube link (shown click-to-play).',
    },
  },
  {
    name: 'poster',
    type: 'upload' as const,
    relationTo: 'media' as const,
  },
]

export const videoScene: Block = {
  slug: 'sceneVideo',
  interfaceName: 'SceneVideo',
  labels: { singular: 'Video', plural: 'Videos' },
  fields: [...videoFields, caption],
}
