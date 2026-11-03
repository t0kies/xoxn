'use client'

import React, { useRef, useState } from 'react'

import { useInView } from './use-in-view'

const youtubeId = (url: string): null | string =>
  url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i)?.[1] ?? null

// files loop muted while on screen; YouTube stays a poster until clicked
export const Video: React.FC<{
  onTime?: (seconds: number) => void
  poster?: null | string
  src: string
  title: string
}> = ({ onTime, poster, src, title }) => {
  const ref = useRef<HTMLVideoElement>(null)
  const [embedOpen, setEmbedOpen] = useState(false)
  const ytId = youtubeId(src)
  const frame = 'block aspect-video w-full bg-surface'

  useInView(
    ref,
    (inView) => {
      const video = ref.current
      if (!video) return
      if (inView && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.play().catch(() => {})
      } else video.pause()
    },
    '-15% 0px',
  )

  if (ytId) {
    return embedOpen ? (
      <iframe
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className={frame}
        src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
        title={title}
      />
    ) : (
      <button
        aria-label={`Play video: ${title}`}
        className={`${frame} grid place-items-center bg-cover bg-center`}
        onClick={() => setEmbedOpen(true)}
        style={{
          backgroundImage: `url(${poster || `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`})`,
        }}
        type="button"
      >
        <span aria-hidden className="bg-background px-[1ch] text-link">
          [ ▶ play ]
        </span>
      </button>
    )
  }

  return (
    <video
      aria-label={title}
      className={frame}
      loop
      muted
      onTimeUpdate={onTime ? (e) => onTime(e.currentTarget.currentTime) : undefined}
      playsInline
      poster={poster || undefined}
      preload="metadata"
      ref={ref}
      src={src}
    />
  )
}
