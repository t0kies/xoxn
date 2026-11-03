import { getFeatures, visibleNavItems } from '@/utilities/features'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { resolveLinkHref } from '@/components/Link'

import { type Key, KeyBar } from './key-bar'
import { StatusLine } from './status-line'

export async function Footer() {
  const [footerData, cmsSettings, features] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedGlobal('cms-settings', 0)(),
    getFeatures(),
  ])

  const navItems = visibleNavItems(footerData?.navItems, features)
  const socialLinks = cmsSettings?.socialLinks || []
  const siteName = cmsSettings?.siteName || 'xoxn'
  const keys: Key[] = [
    ...navItems.flatMap(({ link }) => {
      const href = resolveLinkHref(link)
      return href ? [{ label: link.label, href, newTab: link.newTab || undefined }] : []
    }),
    // Built-in page, so every install links its privacy policy.
    { label: 'privacy', href: '/privacy-policy' },
  ]

  return (
    <footer className="mt-auto border-t-2 border-line bg-surface print:hidden">
      <div className="container flex flex-col gap-[1lh] py-[1.5lh]">
        <KeyBar keys={keys} />

        <div className="flex flex-col items-start gap-[0.5lh] text-sm">
          <ThemeSelector />
          {socialLinks.length > 0 && (
            <ul className="flex flex-wrap gap-x-[1ch]">
              {socialLinks.map((social, i) => (
                <li key={i}>
                  <a
                    className="tui-link"
                    href={social.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {social.platform === 'other' ? 'link' : social.platform}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="flex justify-between gap-[2ch] text-xs text-dim">
          <span>
            <span className="text-link">$</span> echo &quot;(c) {new Date().getFullYear()}{' '}
            {siteName}&quot;
          </span>
        </p>
      </div>
      <StatusLine siteName={siteName} />
    </footer>
  )
}
