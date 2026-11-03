'use client'
import { Highlight } from 'prism-react-renderer'
import React, { useState } from 'react'

import { theme } from './theme'

export type CodeBlockProps = {
  code: string
  language?: string
  blockType: 'code'
}

// code pane: filename on the edge, copy, numbered lines; active lights a range
export const CodeBlock: React.FC<
  CodeBlockProps & {
    active?: { from: number; to?: null | number }
    className?: string
    filename?: null | string
  }
> = ({ active, className, code, filename, language = '' }) => {
  const [copied, setCopied] = useState(false)
  if (!code) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      // Clipboard can be blocked; selecting the text still works.
    }
  }

  return (
    <div
      className={['tui-window tui-shadow text-[0.875rem]', className].filter(Boolean).join(' ')}
      data-title={filename || language || 'text'}
    >
      <button
        className="absolute right-[1ch] top-0 z-[2] -translate-y-1/2 bg-background px-[0.5ch] text-xs text-dim hover:text-link"
        onClick={copy}
        type="button"
      >
        [{copied ? 'copied' : 'copy'}]
      </button>
      <Highlight code={code.replace(/\n$/, '')} language={language} theme={theme}>
        {({ getLineProps, getTokenProps, tokens }) => (
          <pre className="tui-code">
            {tokens.map((line, i) => (
              <div
                key={i}
                {...getLineProps({
                  className:
                    active && i + 1 >= active.from && i + 1 <= (active.to ?? active.from)
                      ? 'flex bg-raised'
                      : 'flex',
                  line,
                })}
              >
                <span
                  className="tui-code-number"
                  style={{ width: `${String(tokens.length).length + 2}ch` }}
                >
                  {i + 1}
                </span>
                <span className="tui-code-text">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
