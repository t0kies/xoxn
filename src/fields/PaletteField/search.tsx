'use client'
import React from 'react'

import type { PaletteValue } from '@/themes/kitty'
import { label } from './palettes'
import type { Search } from './use-search'

type Props = {
  path: string
  search: Search
  value: PaletteValue | null
  pick: (name: string) => void
  inputRef: React.RefObject<HTMLInputElement | null>
}

export const SearchInput: React.FC<Props> = ({ path, search, value, pick, inputRef }) => {
  const { listId, names, query, setQuery, open, setOpen, setActive, highlighted, move } = search
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      move(e.key === 'ArrowDown' ? 1 : -1)
    } else if (e.key === 'Enter' && open && highlighted) {
      e.preventDefault()
      pick(highlighted)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }
  return (
    <input
      aria-activedescendant={highlighted ? `${listId}-${highlighted}` : undefined}
      aria-autocomplete="list"
      aria-controls={listId}
      aria-expanded={open}
      autoComplete="off"
      className="xn-theme__search"
      id={`field-${path}`}
      onBlur={() => setTimeout(() => setOpen(false), 120)}
      onChange={(e) => {
        setQuery(e.target.value)
        setActive(0)
        setOpen(true)
      }}
      onFocus={() => setOpen(true)}
      onKeyDown={onKeyDown}
      placeholder={
        value
          ? label(value.name)
          : names.length
            ? `search ${names.length} themes…`
            : 'loading themes…'
      }
      ref={inputRef}
      role="combobox"
      spellCheck={false}
      value={query}
    />
  )
}

export const SearchList: React.FC<Omit<Props, 'path' | 'inputRef'>> = ({ search, value, pick }) => {
  const { listId, open, setActive, matches, highlighted } = search
  if (!open || matches.length === 0) return null
  return (
    <ul className="xn-theme__list" id={listId} role="listbox">
      {matches.map((name, i) => (
        <li
          aria-selected={name === highlighted}
          id={`${listId}-${name}`}
          key={name}
          onMouseDown={(e) => {
            e.preventDefault()
            pick(name)
          }}
          onMouseEnter={() => setActive(i)}
          role="option"
        >
          {label(name)}
          {name === value?.name && <span> · current</span>}
        </li>
      ))}
    </ul>
  )
}
