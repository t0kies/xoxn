import type { Block } from 'payload'

import { caption, requiredUpload } from './shared'

export const photoScene: Block = {
  slug: 'scenePhoto',
  interfaceName: 'ScenePhoto',
  labels: { singular: 'Photo', plural: 'Photos' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', validate: requiredUpload },
    caption,
  ],
}

export const schematicScene: Block = {
  slug: 'sceneSchematic',
  interfaceName: 'SceneSchematic',
  labels: { singular: 'Schematic / PCB', plural: 'Schematics / PCBs' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      validate: requiredUpload,
      admin: {
        description:
          'A schematic or PCB layout export (PNG or SVG, e.g. KiCad "Plot" or "Export SVG").',
      },
    },
    caption,
  ],
}
