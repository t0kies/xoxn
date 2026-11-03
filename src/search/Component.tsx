'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { TerminalInput } from '@/components/TerminalInput'
import { useDebounce } from '@/utilities/useDebounce'

// vim-style search line: `/ query`, results update as you type.
export const Search: React.FC<{ initial?: string }> = ({ initial = '' }) => {
  const [value, setValue] = useState(initial)
  const router = useRouter()
  const debouncedValue = useDebounce(value)

  useEffect(() => {
    if (debouncedValue === initial) return
    router.replace(`/search${debouncedValue ? `?q=${encodeURIComponent(debouncedValue)}` : ''}`)
  }, [debouncedValue, initial, router])

  return (
    <form
      className="flex items-center gap-[1ch] bg-surface px-[1ch]"
      onSubmit={(e) => e.preventDefault()}
      role="search"
    >
      <label aria-hidden className="text-link" htmlFor="search">
        /
      </label>
      <TerminalInput
        aria-label="Search posts"
        className="flex-1"
        id="search"
        onChange={(event) => setValue(event.target.value)}
        placeholder="search posts..."
        type="search"
        value={value}
      />
    </form>
  )
}
