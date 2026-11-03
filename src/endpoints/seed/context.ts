// Seeding skips the revalidate hooks (there may be no server) and the audit log.
// It runs with overrideAccess throughout: a trusted maintenance job, not a request.
export const context = { disableRevalidate: true }
