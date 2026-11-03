'use client'
import { PopupList } from '@payloadcms/ui'
import React from 'react'

import { isOwner } from '@/access/roles'
import type { FullUser } from './avatar'

// Settings shortcuts the account can open; the server still checks access.
export const SettingsLinks: React.FC<{
  user: FullUser
  href: (path: string) => string
  close: () => void
}> = ({ user, href, close }) => {
  const owner = isOwner(user)
  if (!owner) return null
  return (
    <>
      <PopupList.Divider />
      <PopupList.GroupLabel label="Settings" />
      <PopupList.ButtonGroup>
        <PopupList.Button href={href('/globals/cms-settings')} onClick={close}>
          Admin branding
        </PopupList.Button>
        <PopupList.Button href={href('/globals/appearance')} onClick={close}>
          Website appearance
        </PopupList.Button>
        <PopupList.Button href={href('/globals/site-status')} onClick={close}>
          Site status
        </PopupList.Button>
        {owner && (
          <PopupList.Button href={href('/collections/audit-logs')} onClick={close}>
            Activity log
          </PopupList.Button>
        )}
      </PopupList.ButtonGroup>
    </>
  )
}
