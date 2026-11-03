'use client'
import React from 'react'

import type { NavNode } from './nav-tree'

import { PromptField } from './prompt-field'
import { BUILTINS } from './resolve'

// the ~/path $ readout; click or / turns it into a shell over the menu (Tab completes, Enter goes, .. goes up)
export const HeaderPrompt: React.FC<{
  nav: NavNode[]
  open: boolean
  onOpenChange: (open: boolean) => void
  pathname: string
}> = ({ nav, open, onOpenChange, pathname }) => {
  const cwd = `~${pathname === '/' ? '' : pathname}`

  if (!open) {
    return (
      <button
        aria-keyshortcuts="/"
        aria-label={`${cwd}: open the command prompt (press /)`}
        className="tui-prompt-readout truncate text-sm"
        onClick={() => onOpenChange(true)}
        type="button"
      >
        <span className="text-blue">{cwd}</span> <span className="text-green">$</span>
      </button>
    )
  }

  // Mounted fresh on every open, so it always starts empty.
  return (
    <PromptField
      close={() => onOpenChange(false)}
      pathname={pathname}
      roots={[...nav, ...BUILTINS.filter((b) => !nav.some((n) => n.name === b.name))]}
    />
  )
}
