'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useRef, useState } from 'react'

import type { MediaAsset } from '@/utilities/media-file-url'
import type { NavNode } from './nav-tree'

import { cn } from '@/utilities/ui'
import { Logo } from '@/components/Logo/Logo'
import { MenuBar, MobileMenu } from './menu'
import { HeaderPrompt } from './prompt'
import { useDeskHeader } from './use-desk-header'

interface HeaderClientProps {
  nav: NavNode[]
  logo?: MediaAsset | null
  siteName?: null | string
}

// Two headers in one, picked by device (the `desk` variant in globals.css hides, so nothing flashes):
// desk, a drop-down console revealed near the top-left corner or by `/`; touch, a plain bar with [menu].
// Keyed by path, so every page starts with the header closed.
export const HeaderClient: React.FC<HeaderClientProps> = (props) => {
  const pathname = usePathname()
  return <HeaderBar key={pathname} {...props} pathname={pathname} />
}

const HeaderBar: React.FC<HeaderClientProps & { pathname: string }> = ({
  nav,
  logo,
  pathname,
  siteName,
}) => {
  const headerRef = useRef<HTMLElement>(null)
  const { intro, isDesk, nearCorner, promptOpen, revealed, setPromptOpen } =
    useDeskHeader(headerRef)
  const [menuOpen, setMenuOpen] = useState(false)
  const open = revealed || promptOpen

  return (
    <>
      <button
        aria-label="Open navigation and command prompt"
        className={cn(
          'tui-corner-hint print:hidden',
          (nearCorner || intro) && !open && 'is-visible',
        )}
        onClick={() => setPromptOpen(true)}
        type="button"
      >
        <span aria-hidden>{intro === 'full' ? '↖ menu: point here, or press /' : '↖ ~/ $'}</span>
      </button>

      <header className="tui-header print:hidden" data-open={open || undefined} ref={headerRef}>
        {isDesk && promptOpen ? (
          <div className="container flex items-center py-[0.5lh]">
            <HeaderPrompt nav={nav} onOpenChange={setPromptOpen} open pathname={pathname} />
          </div>
        ) : (
          <div className="container flex items-center justify-between gap-[2ch] py-[0.5lh]">
            <div className="flex min-w-0 items-center gap-[2ch]">
              <Link className="flex shrink-0 items-center" href="/">
                <Logo loading="eager" logo={logo} priority="high" siteName={siteName} />
              </Link>
              {isDesk && (
                <HeaderPrompt
                  nav={nav}
                  onOpenChange={setPromptOpen}
                  open={false}
                  pathname={pathname}
                />
              )}
            </div>
            <nav aria-label="Main">
              <MenuBar nodes={nav} pathname={pathname} />
              <button
                aria-controls="mobile-menu"
                aria-expanded={menuOpen}
                className="text-sm desk:hidden"
                onClick={() => setMenuOpen((value) => !value)}
                type="button"
              >
                [{menuOpen ? 'close' : 'menu'}]
              </button>
            </nav>
          </div>
        )}
        {menuOpen && <MobileMenu nodes={nav} pathname={pathname} />}
      </header>
    </>
  )
}
