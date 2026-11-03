import type { CollectionBeforeOperationHook } from 'payload'
import { APIError } from 'payload'

export const MIN_PASSWORD_LENGTH = 12

// 12+ characters on create, update and reset (reset skips validate hooks)
export const enforcePasswordPolicy: CollectionBeforeOperationHook = ({ args, operation }) => {
  if (!['create', 'update', 'updateByID', 'resetPassword'].includes(operation)) return args
  const password = (args as { data?: { password?: unknown } }).data?.password
  if (typeof password === 'string' && password.length < MIN_PASSWORD_LENGTH) {
    throw new APIError(`Passwords must be at least ${MIN_PASSWORD_LENGTH} characters.`, 400)
  }
  return args
}
