'use client'
import { Popup, PopupList, useConfig, useTheme } from '@payloadcms/ui'
import React from 'react'


import { Avatar } from './avatar'
import { Identity } from './identity'
import { SettingsLinks } from './settings'
import { useFullUser } from './use-full-user'
import './index.scss'

// The account dropdown in the admin header.
export const AccountMenu: React.FC = () => {
  const user = useFullUser()
  const { theme, setTheme } = useTheme()
  const { config } = useConfig()
  const { account, logout } = config.admin.routes
  if (!user) return null
  const href = (path: string) => `${config.routes.admin}${path}`

  return (
    <Popup
      button={
        <span aria-label="Account menu" className="xn-chip account-menu__button">
          <Avatar size={18} user={user} />
          <span className="account-menu__button-name">{user.name || user.email}</span>
        </span>
      }
      buttonClassName="account-menu__trigger"
      buttonType="custom"
      caret={false}
      className="account-menu"
      horizontalAlign="right"
      portalClassName="account-menu__portal"
      render={({ close }) => (
        <div className="account-menu__panel">
          <Identity user={user} />
          <PopupList.ButtonGroup>
            <PopupList.Button href={href(account)} onClick={close}>
              My profile & password
            </PopupList.Button>
            <PopupList.Button
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark')
                close()
              }}
            >
              Switch to {theme === 'dark' ? 'light' : 'dark'} mode
            </PopupList.Button>
            <PopupList.Button href="/" onClick={close}>
              View website
            </PopupList.Button>
          </PopupList.ButtonGroup>
          <SettingsLinks close={close} href={href} user={user} />
          <PopupList.Divider />
          <PopupList.ButtonGroup>
            <PopupList.Button className="account-menu__logout" href={href(logout)}>
              Log out
            </PopupList.Button>
          </PopupList.ButtonGroup>
        </div>
      )}
      size="large"
    />
  )
}

export default AccountMenu
