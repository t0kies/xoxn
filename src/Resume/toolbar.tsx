'use client'

import React, { useState } from 'react'

// Screen-only actions above the sheet: copy the link, download the PDF (/resume.pdf), print.
export const ResumeToolbar: React.FC<{ pdfHref: string }> = ({ pdfHref }) => {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked (insecure context, permissions); the URL bar still works.
    }
  }

  return (
    <div className="resume-toolbar flex flex-wrap items-center justify-end gap-[2ch]">
      <button is-="button" onClick={copyLink} size-="small" type="button" variant-="background2">
        {copied ? '✓ link copied' : 'copy link'}
      </button>
      <button
        is-="button"
        onClick={() => window.print()}
        size-="small"
        type="button"
        variant-="background2"
      >
        print
      </button>
      <a download href={pdfHref} is-="button" size-="small" variant-="accent">
        ↓ download pdf
      </a>
    </div>
  )
}
