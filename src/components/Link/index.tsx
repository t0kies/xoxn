import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'
import { docPath } from '@/utilities/doc-path'

type CMSLinkType = {
  // inline: a plain link. default / outline: a WebTUI button.
  appearance?: 'default' | 'inline' | 'outline' | null
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: 'lg' | 'sm' | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

const BUTTON: Record<'default' | 'outline', Record<string, string>> = {
  default: { 'is-': 'button', 'variant-': 'accent' },
  outline: { 'is-': 'button', 'variant-': 'foreground0', 'box-': 'square' },
}

const SIZE = { lg: 'large', sm: 'small' } as const

// The URL a CMS link field points at: a page/post reference resolves to its slug path.
export const resolveLinkHref = ({
  type,
  reference,
  url,
}: Pick<CMSLinkType, 'reference' | 'type' | 'url'>): string | null | undefined =>
  type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
    ? docPath(reference.relationTo, reference.value.slug)
    : url

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const { appearance = 'inline', children, className, label, newTab, size } = props

  const href = resolveLinkHref(props)
  if (!href) return null

  const button =
    appearance && appearance !== 'inline'
      ? { ...BUTTON[appearance], ...(size ? { 'size-': SIZE[size] } : {}) }
      : {}

  return (
    <Link
      className={className}
      href={href}
      {...button}
      {...(newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
    >
      {label}
      {children}
    </Link>
  )
}
