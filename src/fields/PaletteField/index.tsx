'use client'
import type { JSONFieldClientProps } from 'payload'
import { FieldDescription, FieldLabel, useField } from '@payloadcms/ui'
import React, { useMemo, useRef, useState } from 'react'

import { isLightTheme, KITTY_CREDIT, type PaletteValue } from '@/themes/kitty'
import { AccentPicker } from './accent'
import { defaultAccent, label, loadColors } from './palettes'
import { Preview } from './preview'
import { SearchInput, SearchList } from './search'
import { useSearch } from './use-search'
import './index.scss'

// A kitty theme for one mode (the path ends in .dark or .light): search, preview, pick, then an accent.
// Stores { name, accent, colors }; empty means the custom colors.
export const PaletteField: React.FC<JSONFieldClientProps> = ({ field, path: pathFromProps }) => {
  const { path, setValue, value } = useField<PaletteValue | null>({
    potentiallyStalePath: pathFromProps,
  })
  const mode = path.endsWith('light') ? 'light' : 'dark'
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const search = useSearch(setError)
  const { open, preview } = search

  const pick = async (name: string) => {
    const colors = await loadColors(name)
    if (!colors) return setError(`Could not load ${label(name)}.`)
    setValue({ name, accent: defaultAccent(colors), colors })
    search.setQuery('')
    search.setOpen(false)
    setError(null)
    inputRef.current?.blur()
  }

  const shown =
    open && preview ? preview : value ? { name: value.name, colors: value.colors } : null
  const shownLight = shown ? isLightTheme(shown.colors) : null
  const shownAccent = shown ? (open || !value ? defaultAccent(shown.colors) : value.accent) : null
  const shownPalette = useMemo(
    () =>
      shown && shownAccent ? { name: shown.name, accent: shownAccent, colors: shown.colors } : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shown is rebuilt each render; its name identifies it
    [shown?.name, shownAccent],
  )

  return (
    <div className="field-type xn-theme">
      <FieldLabel htmlFor={`field-${path}`} label={field.label} path={path} />
      {shown && (
        <>
          <Preview mode={mode} palette={shownPalette!} />
          <p className="xn-theme__meta">
            {label(shown.name)} · {shownLight ? 'light' : 'dark'} theme
            {open && shown.name !== value?.name && ' · preview'}
            {shownLight !== (mode === 'light') && (
              <b> · made for {shownLight ? 'light' : 'dark'} mode</b>
            )}
          </p>
        </>
      )}
      <div className="xn-theme__bar">
        <SearchInput
          inputRef={inputRef}
          path={path}
          pick={(name) => void pick(name)}
          search={search}
          value={value}
        />
        {value && (
          <button className="xn-theme__clear" onClick={() => setValue(null)} type="button">
            use custom colors
          </button>
        )}
      </div>
      <SearchList pick={(name) => void pick(name)} search={search} value={value} />
      {error && <p className="xn-theme__error">{error}</p>}
      {value && !open && <AccentPicker onChange={setValue} value={value} />}
      <FieldDescription description={field.admin?.description} path={path} />
      <p className="xn-theme__meta">
        Palettes from{' '}
        <a href={KITTY_CREDIT.url} rel="noopener noreferrer" target="_blank">
          {KITTY_CREDIT.name}
        </a>{' '}
        by {KITTY_CREDIT.author} ({KITTY_CREDIT.license}); each theme&apos;s author is listed{' '}
        <a href={KITTY_CREDIT.themesUrl} rel="noopener noreferrer" target="_blank">
          there
        </a>
        .
      </p>
    </div>
  )
}
