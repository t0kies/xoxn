import type { CollectionBeforeValidateHook } from 'payload'
import { APIError } from 'payload'

// _gotcha is hidden from people; bots that fill every field trip it
export const rejectHoneypot: CollectionBeforeValidateHook = ({ data }) => {
  const submissionData = (data?.submissionData ?? []) as Array<{ field: string; value: unknown }>
  const honeypot = submissionData.find((entry) => entry.field === '_gotcha')

  if (honeypot && String(honeypot.value ?? '').length > 0) {
    throw new APIError('Submission rejected.', 400)
  }

  return data
}
