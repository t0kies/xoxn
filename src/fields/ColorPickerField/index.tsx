'use client'

import type { TextFieldClientProps } from 'payload'

import { FieldLabel, useField } from '@payloadcms/ui'
import React, { useCallback } from 'react'

const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export const ColorPickerField: React.FC<TextFieldClientProps> = (props) => {
  const { field, path: pathFromProps } = props
  const { path, setValue, value } = useField<string>({ potentiallyStalePath: pathFromProps })

  const stringValue = typeof value === 'string' ? value : ''
  const swatchValue = HEX_PATTERN.test(stringValue) ? stringValue : '#000000'

  const onSwatchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    },
    [setValue],
  )

  const onTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    },
    [setValue],
  )

  return (
    <div className="field-type text" style={{ marginBottom: 'calc(var(--base) * 0.8)' }}>
      <FieldLabel htmlFor={`field-${path}`} label={field.label} required={field.required} />
      <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
        <input
          aria-label="Pick a color"
          onChange={onSwatchChange}
          style={{
            border: '1px solid var(--theme-elevation-150)',
            cursor: 'pointer',
            height: '36px',
            padding: '2px',
            width: '44px',
          }}
          type="color"
          value={swatchValue}
        />
        <input
          className="field-type__input"
          id={`field-${path}`}
          onChange={onTextChange}
          placeholder="#7c3aed"
          style={{
            border: '1px solid var(--theme-elevation-150)',
            flex: 1,
            fontFamily: 'var(--font-mono)',
            height: '36px',
            padding: '0 8px',
          }}
          type="text"
          value={stringValue}
        />
      </div>
    </div>
  )
}

export default ColorPickerField
