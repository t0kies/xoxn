import React from 'react'

import { ErrorLayout } from '@/components/error-layout'

export default function NotFound() {
  return (
    <ErrorLayout
      code="404"
      cta={{ label: 'Go home', href: '/' }}
      message="This page could not be found."
      title="Page not found"
    />
  )
}
