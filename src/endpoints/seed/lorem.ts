// same `at` gives the same words, so the seed is stable
const WORDS = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut ' +
  'labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris ' +
  'nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse ' +
  'cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui ' +
  'officia deserunt mollit anim id est laborum'
).split(' ')

const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export const words = (count: number, at = 0): string =>
  Array.from({ length: count }, (_, i) => WORDS[(at * 7 + i * 3) % WORDS.length]).join(' ')

// A short title-case heading, no full stop.
export const title = (count = 3, at = 0): string => cap(words(count, at))

export const sentence = (count = 12, at = 0): string => `${cap(words(count, at))}.`

export const paragraph = (sentences = 3, at = 0): string =>
  Array.from({ length: sentences }, (_, i) => sentence(9 + ((at + i) % 6), at * 5 + i)).join(' ')

// A URL-safe slug from a title.
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
