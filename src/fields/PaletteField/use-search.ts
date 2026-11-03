'use client'
import { useEffect, useId, useMemo, useState } from 'react'

import type { KittyColors } from '@/themes/kitty'
import { loadColors, loadNames } from './palettes'

// The theme list, the search over it and the highlighted theme's colors.
export const useSearch = (onError: (message: string) => void) => {
  const listId = useId()
  const [names, setNames] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [preview, setPreview] = useState<{ name: string; colors: KittyColors } | null>(null)

  useEffect(() => {
    loadNames()
      .then(setNames)
      .catch(() => onError('Could not reach kitty-themes. Try again in a moment.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const matches = useMemo(() => {
    const q = query
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '')
    return q ? names.filter((name) => name.toLowerCase().replace(/_/g, '').includes(q)) : names
  }, [names, query])
  const highlighted = open ? matches[Math.min(active, matches.length - 1)] : undefined

  useEffect(() => {
    if (!highlighted) return
    let cancelled = false
    const timer = setTimeout(() => {
      loadColors(highlighted).then((colors) => {
        if (!cancelled && colors) setPreview({ name: highlighted, colors })
      })
    }, 60) // in ms, so arrowing stays smooth
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [highlighted])

  useEffect(() => {
    if (highlighted)
      document.getElementById(`${listId}-${highlighted}`)?.scrollIntoView({ block: 'nearest' })
  }, [highlighted, listId])

  const move = (step: number) => {
    setOpen(true)
    setActive((i) => Math.max(0, Math.min(matches.length - 1, i + step)))
  }

  return {
    listId,
    names,
    query,
    setQuery,
    open,
    setOpen,
    setActive,
    matches,
    highlighted,
    preview,
    move,
  }
}

export type Search = ReturnType<typeof useSearch>
