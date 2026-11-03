'use client'

import React, { useRef, useState } from 'react'

import { useInView } from './use-in-view'

// <model-viewer>, loaded near the viewport; turns slowly, drag to orbit
export const Model: React.FC<{ alt: string; poster?: null | string; src: string }> = ({
  alt,
  poster,
  src,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useInView(
    ref,
    (inView) => {
      if (inView && !ready)
        import('@google/model-viewer').then(() => setReady(true)).catch(() => {})
    },
    '300px',
  )

  return (
    <div className="aspect-[4/3] w-full bg-surface" ref={ref}>
      {ready ? (
        React.createElement('model-viewer', {
          alt,
          src,
          poster: poster || undefined,
          'auto-rotate': true,
          'camera-controls': true,
          'disable-zoom': true,
          'interaction-prompt': 'none',
          loading: 'lazy',
          'touch-action': 'pan-y',
          style: { width: '100%', height: '100%', background: 'transparent' },
        })
      ) : poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} className="h-full w-full object-contain" src={poster} />
      ) : (
        <div aria-label={alt} className="dither h-full w-full" role="img" />
      )}
    </div>
  )
}
