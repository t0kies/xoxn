'use client'

import React, { useEffect, useState } from 'react'

import { CodeBlock } from '@/blocks/Code/Component'
import { CMSLink } from '@/components/Link'
import { PageHead } from '@/components/page-head'
import { PostList } from '@/components/PostList'
import { TerminalInput } from '@/components/TerminalInput'
import { paletteCss } from '@/themes/css'
import { isPaletteValue } from '@/themes/kitty'

import { CODE, POSTS } from './sample-data'
import { SampleHeader, SampleKeyBar, SampleStatusLine } from './samples'

export type PreviewMessage = { type: 'xn-theme-preview'; mode: 'dark' | 'light'; palette: unknown }

// The site's real components in a theme the admin's palette picker posts (same origin only).
export const ThemePreview: React.FC = () => {
  const [css, setCss] = useState('')

  useEffect(() => {
    const onMessage = (event: MessageEvent<PreviewMessage>) => {
      if (event.origin !== window.location.origin || event.data?.type !== 'xn-theme-preview') return
      const { mode, palette } = event.data
      if (!isPaletteValue(palette)) return
      document.documentElement.dataset.theme = mode
      setCss(paletteCss({ [mode]: palette }, 'site'))
    }
    window.addEventListener('message', onMessage)
    window.parent?.postMessage({ type: 'xn-theme-preview-ready' }, window.location.origin) // ready: send the current theme
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <div
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest('a')) e.preventDefault()
      }}
    >
      <style>{css}</style>

      <SampleHeader />

      <PageHead cmd="ls -l ~/blog" title="Blog" />
      <div className="container flex flex-col gap-[1.5lh] pb-[1.5lh]">
        <PostList posts={POSTS} />

        <div className="tui-window tui-shadow px-[2ch] py-[1lh]" data-title="readme.md">
          <div className="prose">
            <h2>Heading</h2>
            <p>
              Body text with <strong>bold</strong>, <a href="#">a link</a> and{' '}
              <code>inline code</code>.
            </p>
          </div>
          <div className="mt-[1lh] flex flex-wrap items-center gap-[1ch]">
            <CMSLink appearance="default" label="button" type="custom" url="#" />
            <CMSLink appearance="outline" label="outline" type="custom" url="#" />
            {(['cyan', 'magenta', 'yellow', 'green', 'blue', 'red'] as const).map((hue) => (
              <span is-="badge" key={hue} variant-={hue}>
                {hue}
              </span>
            ))}
          </div>
          <div className="mt-[1lh] bg-surface px-[1ch]">
            <span className="text-link">/ </span>
            <TerminalInput
              aria-label="Sample input"
              onChange={() => {}}
              tabIndex={-1}
              value="lorem ipsum"
            />
          </div>
        </div>

        <CodeBlock blockType="code" code={CODE} filename="greet.ts" language="typescript" />

        <SampleKeyBar />
      </div>

      <SampleStatusLine />
    </div>
  )
}
