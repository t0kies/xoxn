import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CrtText } from '@/heros/crt-text'
import { MoreHint } from '@/heros/FullBleed'

// an old monitor that switches on, then idles; all CSS, see tui/hero.css
export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => (
  <div
    className="crt-bezel relative min-h-[32rem] w-full overflow-hidden"
    // One screen minus the pinned bars, like the full-bleed hero.
    style={{ height: 'calc(100svh - var(--statusline-height) - var(--admin-bar-height))' }}
    data-theme="dark"
  >
    <div className="crt-screen absolute inset-0 flex items-center bg-background">
      {media && typeof media === 'object' && (
        <Media fill imgClassName="hero-high-media object-cover" priority resource={media} />
      )}
      <div aria-hidden className="hero-high-shade absolute inset-0" />

      <div className="container relative z-10">
        <CrtText>
          {richText && (
            <RichText
              className="hero-display hero-outline mb-[1.2lh] max-w-[48rem]"
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
        </CrtText>
      </div>

      <MoreHint />

      {/* Over everything, text included, like the glass */}
      <div aria-hidden className="crt-glass absolute inset-0 z-20" />
    </div>
  </div>
)
