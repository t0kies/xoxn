'use client'

import type { UIFieldClientComponent } from 'payload'

import { useFormFields } from '@payloadcms/ui'
import React, { useState } from 'react'

import { targetPath } from './target-path'

// the link to send for one tailored version; the key exists after the first save
export const TargetLinkField: UIFieldClientComponent = ({ path }) => {
  const row = path.slice(0, path.lastIndexOf('.'))
  const slug = useFormFields(([fields]) => fields?.[`${row}.slug`]?.value as string | undefined)
  const key = useFormFields(([fields]) => fields?.[`${row}.key`]?.value as string | undefined)
  const [copied, setCopied] = useState(false)

  const relative = targetPath({ key, slug })
  const href = relative ? `${window.location.origin}/resume/${relative}` : null

  const copy = async () => {
    if (!href) return
    try {
      await navigator.clipboard.writeText(href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="field-type" style={{ marginBottom: 'var(--base)' }}>
      <span className="field-label">Link to send</span>
      {href ? (
        <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '6px 12px' }}>
          <a href={href} rel="noopener noreferrer" target="_blank">
            {href}
          </a>
          <button className="btn btn--style-secondary btn--size-small" onClick={copy} type="button">
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      ) : (
        <p className="field-description">Save to get this version&apos;s link.</p>
      )}
      <p className="field-description">
        Only this exact link opens the version: the random part after &quot;--&quot; keeps it
        unguessable.
      </p>
    </div>
  )
}
