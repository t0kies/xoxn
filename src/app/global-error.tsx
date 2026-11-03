'use client'

import React from 'react'

import { ErrorLayout } from '@/components/error-layout'
import { departureMono } from '@/fonts'

import './(frontend)/globals.css'

// errors from the root layout itself; has to render its own <html> and <body>
export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html className={departureMono.variable} data-theme="dark" lang="en">
      <body>
        <ErrorLayout
          code="500"
          cta={{ label: 'Try again', onClick: reset }}
          message="The server hit an error building this page. Try again, or head home."
          title="Something broke"
        />
      </body>
    </html>
  )
}
