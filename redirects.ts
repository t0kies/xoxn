import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // The blog used to live at /posts, paginated as /posts/page/<n>.
  const oldBlog = [
    { source: '/posts', destination: '/blog', permanent: true },
    { source: '/posts/page/:page(\\d+)', destination: '/blog?page=:page', permanent: true },
    { source: '/posts/:path*', destination: '/blog/:path*', permanent: true },
  ]

  return [internetExplorerRedirect, ...oldBlog]
}
