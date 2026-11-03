import React from 'react'

import type { Config } from '@/payload-types'

import { StatusLayout } from '@/SiteStatus/layout'

type SiteStatusDoc = Config['globals']['site-status']

type StatusViewProps = {
  status: SiteStatusDoc
}

export const StatusView: React.FC<StatusViewProps> = ({ status }) => {
  const message = status.message || undefined

  switch (status.status) {
    case 'maintenance':
      return (
        <StatusLayout
          countdownTo={status.estimatedReturnTime || undefined}
          label="Maintenance"
          message={message}
          title="Down for maintenance"
        />
      )
    case 'coming-soon':
      return (
        <StatusLayout label="Coming soon" message={message} showEmailSignup title="Not open yet" />
      )
    case 'under-construction':
      return (
        <StatusLayout
          bypassPaths={(status.bypassPaths || []).map((entry) => entry.path)}
          label="Under construction"
          message={message}
          title="Still building this one"
        />
      )
    case 'offline':
      return <StatusLayout label="Offline" message={message} title="Offline" />
    default:
      return null
  }
}
