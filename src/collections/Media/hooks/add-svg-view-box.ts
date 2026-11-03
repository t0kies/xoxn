import type { CollectionBeforeOperationHook } from 'payload'

import { looksLikeSvg, withViewBox } from './svg'

// adds a viewBox before Payload reads the file's size; older uploads need re-uploading
export const addSvgViewBox: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if ((operation !== 'create' && operation !== 'update') || !req.file?.data) return args
  if (!looksLikeSvg(req.file)) return args
  const fixed = withViewBox(req.file.data.toString('utf8'))
  if (!fixed) return args
  const data = Buffer.from(fixed, 'utf8')
  req.file.data = data
  req.file.size = data.length
  return args
}
