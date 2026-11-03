import type { File, Payload } from 'payload'
import { readFileSync } from 'fs'
import { join } from 'path'

import { creditCaption, SEED_MEDIA, type SeedMedia } from './media'

// from the app root: the Docker image copies them there (the bundled code lives elsewhere)
const assets = join(process.cwd(), 'src/endpoints/seed/assets')

const mimetypes: Record<string, string> = {
  glb: 'model/gltf-binary',
  webp: 'image/webp',
}

// a committed seed file from ./assets, as an upload
const loadSeedFile = (filename: string): File => {
  const data = readFileSync(join(assets, filename))
  return {
    name: filename,
    data,
    mimetype: mimetypes[filename.split('.').pop() || ''] || 'application/octet-stream',
    size: data.byteLength,
  }
}

// the CC0 / public domain photos and the 3D board model
export const seedFiles = async (payload: Payload) => {
  const media = Object.fromEntries(
    await Promise.all(
      Object.entries(SEED_MEDIA).map(async ([key, { alt, credit }]) => [
        key,
        await payload.create({
          collection: 'media',
          data: { alt, caption: creditCaption(credit) },
          file: loadSeedFile(`${key}.webp`),
          overrideAccess: true,
        }),
      ]),
    ),
  ) as SeedMedia
  const boardModel = await payload.create({
    collection: 'showcase-files',
    data: { alt: 'A small controller board in 3D' },
    file: loadSeedFile('demo-board.glb'),
    overrideAccess: true,
  })
  return { media, boardModel }
}
