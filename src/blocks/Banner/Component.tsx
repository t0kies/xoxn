import type { BannerBlock as BannerBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & BannerBlockProps

// Log-level prefixes, like a terminal message line
const LEVEL: Record<string, { label: string; color: string }> = {
  info: { label: 'info', color: 'var(--ansi-cyan)' },
  success: { label: 'ok', color: 'var(--ansi-green)' },
  warning: { label: 'warn', color: 'var(--ansi-yellow)' },
  error: { label: 'error', color: 'var(--ansi-red)' },
}

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  const level = LEVEL[style || 'info'] || LEVEL.info

  return (
    <div className={cn('w-full', className)}>
      <div
        className="flex items-start gap-[1ch] border-l-[1ch] bg-surface px-[1ch] py-[0.5lh]"
        role={style === 'error' || style === 'warning' ? 'alert' : undefined}
        style={{ borderLeftColor: level.color }}
      >
        <span className="shrink-0 font-bold uppercase" style={{ color: level.color }}>
          [{level.label}]
        </span>
        <RichText data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}
