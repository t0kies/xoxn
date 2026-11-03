import type { CollectionBeforeOperationHook } from 'payload'

export const PUBLIC_READ_LIMIT = 100

// anonymous REST reads capped, so limit=0 can't dump a collection
// `any` slug so the one hook fits collections typed with their own slug (CollectionConfig<'pages'>).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const capPublicReadLimit: CollectionBeforeOperationHook<any> = ({
  args,
  operation,
  req,
}) => {
  if (operation !== 'read' || req.user || req.payloadAPI === 'local') return args

  const requested = Number((args as { limit?: unknown }).limit)
  const limit = requested > 0 ? Math.min(requested, PUBLIC_READ_LIMIT) : PUBLIC_READ_LIMIT

  return { ...args, limit, pagination: true }
}
