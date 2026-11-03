'use client'
import React, { useEffect, useId, useRef, useState } from 'react'

import type { NavNode } from './nav-tree'

import { PromptInput } from './prompt-input'
import { PromptMenu } from './prompt-menu'
import { promptKeys } from './prompt-keys'
import { resolve } from './resolve'
import { usePromptRun } from './use-prompt-run'

// the open prompt: the input, its completions and the keys
export const PromptField: React.FC<{ close: () => void; pathname: string; roots: NavNode[] }> = ({
  close,
  pathname,
  roots,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()
  const [value, setValue] = useState('')
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const isUp = /^(cd\s+)?\.\.\/?$/.test(value.trim())
  const { trail, partial, matches, broken, query } = resolve(value, roots)
  const exact = matches.find((n) => n.name === partial)
  const active = matches[Math.min(selected, matches.length - 1)]
  const unknown = !isUp && (broken !== undefined || (partial.length > 0 && matches.length === 0))
  const completion =
    active && value === value.trimEnd() && partial ? active.name.slice(partial.length) : ''
  const prefix = trail.map((n) => n.name).join('/')

  const { go, run } = usePromptRun({ close, pathname, isUp, query, partial, exact, active, trail })

  const accept = () => {
    if (!active) return
    const path = [prefix, active.name].filter(Boolean).join('/')
    setValue(active.children ? `${path}/` : path)
    setSelected(0)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>
    promptKeys({
      run,
      close,
      accept,
      canComplete: () => Boolean(active && (completion || !exact || active.children)),
      canAccept: () => Boolean(completion && inputRef.current?.selectionStart === value.length),
      step: (step) => {
        if (!matches.length) return false
        setSelected(
          (i) => (Math.min(i, matches.length - 1) + step + matches.length) % matches.length,
        )
        return true
      },
    })(e)

  const activeId = active ? `${listId}-${active.name}` : undefined
  const title = unknown ? 'error' : prefix ? `~/${prefix}` : 'goto'

  return (
    <div className="relative min-w-0 flex-1 text-sm">
      <PromptInput
        activeId={activeId}
        completion={completion}
        expanded={matches.length > 0}
        inputRef={inputRef}
        listId={listId}
        onBlur={close}
        onChange={(next) => {
          setValue(next)
          setSelected(0)
        }}
        onKeyDown={onKeyDown}
        unknown={unknown}
        value={value}
      />

      <PromptMenu
        active={active}
        go={go}
        listId={listId}
        matches={matches}
        title={title}
        unknown={unknown ? (broken ?? partial) : undefined}
      />
    </div>
  )
}
