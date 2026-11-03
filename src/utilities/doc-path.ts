// Where each linkable collection lives on the site. The posts collection is the blog.
const PREFIX = { pages: '', posts: '/blog', projects: '/projects' } as const

export type LinkableCollection = keyof typeof PREFIX

// The public path of a document: `/about`, `/blog/hello`, `/projects/tide-clock`.
export const docPath = (collection: LinkableCollection, slug: string) =>
  `${PREFIX[collection]}/${slug}`
