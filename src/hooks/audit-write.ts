import type { PayloadRequest } from 'payload'

export type Doc = Record<string, unknown>
const IGNORED = new Set([
  'updatedAt',
  'createdAt',
  'hash',
  'salt',
  'password',
  'loginAttempts',
  'lockUntil',
  'sessions',
  'resetPasswordToken',
  'resetPasswordExpiration',
  '_verificationToken',
])

export const changedFields = (prev: Doc = {}, next: Doc = {}): string[] =>
  Object.keys({ ...prev, ...next }).filter(
    (k) => !IGNORED.has(k) && JSON.stringify(prev[k]) !== JSON.stringify(next[k]),
  )

const titleOf = (doc: Doc): string =>
  String(doc.title ?? doc.name ?? doc.email ?? doc.filename ?? doc.id ?? '')

export type Entry = {
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'login'
  target: string
  doc: Doc
  fields?: string[]
}

export type Actor = { id: number | string; email?: string } | null | undefined

export const writeLog = async (req: PayloadRequest, e: Entry, actor: Actor = req.user as Actor) => {
  if (req.context?.disableRevalidate || req.context?.skipAudit) return // seed runs and bulk system writes
  const user = actor
  await req.payload.create({
    collection: 'audit-logs',
    overrideAccess: true,
    req,
    data: {
      action: e.action,
      target: e.target,
      docId: e.doc.id ? String(e.doc.id) : undefined,
      docTitle: titleOf(e.doc),
      user: user?.id as number | undefined,
      userLabel: user?.email ?? 'system',
      changedFields: e.fields,
    },
  })
}
