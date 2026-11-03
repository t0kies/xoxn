'use client'

import React, { useState } from 'react'

import { CodeBlock } from '@/blocks/Code/Component'

import { Video } from './video'

type Cue = { at: number; from: number; note?: null | string; to?: null | number }

// code scene: the latest passed cue lights its lines and shows its note
export const CodeScene: React.FC<{
  code: string
  cues?: Cue[] | null
  filename?: null | string
  language?: null | string
  poster?: null | string
  title: string
  videoSrc?: null | string
}> = ({ code, cues, filename, language, poster, title, videoSrc }) => {
  const [time, setTime] = useState(0)
  const synced = Boolean(videoSrc && cues?.length && !/youtu\.?be/i.test(videoSrc))
  const active = synced
    ? [...(cues || [])].sort((a, b) => b.at - a.at).find((cue) => cue.at <= time)
    : undefined

  const listing = (
    <CodeBlock
      active={active}
      blockType="code"
      code={code}
      filename={filename}
      language={language || 'go'}
    />
  )
  if (!videoSrc) return listing

  return (
    <div className="grid gap-[1lh] md:grid-cols-2 md:items-start">
      <div className="flex flex-col gap-[0.5lh]">
        <Video onTime={synced ? setTime : undefined} poster={poster} src={videoSrc} title={title} />
        {active?.note && <p className="text-sm text-yellow">▸ {active.note}</p>}
      </div>
      {listing}
    </div>
  )
}
