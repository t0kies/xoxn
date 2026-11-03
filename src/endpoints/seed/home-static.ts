import type { RequiredDataFromCollectionSlug } from 'payload'

import { doc, h, link, p } from './rich-text'

// Shown on a fresh, unseeded database so the homepage is never empty.
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  title: 'Home',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    eyebrow: 'cat ~/readme.md',
    richText: doc(
      h('h1', 'xoxn'),
      p(
        'A terminal-style portfolio on Payload CMS: projects, a blog and a resume with tailored versions.',
      ),
      p(link('/admin', 'Open the admin'), ' to sign in, then seed the demo or start writing.'),
    ),
  },
  layout: [],
  meta: { title: 'xoxn', description: 'A terminal-style portfolio on Payload CMS.' },
}
