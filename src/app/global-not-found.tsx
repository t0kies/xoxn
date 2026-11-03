import type { Metadata } from 'next'

import React from 'react'

import RootLayout from './(frontend)/layout'
import NotFound from './(frontend)/not-found'

// every 404, inside the site layout (two root layouts, so Next can't pick one)
export default function GlobalNotFound() {
  return (
    <RootLayout>
      <NotFound />
    </RootLayout>
  )
}

// The layout reads site settings from the database, which the build can't
// reach (README → Deploying), so the 404 page renders per request too.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}
