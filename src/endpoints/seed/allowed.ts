// seeding wipes content: only with ALLOW_SEED=true
export const isSeedAllowed = (): boolean => (process.env.ALLOW_SEED || '').trim() === 'true'
