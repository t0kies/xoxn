import { paragraph, sentence, title } from '../lorem'
import { doc, h, p } from '../rich-text'
import { button, column, type PageArgs, type PageData } from './parts'

export const aboutPage = ({ media }: PageArgs): PageData => ({
  slug: 'about',
  title: 'About',
  _status: 'published',
  hero: {
    type: 'highImpact',
    richText: doc(h('h1', 'About'), p(paragraph(2, 9))),
    links: [button('Get in touch', '/contact'), button('See the work', '/projects', 'outline')],
    media: media['dec-vt100'].id,
  },
  layout: [
    {
      blockType: 'content',
      columns: [
        { size: 'full', richText: doc(h('h2', title(3, 10)), p(paragraph(3, 11))) },
        column('half', title(2, 12), paragraph(2, 13)),
        column('half', title(2, 14), paragraph(2, 15)),
        column('twoThirds', title(3, 16), paragraph(3, 17)),
        column('oneThird', title(2, 18), paragraph(1, 19), { label: 'contact', url: '/contact' }),
      ],
    },
    { blockType: 'mediaBlock', media: media['tide-recorder-1831'].id },
  ],
  meta: { title: 'About', description: sentence(14, 20) },
})
