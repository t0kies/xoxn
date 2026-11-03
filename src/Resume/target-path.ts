// /resume/<slug>--<key>: random key so targets can't be guessed; slugs never contain --
export const KEY_SEPARATOR = '--'

export const targetPath = (target: { key?: null | string; slug?: null | string }): null | string =>
  target.slug && target.key ? `${target.slug}${KEY_SEPARATOR}${target.key}` : null
