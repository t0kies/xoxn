'use client'
import React from 'react'

import { TerminalInput } from '@/components/TerminalInput'

type Props = {
  activeId?: string
  completion: string
  expanded: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
  listId: string
  onBlur: () => void
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  unknown: boolean
  value: string
}

// the prompt's input line: `~/`, what's typed and the dimmed completion, as a combobox
export const PromptInput: React.FC<Props> = ({
  activeId,
  completion,
  expanded,
  inputRef,
  listId,
  onBlur,
  onChange,
  onKeyDown,
  unknown,
  value,
}) => (
  <div className="flex items-baseline">
    <span aria-hidden className="text-blue">
      ~/
    </span>
    <TerminalInput
      aria-activedescendant={activeId}
      aria-autocomplete="both"
      aria-controls={listId}
      aria-expanded={expanded}
      aria-invalid={unknown || undefined}
      aria-label="Go to"
      autoCapitalize="off"
      autoComplete="off"
      onBlur={onBlur}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      ref={inputRef}
      role="combobox"
      spellCheck={false}
      className="flex-1"
      suffix={completion}
      type="text"
      value={value}
    />
  </div>
)
