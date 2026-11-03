import type { Post } from '@/payload-types'

import { paragraph, sentence, title, words } from './lorem'
import type { SeedMedia } from './media'
import {
  banner,
  BOLD,
  code,
  doc,
  h,
  hr,
  ITALIC,
  link,
  mediaBlock,
  p,
  text,
  UNDERLINE,
} from './rich-text'

// every node the post editor has, so every style shows
export const reference = (media: SeedMedia): Post['content'] =>
  doc(
    p(paragraph(2, 1)),
    h('h2', 'Text'),
    p(
      text('Lorem ipsum in '),
      text('bold', BOLD),
      text(', '),
      text('italic', ITALIC),
      text(' and '),
      text('underline', UNDERLINE),
      text(', with '),
      link('/blog', 'a link to the blog'),
      text('. '),
      text(sentence(14, 3)),
    ),
    h('h3', 'A third-level heading'),
    p(paragraph(2, 4)),
    h('h4', 'A fourth-level heading'),
    p(paragraph(1, 5)),
    h('h2', 'Banners'),
    banner('info', 'Info: ', text(sentence(8, 6))),
    banner('success', 'Success: ', text(sentence(8, 7))),
    banner('warning', 'Warning: ', text(sentence(8, 8))),
    banner('error', 'Error: ', text(sentence(8, 9))),
    h('h2', 'Code'),
    code(
      'typescript',
      `// Long lines wrap inside the pane; the numbers keep their own column.
type Greeting = { name: string; loud?: boolean }

export const greet = ({ name, loud = false }: Greeting): string => {
  const line = \`Lorem ipsum, \${name}. Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.\`
  return loud ? line.toUpperCase() : line
}`,
    ),
    code(
      'css',
      `.pane {
  border: 2px solid var(--box-border-color);
  padding: 1lh 2ch; /* lines and character cells */
}`,
    ),
    code('javascript', `console.log(['lorem', 'ipsum', 'dolor'].map((word) => word.length))`),
    h('h2', 'Media'),
    mediaBlock(media['dec-vt100'].id),
    p(paragraph(1, 10)),
    hr(),
    p(text(sentence(10, 11), ITALIC)),
  )

export const article = (at: number, media?: number): Post['content'] =>
  doc(
    p(paragraph(3, at)),
    h('h2', title(3, at + 1)),
    p(paragraph(3, at + 2)),
    ...(at % 2
      ? [
          code(
            'typescript',
            `export const ${words(1, at)} = (${words(1, at + 3)}: string) => ${words(1, at + 3)}.trim()`,
          ),
        ]
      : []),
    ...(media ? [mediaBlock(media)] : []),
    h('h2', title(2, at + 3)),
    p(paragraph(2, at + 4)),
    ...(at % 3 === 0 ? [banner('info', sentence(10, at + 6))] : []),
    p(paragraph(2, at + 5)),
  )
