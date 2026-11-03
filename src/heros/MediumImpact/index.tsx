import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

// Split pane: text on the left, the media in its own framed pane on the right.
export const MediumImpactHero: React.FC<Page['hero']> = ({ eyebrow, links, media, richText }) => (
  <div className="container grid gap-[2lh] pt-[2lh] pb-[1lh] lg:grid-cols-12 lg:items-center lg:gap-[4ch]">
    <div className="flex flex-col gap-[1lh] lg:col-span-5">
      {eyebrow && <p className="tui-cmd">{eyebrow}</p>}
      {/* A narrower column than the full-bleed hero: a smaller display size, so words don't break */}
      {richText && (
        <RichText
          className="hero-display hero-display-split"
          data={richText}
          enableGutter={false}
        />
      )}
      {links && links.length > 0 && (
        <ul className="flex flex-wrap gap-[2ch]">
          {links.map(({ link }, i) => (
            <li key={i}>
              <CMSLink {...link} />
            </li>
          ))}
        </ul>
      )}
    </div>

    {media && typeof media === 'object' && (
      <figure className="lg:col-span-7">
        <div className="tui-window tui-shadow" data-title={media.filename || 'image'}>
          <Media imgClassName="w-full object-cover" priority resource={media} />
        </div>
        {media.caption && (
          <figcaption className="mt-[0.5lh] text-sm text-dim before:text-link before:content-['//_'] [&_p]:inline">
            <RichText data={media.caption} enableGutter={false} enableProse={false} />
          </figcaption>
        )}
      </figure>
    )}
  </div>
)
