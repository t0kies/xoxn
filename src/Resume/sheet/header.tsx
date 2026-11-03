import type { Resume } from '@/payload-types'
import React from 'react'

import { getMediaAsset } from '@/utilities/media-file-url'
import { prettyUrl } from '../data'

type Contact = { href?: string; label: string; title?: string }

const contactOf = (resume: Resume): Contact[] =>
  [
    resume.location ? { label: resume.location } : null,
    resume.email ? { label: resume.email, href: `mailto:${resume.email}` } : null,
    resume.phone
      ? { label: resume.phone, href: `tel:${resume.phone.replace(/[^+\d]/g, '')}` }
      : null,
    ...(resume.links || []).map((link) => ({
      label: prettyUrl(link.url),
      href: link.url,
      title: link.label,
    })),
  ].filter(Boolean) as Contact[]

// name, headline, contact line and the photo
export const SheetHeader: React.FC<{ resume: Resume }> = ({ resume }) => {
  const avatar = getMediaAsset(resume.avatar)
  const contact = contactOf(resume)
  return (
    <header className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        {resume.availability && (
          <p className="mb-2 text-sm lowercase resume-muted">
            <span className="text-[var(--accent)]">● </span>
            {resume.availability}
          </p>
        )}
        <h1 className="text-4xl sm:text-5xl font-bold leading-none tracking-tight">
          {resume.name}
        </h1>
        <p className="mt-2 text-lg sm:text-xl">{resume.headline}</p>
        {contact.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm resume-muted">
            {contact.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <a
                    href={item.href}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    title={item.title}
                  >
                    {item.label}
                  </a>
                ) : (
                  item.label
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {avatar && (
        // eslint-disable-next-line @next/next/no-img-element -- tiny, fixed-size, and must print
        <img
          alt=""
          className="size-20 sm:size-24 shrink-0 border-2 border-[var(--ink)] object-cover"
          src={avatar.url}
        />
      )}
    </header>
  )
}
