// Where this instance is running, from Railway's injected variables (or "local").
export const buildInfo = () => {
  const env =
    process.env.RAILWAY_ENVIRONMENT_NAME ||
    (process.env.NODE_ENV === 'production' ? 'production' : 'local')
  const sha = process.env.RAILWAY_GIT_COMMIT_SHA?.slice(0, 7) || null
  const branch = process.env.RAILWAY_GIT_BRANCH || null
  return {
    env,
    isProduction: env === 'production',
    sha,
    branch,
    node: process.version,
  }
}
