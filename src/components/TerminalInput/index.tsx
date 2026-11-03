'use client'
import React, { useState } from 'react'

import { cn } from '@/utilities/ui'

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> & {
  value: string
  // Greyed-out completion shown after the text (the prompt's autocomplete).
  suffix?: string
  ref?: React.Ref<HTMLInputElement>
}

// text field with a block cursor drawn in an overlay; typing restarts the blink
export const TerminalInput: React.FC<Props> = ({
  className,
  onBlur,
  onChange,
  onFocus,
  onSelect,
  suffix = '',
  value,
  ...props
}) => {
  const [focused, setFocused] = useState(false)
  const [caret, setCaret] = useState({ at: value.length, scroll: 0 })

  const track = (el: HTMLInputElement) =>
    setCaret({ at: el.selectionStart ?? el.value.length, scroll: el.scrollLeft })

  const at = Math.min(caret.at, value.length)
  const atEnd = at === value.length
  const under = atEnd ? suffix[0] || ' ' : value[at]

  return (
    <span className={cn('tui-input', className)}>
      <span aria-hidden className="tui-input-overlay" style={{ translate: `${-caret.scroll}px 0` }}>
        {focused ? (
          <>
            <span className="invisible">{value.slice(0, at)}</span>
            <span className="tui-input-cursor" key={`${value}:${at}`}>
              {under}
            </span>
            <span className="invisible">{value.slice(at + 1)}</span>
            <span className="text-dim">{atEnd ? suffix.slice(1) : suffix}</span>
          </>
        ) : (
          <>
            <span className="invisible">{value}</span>
            <span className="text-dim">{suffix}</span>
          </>
        )}
      </span>
      <input
        {...props}
        onBlur={(e) => {
          setFocused(false)
          onBlur?.(e)
        }}
        onChange={(e) => {
          track(e.currentTarget)
          onChange?.(e)
        }}
        onFocus={(e) => {
          setFocused(true)
          track(e.currentTarget)
          onFocus?.(e)
        }}
        onSelect={(e) => {
          track(e.currentTarget)
          onSelect?.(e)
        }}
        value={value}
      />
    </span>
  )
}
