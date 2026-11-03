import type { Post } from '@/payload-types'

// small Lexical builders: doc(h('h1', 'Title'), p('Body'))
type Doc = Post['content']
type Node = Doc['root']['children'][number]

const base = { direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 }

// Lexical text formats, combinable: bold | italic
export const BOLD = 1
export const ITALIC = 2
export const UNDERLINE = 8

export const text = (value: string, format = 0): Node => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text: value,
  version: 1,
})

export const link = (url: string, label: string): Node => ({
  ...base,
  type: 'link',
  children: [text(label)],
  fields: { linkType: 'custom', newTab: false, url },
  version: 2,
})

export const p = (...children: (Node | string)[]): Node => ({
  ...base,
  type: 'paragraph',
  children: children.map((child) => (typeof child === 'string' ? text(child) : child)),
  textFormat: 0,
})

export const h = (tag: 'h1' | 'h2' | 'h3' | 'h4', value: string): Node => ({
  ...base,
  type: 'heading',
  children: [text(value)],
  tag,
})

// Block nodes need a unique id; a counter keeps them stable between runs.
let blockCount = 0
const blockId = () => (++blockCount).toString(16).padStart(24, '0')

const block = (fields: Record<string, unknown>): Node => ({
  type: 'block',
  fields: { id: blockId(), blockName: '', ...fields },
  format: '',
  version: 2,
})

export const code = (language: 'css' | 'javascript' | 'typescript', source: string): Node =>
  block({ blockType: 'code', code: source, language })

export const banner = (
  style: 'error' | 'info' | 'success' | 'warning',
  ...children: (Node | string)[]
): Node => block({ blockType: 'banner', style, content: doc(p(...children)) })

export const mediaBlock = (media: number): Node => block({ blockType: 'mediaBlock', media })

export const hr = (): Node => ({ type: 'horizontalrule', version: 1 })

export const doc = (...children: Node[]): Doc => ({
  root: { ...base, type: 'root', children },
})
