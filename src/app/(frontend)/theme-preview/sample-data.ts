// Lorem Ipsum for the preview, so every theme shows the same page.
export const POSTS = [
  {
    slug: 'lorem',
    title: 'Lorem ipsum dolor sit',
    publishedAt: '2026-10-11',
    categories: [{ title: 'notes' }],
    meta: { description: 'Consectetur adipiscing elit, sed do eiusmod tempor.' },
  },
  {
    slug: 'ipsum',
    title: 'Amet consectetur',
    publishedAt: '2026-09-28',
    categories: [{ title: 'guides' }],
    meta: { description: 'Ut enim ad minim veniam, quis nostrud exercitation.' },
  },
  {
    slug: 'dolor',
    title: 'Sed do eiusmod tempor',
    publishedAt: '2026-09-02',
    categories: [{ title: 'updates' }],
    meta: { description: 'Duis aute irure dolor in reprehenderit in voluptate.' },
  },
]

export const CODE = `// Lorem ipsum, in this theme's syntax colors
export const greet = (name: string, times = 2) =>
  \`hello, \${name}\`.repeat(times) // a comment`
