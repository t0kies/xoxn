import type { Media, ShowcaseFile } from '@/payload-types'

import React from 'react'

import type { Scene } from '.'

import { CodeScene } from './code'
import { Image, Pane } from './pane'
import { Model } from './model'
import { Video } from './video'

// how each kind of scene draws in the showcase
const media = (value?: Media | null | number | string) =>
  value && typeof value === 'object' && value.url ? value : null
const file = (value?: null | number | ShowcaseFile | string) =>
  value && typeof value === 'object' && value.url ? value : null

export const renderScene = (scene: Scene, name: string) => {
  switch (scene.blockType) {
    case 'scenePhoto':
    case 'sceneSchematic': {
      const image = media(scene.image)
      if (!image) return null
      const schematic = scene.blockType === 'sceneSchematic'
      return (
        <Pane caption={scene.caption} title={schematic ? 'schematic' : 'photo'}>
          <Image alt={schematic ? `${name} board layout` : name} image={image} />
        </Pane>
      )
    }
    case 'sceneModel': {
      const model = file(scene.model)
      if (!model) return null
      return (
        <Pane caption={scene.caption} title="3d model · drag to orbit">
          <Model
            alt={model.alt || `${name} 3D model`}
            poster={media(scene.poster)?.url}
            src={model.url!}
          />
        </Pane>
      )
    }
    case 'sceneVideo': {
      const src = file(scene.video)?.url || scene.videoUrl
      if (!src) return null
      return (
        <Pane caption={scene.caption} title="video">
          <Video poster={media(scene.poster)?.url} src={src} title={name} />
        </Pane>
      )
    }
    case 'sceneCode':
      // the code block is its own pane; only the caption goes under it
      return (
        <figure className="flex flex-col gap-[0.5lh]">
          <CodeScene
            code={scene.code}
            cues={scene.cues}
            filename={scene.filename}
            language={scene.language}
            poster={media(scene.poster)?.url}
            title={name}
            videoSrc={file(scene.video)?.url || scene.videoUrl || null}
          />
          {scene.caption && (
            <figcaption className="text-sm text-dim before:text-link before:content-['//_']">
              {scene.caption}
            </figcaption>
          )}
        </figure>
      )
    default:
      return null
  }
}
