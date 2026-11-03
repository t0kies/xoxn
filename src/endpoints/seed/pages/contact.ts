import { sentence } from '../lorem'
import { doc, h, p } from '../rich-text'
import { type PageArgs, type PageData } from './parts'

export const contactPage = ({ contactForm }: PageArgs): PageData => ({
  slug: 'contact',
  title: 'Contact',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    eyebrow: 'mail hello@example.com',
    richText: doc(h('h1', 'Contact'), p(sentence(14, 21))),
  },
  layout: [
    {
      blockType: 'formBlock',
      form: contactForm,
      enableIntro: true,
      introContent: doc(h('h3', 'Send a message'), p(sentence(12, 22))),
    },
  ],
  meta: { title: 'Contact', description: sentence(12, 23) },
})
