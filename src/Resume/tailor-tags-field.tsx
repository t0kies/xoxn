'use client'

import type { TextFieldClientComponent } from 'payload'

import { useField, useFormFields } from '@payloadcms/ui'
import React from 'react'

type Version = { id: string; label: string }

// Joined into one string so the selector only re-renders on a real change.
const SEP = '\u0000'

// tick the tailored versions an item shows on; stores row ids, so slug renames keep picks
export const TailorTagsField: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const { setValue, value } = useField<null | string[]>({ path })

  const versionsKey = useFormFields(([fields]) => {
    const count = Number(fields?.targets?.value) || 0
    return Array.from({ length: count }, (_, i) => {
      const id = fields?.[`targets.${i}.id`]?.value
      const slug = fields?.[`targets.${i}.slug`]?.value
      const company = fields?.[`targets.${i}.company`]?.value
      return id ? `${id}${SEP}${company || slug || 'Untitled version'}` : ''
    })
      .filter(Boolean)
      .join('\n')
  })

  const versions: Version[] = versionsKey
    ? versionsKey.split('\n').map((row) => {
        const [id, label] = row.split(SEP)
        return { id, label }
      })
    : []

  const picked = value || []
  // Picks pointing at a deleted version, kept visible so they can be cleared.
  const missing = picked.filter((id) => !versions.some((version) => version.id === id))

  const toggle = (id: string) =>
    setValue(picked.includes(id) ? picked.filter((p) => p !== id) : [...picked, id])

  const description =
    typeof field.admin?.description === 'string' ? field.admin.description : undefined

  return (
    <div className="field-type" style={{ marginBottom: 'var(--base)' }}>
      <span className="field-label">{(field.label as string) || 'Tailored versions'}</span>
      {versions.length === 0 && missing.length === 0 ? (
        <p className="field-description">
          No tailored versions yet. Add one under the &quot;Tailored versions&quot; tab.
        </p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px' }}>
          {[...versions, ...missing.map((id) => ({ id, label: 'Deleted version' }))].map(
            (version) => (
              <label
                key={version.id}
                style={{ alignItems: 'center', cursor: 'pointer', display: 'flex', gap: '6px' }}
              >
                <input
                  checked={picked.includes(version.id)}
                  disabled={readOnly}
                  onChange={() => toggle(version.id)}
                  type="checkbox"
                />
                {version.label}
              </label>
            ),
          )}
        </div>
      )}
      {description && <p className="field-description">{description}</p>}
    </div>
  )
}
