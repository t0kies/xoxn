import type { Metadata } from 'next'

import React from 'react'

import { ThemePreview } from './preview.client'

// framed by the palette picker; hides the site header, bars and footer
export default function Page() {
  return (
    <>
      <style>{`.tui-header,.tui-corner-hint,.tui-adminbar,body>footer{display:none!important}body{padding-bottom:0!important}`}</style>
      <ThemePreview />
    </>
  )
}

// The site layout reads settings from the database, which the build can't reach.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Theme preview',
  robots: { index: false, follow: false },
}
