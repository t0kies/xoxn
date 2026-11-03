'use client'

import React, { useCallback, useEffect, useRef } from 'react'

import type { PaletteValue } from '@/themes/kitty'

// the real site in a frame, recolored by postMessage
export const Preview: React.FC<{ mode: 'dark' | 'light'; palette: PaletteValue }> = ({
  mode,
  palette,
}) => {
  const frame = useRef<HTMLIFrameElement>(null)
  const send = useCallback(() => {
    frame.current?.contentWindow?.postMessage(
      { type: 'xn-theme-preview', mode, palette },
      window.location.origin,
    )
  }, [mode, palette])

  useEffect(send, [send])
  useEffect(() => {
    // The frame says when it's listening; answer with the current theme.
    const onMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data?.type === 'xn-theme-preview-ready')
        send()
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [send])

  return (
    <iframe
      className="xn-theme__preview"
      ref={frame}
      src="/theme-preview"
      style={{ background: palette.colors.background }}
      tabIndex={-1}
      title="Theme preview"
    />
  )
}
