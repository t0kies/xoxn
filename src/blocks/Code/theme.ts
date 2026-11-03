import type { PrismTheme } from 'prism-react-renderer'

// Syntax colors from the terminal's ANSI palette, so code follows the theme.
export const theme: PrismTheme = {
  plain: { color: 'var(--foreground0)', backgroundColor: 'transparent' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: 'var(--foreground2)' } },
    {
      types: ['keyword', 'selector', 'important', 'atrule'],
      style: { color: 'var(--ansi-magenta)' },
    },
    {
      types: ['string', 'char', 'attr-value', 'regex', 'inserted'],
      style: { color: 'var(--ansi-green)' },
    },
    { types: ['number', 'boolean', 'constant', 'symbol'], style: { color: 'var(--ansi-yellow)' } },
    {
      types: ['function', 'class-name', 'property', 'attr-name'],
      style: { color: 'var(--ansi-cyan)' },
    },
    { types: ['tag', 'deleted'], style: { color: 'var(--ansi-red)' } },
    { types: ['builtin', 'variable'], style: { color: 'var(--ansi-blue)' } },
    { types: ['punctuation', 'operator'], style: { color: 'var(--foreground1)' } },
  ],
}
