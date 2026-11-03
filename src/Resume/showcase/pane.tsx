import type { Media } from '@/payload-types'
import React from 'react'

// one scene as a titled pane, its caption printed underneath as a comment
export const Pane: React.FC<{
  caption?: null | string
  children: React.ReactNode
  title: string
}> = ({ caption, children, title }) => (
  <figure className="flex flex-col gap-[0.5lh]">
    <div className="tui-window tui-shadow" data-title={title}>
      {children}
    </div>
    {caption && (
      <figcaption className="text-sm text-dim before:text-link before:content-['//_']">
        {caption}
      </figcaption>
    )}
  </figure>
)

export const Image: React.FC<{ image: Media; alt: string }> = ({ image, alt }) => (
  // eslint-disable-next-line @next/next/no-img-element -- already sized by Payload, PNG/SVG exports
  <img
    alt={image.alt || alt}
    className="block h-auto w-full"
    height={image.height ?? undefined}
    loading="lazy"
    src={image.url!}
    width={image.width ?? undefined}
  />
)
