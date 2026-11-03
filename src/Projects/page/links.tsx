import type { Project } from '@/payload-types'
import React from 'react'

const LINK_LABELS: Record<string, string> = {
  live: 'Visit',
  demo: 'Try the demo',
  source: 'Source',
  docs: 'Docs',
  other: 'Link',
}

// the first link is the call to action, the rest are plain links
export const ProjectLinks: React.FC<{ links: NonNullable<Project['links']> }> = ({ links }) => {
  if (links.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-x-[2ch] gap-y-2">
      {links.map((link, i) => (
        <a
          className={
            i === 0 ? 'inline-flex items-center gap-[1ch]' : 'tui-link inline-flex items-center'
          }
          href={link.url}
          key={link.id || i}
          rel="noopener noreferrer"
          target={link.url.startsWith('/') ? undefined : '_blank'}
          {...(i === 0 ? { 'is-': 'button', 'variant-': 'accent' } : {})}
        >
          {link.label || LINK_LABELS[link.kind || 'other']}
          <span aria-hidden>↗</span>
        </a>
      ))}
    </div>
  )
}
