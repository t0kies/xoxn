import type { Resume } from '@/payload-types'

import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { isOwner } from '@/access/roles'
import { targetPath } from './target-path'

export type ResumeTarget = NonNullable<Resume['targets']>[number]

// Depth 1 so avatar and the PDF override come back as media docs.
export const getResume = () => getCachedGlobal('resume', 1)()

// off: 404 for visitors, still visible to the owner; headers only read when off
export const canViewResume = async (resume: Resume): Promise<boolean> => {
  if (resume.enabled && resume.name) return true

  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  return isOwner(user)
}

// By its full link id, `<slug>--<key>`; the slug alone matches nothing.
export const findTarget = (resume: Resume, id: string): ResumeTarget | null =>
  resume.targets?.find((target) => targetPath(target) === id) ?? null

export type ResumeSection = NonNullable<ResumeTarget['hideSections']>[number]

// a tailored version shows only the items ticked for it (target row ids)
export const tailorFor = (target?: null | ResumeTarget) => {
  const hidden = new Set(target?.hideSections || [])

  const shows = (item: { tailorTags?: null | string[] }): boolean =>
    !target || (!!target.id && !!item.tailorTags?.includes(target.id))

  return {
    section: (name: ResumeSection): boolean => !hidden.has(name),
    items: <T extends { tailorTags?: null | string[] }>(
      name: ResumeSection,
      list?: null | T[],
    ): T[] => (hidden.has(name) ? [] : (list || []).filter(shows)),
    shows,
  }
}

export const splitList = (value?: null | string): string[] =>
  (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

// Display form of a link: drop the protocol and trailing slash.
export const prettyUrl = (url: string): string =>
  url
    .replace(/^(https?:\/\/|mailto:|tel:)/i, '')
    .replace(/^www\./i, '')
    .replace(/\/$/, '')
