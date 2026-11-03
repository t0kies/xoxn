// Security headers for every response, plus the unlisted resume and uploaded SVGs.
export const headers = async () => {
  const security = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    },
    ...(process.env.NODE_ENV === 'production'
      ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]
      : []),
  ]
  return [
    { source: '/:path*', headers: security },
    // Baseline CSP that leaves scripts alone (model-viewer, live preview). Skipped for
    // uploaded files: object-src 'none' stops browsers rendering PDFs inline.
    {
      source: '/((?!api/media/file/|api/showcase-files/file/).*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "base-uri 'self'; object-src 'none'; frame-ancestors 'self'",
        },
      ],
    },
    // The resume is unlisted (sent directly): keep it and its tailored
    // versions out of search engines, including the PDF.
    ...['/resume', '/resume/:path*', '/resume.pdf'].map((source) => ({
      source,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    })),
    // Uploaded SVGs can carry scripts; opened directly they must not run in the site's origin.
    {
      source: '/api/media/file/:file(.*\\.svg)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'none'; style-src 'unsafe-inline'; sandbox",
        },
      ],
    },
  ]
}
