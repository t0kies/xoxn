import type { Config, PayloadRequest } from 'payload'

import { isOwner } from '@/access/roles'
import { purgeFormSubmissions } from '@/jobs/purge-form-submissions'

// The owner, or a scheduler (a Railway cron service) with CRON_SECRET as a bearer token.
const canRun = ({ req }: { req: PayloadRequest }): boolean => {
  if (isOwner(req.user)) return true
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return req.headers.get('authorization') === `Bearer ${secret}`
}

export const jobs: Config['jobs'] = {
  access: { run: canRun },
  tasks: [purgeFormSubmissions],
  autoRun: [{ cron: '0 0 * * * *', queue: 'maintenance' }], // hourly, needs a long-running server
  shouldAutoRun: () =>
    process.env.NEXT_PHASE !== 'phase-production-build' &&
    (process.env.DISABLE_JOB_AUTORUN || '').trim() !== 'true', // set on a second replica
}
