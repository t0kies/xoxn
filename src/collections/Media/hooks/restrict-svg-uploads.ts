import type { CollectionBeforeValidateHook } from 'payload'
import { APIError } from 'payload'
import { isOwner } from '@/access/roles'

import { looksLikeSvg } from './svg'

// SVGs can carry scripts, so only the owner uploads them; checked by content and extension
export const restrictSvgUploads: CollectionBeforeValidateHook = ({ req }) => {
  if (looksLikeSvg(req.file) && !isOwner(req.user)) {
    throw new APIError('Only the owner can upload SVG files.', 403)
  }
}
