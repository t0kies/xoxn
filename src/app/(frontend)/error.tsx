'use client'

import React, { useEffect } from 'react'

import { ErrorLayout } from '@/components/error-layout'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorLayout
      code="500"
      cta={{ label: 'Try again', onClick: reset }}
      message="The server hit an error building this page. Try again, or head home."
      title="Something broke"
    />
  )
}
