import type { Payload } from 'payload'

import { context } from './context'

// The header and the footer key bar. One-word labels: they double as prompt commands.
export const seedNav = async (payload: Payload, pages: Record<string, number>) => {
  const page = (label: string, slug: string) => ({
    type: 'reference' as const,
    label,
    reference: { relationTo: 'pages' as const, value: pages[slug] },
  })
  const url = (label: string, href: string, newTab?: boolean) => ({
    type: 'custom' as const,
    label,
    url: href,
    newTab,
  })

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      context,
      // One-word labels: they double as prompt commands. Three levels deep:
      // projects/<project>/<link>, blog/<category>/<post>, about/links/github.
      data: {
        navItems: [
          { link: url('Projects', '/projects'), autoChildren: 'projects' },
          { link: url('Blog', '/blog'), autoChildren: 'posts' },
          {
            link: page('About', 'about'),
            submenu: [
              { link: page('Components', 'components') },
              {
                link: url('Links', '/about'),
                items: [
                  { link: url('GitHub', 'https://github.com/example', true) },
                  { link: url('Website', 'https://example.com', true) },
                ],
              },
            ],
          },
          { link: page('Contact', 'contact') },
        ],
      },
      overrideAccess: true,
    }),
    payload.updateGlobal({
      slug: 'footer',
      context,
      // The numbered key bar: 1-9 open these from the keyboard.
      data: {
        navItems: [
          { link: url('Projects', '/projects') },
          { link: url('Blog', '/blog') },
          { link: page('About', 'about') },
          { link: page('Components', 'components') },
          { link: page('Contact', 'contact') },
        ],
      },
      overrideAccess: true,
    }),
  ])
}
