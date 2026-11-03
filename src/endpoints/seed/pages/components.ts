import { paragraph, sentence } from '../lorem'
import { doc, h, link, p } from '../rich-text'
import { button, column, type PageArgs, type PageData } from './parts'

export const componentsPage = ({ categories, media, posts }: PageArgs): PageData => ({
  slug: 'components',
  title: 'Components',
  _status: 'published',
  hero: {
    type: 'mediumImpact',
    eyebrow: 'ls ~/components',
    media: media['dec-vt100'].id,
    richText: doc(
      h('h1', 'Components'),
      p(
        `Every block a page can hold, in one place. ${sentence(10, 24)} The `,
        link('/blog/formatting-reference', 'formatting reference'),
        ' post does the same for posts.',
      ),
    ),
    links: [
      button('Formatting reference', '/blog/formatting-reference'),
      button('Contact', '/contact', 'outline'),
    ],
  },
  layout: [
    {
      blockType: 'content',
      columns: [
        { size: 'full', richText: doc(h('h2', 'Content columns'), p(sentence(14, 25))) },
        column('oneThird', 'One third', sentence(12, 26)),
        column('oneThird', 'One third', sentence(12, 27)),
        column('oneThird', 'One third', sentence(12, 28), { label: 'a link', url: '/blog' }),
        column('half', 'Half', paragraph(1, 29)),
        column('half', 'Half', paragraph(1, 30)),
        column('twoThirds', 'Two thirds', paragraph(2, 31)),
        column('oneThird', 'One third', sentence(14, 32)),
      ],
    },
    {
      blockType: 'cta',
      richText: doc(h('h3', 'Call to action'), p(sentence(14, 33))),
      links: [button('Primary', '/contact'), button('Outline', '/projects', 'outline')],
    },
    {
      blockType: 'archive',
      populateBy: 'selection',
      relationTo: 'posts',
      selectedDocs: posts
        .slice(0, 2)
        .map((post) => ({ relationTo: 'posts' as const, value: post.id })),
      introContent: doc(h('h2', 'Archive: picked posts'), p(sentence(10, 34))),
    },
    {
      blockType: 'archive',
      populateBy: 'collection',
      relationTo: 'posts',
      categories: [categories[0].id],
      limit: 3,
      introContent: doc(h('h2', `Archive: the ${categories[0].title.toLowerCase()} category`)),
    },
    { blockType: 'mediaBlock', media: media['breadboard-prototype'].id },
  ],
  meta: { title: 'Components', description: sentence(14, 35) },
})
