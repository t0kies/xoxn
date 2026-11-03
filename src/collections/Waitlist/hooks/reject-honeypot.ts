import type { CollectionBeforeValidateHook } from 'payload'
import { APIError } from 'payload'

// _gotcha on the status page signup, like the contact form's
export const rejectHoneypot: CollectionBeforeValidateHook = ({ data }) => {
  if (String(data?._gotcha ?? '').length > 0) {
    throw new APIError('Submission rejected.', 400)
  }

  return data
}
