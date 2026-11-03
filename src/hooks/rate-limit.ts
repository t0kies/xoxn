import type { CollectionBeforeOperationHook } from 'payload'
import { APIError } from 'payload'

const buckets = new Map<string, { count: number; reset: number }>()

// count TRUSTED_PROXY_HOPS from the right of X-Forwarded-For; the left is spoofable
const PROXY_HOPS = Math.max(1, Number(process.env.TRUSTED_PROXY_HOPS) || 1)

const clientIp = (headers: Headers) => {
  const chain = (headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean)
  return chain[Math.max(0, chain.length - PROXY_HOPS)] || headers.get('x-real-ip') || 'unknown'
}

// per-IP window on anonymous creates and auth; in memory, per instance
export const rateLimitAnonymous =
  (
    name: string,
    max: number,
    windowMs: number,
    operations: readonly string[] = ['create'],
  ): CollectionBeforeOperationHook =>
  ({ args, operation, req }) => {
    // Server-side Local API calls (seed, scripts, hooks) are trusted.
    if (!operations.includes(operation) || req.user || req.payloadAPI === 'local' || !req.headers)
      return args

    const now = Date.now()
    const key = `${name}:${clientIp(req.headers)}`
    const bucket = buckets.get(key)

    if (!bucket || bucket.reset < now) {
      buckets.set(key, { count: 1, reset: now + windowMs })
      if (buckets.size > 10_000) {
        for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k)
      }
      return args
    }

    bucket.count += 1
    if (bucket.count > max) throw new APIError('Too many requests. Please try again later.', 429)
    return args
  }
