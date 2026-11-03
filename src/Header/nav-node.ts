// One entry of the menu and the prompt's command tree; `name` is the command word.
export type NavNode = {
  name: string
  label: string
  href: string
  newTab?: boolean
  children?: NavNode[]
}

// deepest level the menu and prompt go, the top bar is 1
export const NAV_DEPTH = 3

export const commandName = (label: string) =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.+-]+/g, '-')
    .replace(/^-+|-+$/g, '')

// two children can't answer to the same command; the first one wins
export const uniqueByName = (nodes: (NavNode | null)[]): NavNode[] => {
  const seen = new Set<string>()
  return nodes.filter((node): node is NavNode => {
    if (!node || seen.has(node.name)) return false
    seen.add(node.name)
    return true
  })
}
