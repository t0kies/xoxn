'use client'

import { toast } from '@payloadcms/ui'
import React, { useState } from 'react'

// Replaces all content with the demo seed (POST /next/seed).
export const SeedButton: React.FC = () => {
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle')

  const seed = () => {
    if (state !== 'idle') return
    setState('busy')
    toast.promise(
      fetch('/next/seed', { method: 'POST', credentials: 'include' }).then((res) => {
        if (!res.ok) throw new Error('seed failed')
        setState('done')
      }),
      {
        loading: 'Seeding...',
        success: 'Seeded. Reload the site to see the demo content.',
        error: () => {
          setState('idle')
          return 'Seeding failed.'
        },
      },
    )
  }

  return (
    <button
      disabled={state !== 'idle'}
      onClick={seed}
      style={{
        background: 'none',
        border: 0,
        color: 'inherit',
        cursor: 'pointer',
        font: 'inherit',
        padding: 0,
        textDecoration: 'underline',
      }}
      type="button"
    >
      {state === 'done' ? 'seeded' : state === 'busy' ? 'seeding...' : 'seed the database'}
    </button>
  )
}
