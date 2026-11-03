import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CrtText } from '@/heros/crt-text'

// media edge to edge under a dithered fade, the text in a pane at the bottom
export const FullBleedHero: React.FC<Page['hero']> = ({ eyebrow, links, media, richText }) => {
  return (
    <div
      className="relative min-h-[32rem] w-full overflow-hidden bg-background"
      // One screen minus the pinned bars (status line, admin bar), so nothing
      // anchored to the bottom ends up behind them.
      style={{ height: 'calc(100svh - var(--statusline-height) - var(--admin-bar-height))' }}
      data-theme="dark"
    >
      {media && typeof media === 'object' && (
        <Media fill imgClassName="object-cover" priority resource={media} />
      )}
      <div aria-hidden className="dither absolute inset-0" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{ background: 'linear-gradient(to top, var(--background0) 14%, transparent)' }}
      />

      <div className="absolute inset-x-0 bottom-0 z-10 pb-[3lh]">
        <div className="container">
          {/* The whole pane is on the screen: border and shadow fringe and glitch too */}
          <CrtText>
            <div
              className="tui-window tui-shadow max-w-[48rem] px-[2ch] py-[1.5lh] backdrop-blur bg-background-14"
              data-title="motto"
            >
              <p className="tui-cmd mb-[1lh]">{eyebrow || 'cat /etc/motto'}</p>
              {richText && (
                <RichText className="hero-display mb-[1lh]" data={richText} enableGutter={false} />
              )}
              {links && links.length > 0 && (
                <ul className="flex flex-wrap gap-[2ch]">
                  {links.map(({ link }, i) => (
                    <li key={i}>
                      <CMSLink size="lg" {...link} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CrtText>
        </div>
      </div>

      <MoreHint />
      {/* Over everything, the pane included, like the glass */}
      <div aria-hidden className="hero-scanlines absolute inset-0 z-20" />
    </div>
  )
}

// "↓ -- more -- ↓" at the foot of a first-screen hero, like a pager.
export const MoreHint: React.FC = () => (
  <p aria-hidden className="absolute inset-x-0 bottom-[0.5lh] z-10 text-center text-sm text-dim">
    <span className="tui-more-arrow text-link">↓</span> -- more --{' '}
    <span className="tui-more-arrow text-link">↓</span>
  </p>
)
