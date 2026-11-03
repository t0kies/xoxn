import type { PayloadRequest } from 'payload'

import Link from 'next/link'
import React from 'react'

import { isSeedAllowed } from '@/endpoints/seed/allowed'

import { SeedButton } from './seed-button'

// where things live, read from the config so it follows whatever collections the site has
export const Start = async ({ req }: { req: PayloadRequest }) => {
  const admin = req.payload.config.routes.admin
  const content = req.payload.config.collections.filter(
    (c) => c.admin?.group !== false && !c.admin?.hidden && c.slug !== 'users',
  )
  const settings = req.payload.config.globals

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <p>
        Content:{' '}
        {content.map((c, i) => (
          <React.Fragment key={c.slug}>
            {i > 0 && ' · '}
            <Link href={`${admin}/collections/${c.slug}`}>
              {typeof c.labels.plural === 'string' ? c.labels.plural : c.slug}
            </Link>
          </React.Fragment>
        ))}
      </p>
      <p>
        Settings:{' '}
        {settings.map((g, i) => (
          <React.Fragment key={g.slug}>
            {i > 0 && ' · '}
            <Link href={`${admin}/globals/${g.slug}`}>
              {typeof g.label === 'string' ? g.label : g.slug}
            </Link>
          </React.Fragment>
        ))}
      </p>
      {isSeedAllowed() && (
        <p>
          ALLOW_SEED is on: <SeedButton /> (replaces pages, posts, projects and media with the demo).
          Unset it afterwards.
        </p>
      )}
    </div>
  )
}
