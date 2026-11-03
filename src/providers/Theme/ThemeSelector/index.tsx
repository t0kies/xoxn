'use client'

import React, { useEffect, useState } from 'react'

import { applyTheme, themeIsValid, themeLocalStorageKey } from '../shared'

const OPTIONS = ['auto', 'light', 'dark'] as const

// `theme: (*) auto ( ) light ( ) dark`, as WebTUI radio buttons.
export const ThemeSelector: React.FC = () => {
  const [value, setValue] = useState<(typeof OPTIONS)[number] | null>(null)

  useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the stored choice after hydration
    setValue(themeIsValid(preference) ? preference : 'auto')
  }, [])

  return (
    <fieldset className="flex flex-wrap items-center gap-x-[1ch] text-sm">
      <legend className="float-left mr-[1ch] text-dim">theme:</legend>
      {OPTIONS.map((option) => (
        <label className="cursor-pointer" key={option}>
          <input
            checked={value === option}
            name="theme"
            onChange={() => {
              setValue(option)
              applyTheme(option === 'auto' ? null : option)
            }}
            type="radio"
            value={option}
          />
          {option}
        </label>
      ))}
    </fieldset>
  )
}
