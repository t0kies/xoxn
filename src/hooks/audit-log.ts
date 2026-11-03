import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionAfterLoginHook,
  GlobalAfterChangeHook,
} from 'payload'

import { changedFields, writeLog, type Actor, type Doc, type Entry } from './audit-write'

// Draft autosaves are skipped; publish and unpublish are their own actions.
export const auditAfterChange: CollectionAfterChangeHook = async ({
  collection,
  doc,
  previousDoc,
  operation,
  req,
}) => {
  const prevStatus = previousDoc?._status
  const status = doc._status
  if (status === 'draft' && prevStatus !== 'published') return doc

  let action: Entry['action'] = operation
  if (status === 'published' && prevStatus !== 'published') action = 'publish'
  if (status === 'draft' && prevStatus === 'published') action = 'unpublish'

  const fields = operation === 'update' ? changedFields(previousDoc, doc) : undefined
  if (action === 'update' && fields?.length === 0) return doc

  await writeLog(req, {
    action,
    target: collection.slug,
    doc,
    fields,
  })
  return doc
}

export const auditAfterDelete: CollectionAfterDeleteHook = async ({ collection, doc, req }) => {
  await writeLog(req, {
    action: 'delete',
    target: collection.slug,
    doc,
  })
  return doc
}

export const auditGlobal: GlobalAfterChangeHook = async ({ doc, previousDoc, global, req }) => {
  const fields = changedFields(previousDoc, doc)
  if (fields.length > 0) {
    await writeLog(req, {
      action: 'update',
      target: `global:${global.slug}`,
      doc: { ...doc, title: global.label ?? global.slug },
      fields,
    })
  }
  return doc
}

// sign-ins, to see when the account was last used and from where
export const auditLogin: CollectionAfterLoginHook = async ({ req, user }) => {
  await writeLog(
    req,
    {
      action: 'login',
      target: 'users',
      doc: user as Doc,
    },
    user as Actor,
  )
  return user
}
