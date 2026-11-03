const inks = ['cyan', 'magenta', 'yellow', 'green', 'blue', 'red'] as const

export type CategoryInk = (typeof inks)[number]

// a category always gets the same hue (hash of the title)
export const categoryInk = (title?: string | null): CategoryInk => {
  const hash = (title || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return inks[hash % inks.length]
}
