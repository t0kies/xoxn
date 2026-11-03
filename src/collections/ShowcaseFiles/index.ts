import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

import { APIError } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { capPublicReadLimit } from '@/hooks/cap-public-read-limit'
import { anyone, ownerOnly } from '@/access/roles'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit-log'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const MAX_BYTES = 50 * 1024 * 1024

// octet-stream only with a .glb name; 50 MB cap
const validateShowcaseFile: CollectionBeforeValidateHook = ({ req }) => {
  const file = req.file
  if (!file) return

  if (file.size > MAX_BYTES) {
    throw new APIError(
      'Showcase files are limited to 50 MB. Compress the video or model first.',
      400,
    )
  }

  const isGlb = file.name.toLowerCase().endsWith('.glb')
  if (file.mimetype === 'application/octet-stream' && !isGlb) {
    throw new APIError('Only .glb models, MP4 and WebM videos can be uploaded here.', 400)
  }
}

// 3D models and videos for the scenes, kept out of Media so sharp skips them
export const ShowcaseFiles: CollectionConfig = {
  slug: 'showcase-files',
  labels: {
    singular: 'Showcase file',
    plural: 'Showcase files',
  },
  access: {
    create: ownerOnly,
    delete: ownerOnly,
    read: anyone,
    update: ownerOnly,
  },
  admin: {
    description: '3D models (.glb) and short videos (.mp4, .webm) for the resume portfolio.',
    group: 'Resume',
  },
  hooks: {
    beforeOperation: [capPublicReadLimit],
    beforeValidate: [validateShowcaseFile],
    afterChange: [auditAfterChange],
    afterDelete: [auditAfterDelete],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: { description: 'What it shows, for screen readers.' },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../../public/showcase-files'),
    mimeTypes: ['model/gltf-binary', 'application/octet-stream', 'video/mp4', 'video/webm'],
  },
}
