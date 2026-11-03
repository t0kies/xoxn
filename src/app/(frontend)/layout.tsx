import type { Metadata } from 'next'

import { departureMono } from '@/fonts'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { StatusGate } from '@/SiteStatus/gate'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaAsset } from '@/utilities/media-file-url'
import { brandFavicon } from '@/brand/assets'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { appearanceCss } from '@/themes/appearance'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const appearance = await getCachedGlobal('appearance', 1)() // depth 1 populates the favicon
  const siteStatus = await getCachedGlobal('site-status', 0)()

  const bypass = isEnabled // draft previews always see the real site
  const showChrome =
    siteStatus.status === 'live' || siteStatus.status === 'under-construction' || bypass

  const themeCss = appearanceCss(appearance)

  const favicon = getMediaAsset(appearance?.branding?.favicon) || brandFavicon

  return (
    <html
      className={departureMono.variable}
      data-effects={appearance?.printEffects === false ? 'false' : 'true'}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <style>{themeCss}</style>
        <link href={favicon.url} rel="icon" {...(favicon.isSvg ? { type: 'image/svg+xml' } : {})} />
      </head>
      <body>
        <AdminBar draft={isEnabled} />

        {showChrome && <Header />}
        <StatusGate bypass={bypass} status={siteStatus}>
          {children}
        </StatusGate>
        {showChrome && <Footer />}
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const cmsSettings = await getCachedGlobal('cms-settings', 0)()
  const siteStatus = await getCachedGlobal('site-status', 0)()
  const siteName = cmsSettings?.siteName || 'xoxn'

  return {
    metadataBase: new URL(getServerSideURL()),
    robots: siteStatus.status !== 'live' ? { index: false, follow: false } : undefined,
    title: { default: siteName, template: `%s | ${siteName}` },
    description: cmsSettings?.tagline || undefined,
    openGraph: mergeOpenGraph({
      siteName,
      title: siteName,
      description: cmsSettings?.tagline || undefined,
    }),
    twitter: {
      card: 'summary_large_image',
    },
  }
}
