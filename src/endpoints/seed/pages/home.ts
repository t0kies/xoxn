import { paragraph, sentence, title } from '../lorem'
import { doc, h, p } from '../rich-text'
import { button, column, type PageArgs, type PageData } from './parts'

export const homePage = ({ media }: PageArgs): PageData => ({
  slug: 'home',
  title: 'Home',
  _status: 'published',
  hero: {
    type: 'superImpact',
    eyebrow: 'cat ~/motd',
    media: media['tidal-flats-dusk'].id,
    richText: doc(
      h('h1', 'xoxn'),
      p(`${sentence(14, 1)} Sign in to the admin and make it yours.`),
    ),
    links: [
      button('Tour the components', '/components'),
      button('See the work', '/projects', 'outline'),
    ],
  },
  layout: [
    {
      blockType: 'content',
      columns: [
        { size: 'full', richText: doc(h('h2', "What's here"), p(paragraph(1, 2))) },
        column('oneThird', 'Projects', sentence(14, 3), { label: 'ls projects', url: '/projects' }),
        column('oneThird', 'Blog', sentence(14, 4), { label: 'ls blog', url: '/blog' }),
        column('oneThird', 'Contact', sentence(14, 5), { label: 'mail me', url: '/contact' }),
      ],
    },
    {
      blockType: 'archive',
      populateBy: 'collection',
      relationTo: 'posts',
      limit: 4,
      introContent: doc(h('h2', 'Latest posts')),
    },
    {
      blockType: 'cta',
      richText: doc(h('h3', title(4, 6)), p(sentence(16, 7))),
      links: [button('Get in touch', '/contact'), button('Read the blog', '/blog', 'outline')],
    },
    { blockType: 'mediaBlock', media: media['tidal-flats-evening'].id },
  ],
  meta: { title: 'xoxn', description: sentence(16, 8), image: media['tidal-flats-dusk'].id },
})
