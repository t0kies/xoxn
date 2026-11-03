'use client'
import React from 'react'

import type { PaletteValue } from '@/themes/kitty'

const ACCENT_SLOTS = [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14] // the ANSI hues, normal and bright

export const AccentPicker: React.FC<{
  value: PaletteValue
  onChange: (value: PaletteValue) => void
}> = ({ value, onChange }) => {
  const choices = [
    ...new Set([value.colors.cursor, ...ACCENT_SLOTS.map((i) => value.colors[`color${i}`])]),
  ]
  return (
    <div className="xn-theme__accent">
      <span>accent</span>
      {choices.map((color) => (
        <button
          aria-label={`Accent ${color}`}
          aria-pressed={color === value.accent}
          key={color}
          onClick={() => onChange({ ...value, accent: color })}
          style={{ background: color }}
          type="button"
        />
      ))}
    </div>
  )
}
