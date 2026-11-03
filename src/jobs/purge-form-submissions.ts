import type { TaskConfig } from 'payload'

// The privacy page (src/app/(frontend)/privacy-policy) quotes this number to
// visitors, so changing it changes the promise too.
export const FORM_SUBMISSION_RETENTION_MONTHS = 12

export const retentionCutoff = (now: Date, months = FORM_SUBMISSION_RETENTION_MONTHS): Date => {
  const cutoff = new Date(now)
  cutoff.setUTCMonth(cutoff.getUTCMonth() - months)
  return cutoff
}

// deletes submissions and activity past retention; daily on the maintenance queue
// by hand: GET /api/payload-jobs/run?queue=maintenance with Bearer $CRON_SECRET
export const purgeFormSubmissions: TaskConfig<'purgeFormSubmissions'> = {
  slug: 'purgeFormSubmissions',
  label: 'Purge expired form submissions and activity',
  retries: 2,
  schedule: [{ cron: '0 30 3 * * *', queue: 'maintenance' }],
  outputSchema: [{ name: 'deleted', type: 'number', required: true }],
  handler: async ({ req }) => {
    const cutoff = retentionCutoff(new Date())

    const result = await req.payload.delete({
      collection: 'form-submissions',
      where: { createdAt: { less_than: cutoff.toISOString() } },
      overrideAccess: true,
      req,
    })

    const activity = await req.payload.delete({
      collection: 'audit-logs',
      where: { createdAt: { less_than: cutoff.toISOString() } },
      overrideAccess: true,
      req,
    })

    const deleted = result.docs.length + activity.docs.length
    if (deleted > 0) {
      req.payload.logger.info(
        `Purged ${result.docs.length} form submission(s) and ${activity.docs.length} activity entries older than ${cutoff.toISOString()}`,
      )
    }

    return { output: { deleted } }
  },
}
