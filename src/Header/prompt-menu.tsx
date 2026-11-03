'use client'
import React from 'react'

import type { NavNode } from './nav-tree'

type Props = {
  title: string
  listId: string
  matches: NavNode[]
  active?: NavNode
  unknown?: string // the segment that matches nothing
  go: (node: NavNode) => void
}

// the completions under the open prompt
export const PromptMenu: React.FC<Props> = ({ title, listId, matches, active, unknown, go }) => (
  <div className="tui-window tui-shadow tui-prompt-menu" data-title={title}>
    <p aria-live="polite" className="px-[1ch] text-red empty:hidden">
      {unknown !== undefined ? `cd: no such command: ${unknown}` : ''}
    </p>
    <ul id={listId} role="listbox">
      {matches.map((node) => (
        <li
          aria-selected={node === active}
          className="tui-prompt-option"
          id={`${listId}-${node.name}`}
          key={node.name}
          onMouseDown={(e) => e.preventDefault()} // keep focus in the input so the click lands
          onClick={() => go(node)}
          role="option"
        >
          <span>
            {node.name}
            {node.children ? '/' : ''}
          </span>
          <span className="truncate">{node.label}</span>
        </li>
      ))}
    </ul>
    <p aria-hidden className="mt-[0.5lh] whitespace-nowrap px-[1ch] text-xs text-dim">
      tab complete · / submenu · ↑↓ pick · ↵ go · esc
    </p>
  </div>
)
