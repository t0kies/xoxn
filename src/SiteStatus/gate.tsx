'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

import type { Config } from '@/payload-types'

import { StatusView } from '@/SiteStatus/view'

type SiteStatusDoc = Config['globals']['site-status']

type StatusGateProps = {
  status: SiteStatusDoc
  bypass: boolean
  children: React.ReactNode
}

// draft mode sees the real site; bypassPaths are checked client side (no middleware)
// Reachable whatever the status: the coming-soon page links to it and the
// waitlist collects emails, so the policy has to be readable then too.
const ALWAYS_OPEN = ['/privacy-policy']

export const StatusGate: React.FC<StatusGateProps> = ({ status, bypass, children }) => {
  const pathname = usePathname()

  if (bypass || status.status === 'live' || ALWAYS_OPEN.includes(pathname)) {
    return <>{children}</>
  }

  if (status.status === 'under-construction') {
    const bypassPaths = (status.bypassPaths || []).map((entry) => entry.path)
    if (bypassPaths.includes(pathname)) return <>{children}</>
  }

  return <StatusView status={status} />
}
