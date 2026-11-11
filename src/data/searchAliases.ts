import type { MenuItem } from './menu'

/**
 * Local words people actually type (Roman Urdu + slang + common misspellings) → which menu items they mean.
 * Used by the menu search on top of the normal name / description match. Keys are matched as word prefixes
 * (typing "thand" already finds the cold drinks). Edit freely; nothing here is shown to customers.
 */
interface Alias {
  words: string[]
  match: (item: MenuItem) => boolean
}

const hasTemp = (item: MenuItem, id: string) => item.options.temps?.some((t) => t.id === id) ?? false

export const SEARCH_ALIASES: Alias[] = [
  { words: ['chai', 'chae', 'chaye', 'chay', 'tea'], match: (i) => /tea|chai/i.test(i.name) },
  { words: ['thanda', 'thandi', 'thanday', 'cold', 'iced', 'ice', 'chilled'], match: (i) => i.category === 'drinks' || i.category === 'matcha' || hasTemp(i, 'cold') },
  { words: ['garam', 'hot'], match: (i) => i.category === 'coffee' || /chai|green tea/i.test(i.name) },
  { words: ['meetha', 'meethi', 'sweet', 'dessert'], match: (i) => /spanish|tiramisu|vanilla|caramel|mocha|hazelnut|strawberry/i.test(i.name) },
  { words: ['teekha', 'teekhi', 'tikha', 'mirchi', 'spicy', 'hot sauce'], match: (i) => i.badges.includes('spicy') },
  { words: ['kofi', 'kafi', 'kaafi', 'cofee', 'coffe', 'coffee'], match: (i) => i.category === 'coffee' },
  { words: ['burger', 'burgur', 'barger', 'zinger', 'smash'], match: (i) => i.category === 'burger' },
  { words: ['roll', 'wrap', 'shawarma'], match: (i) => i.category === 'wrap' },
  { words: ['fries', 'chips', 'aloo'], match: (i) => /fries/i.test(i.name) },
  { words: ['khana', 'bhook', 'food', 'pait'], match: (i) => ['burger', 'wrap', 'starters', 'steak'].includes(i.category) },
]

/** True when the query (lower-case, trimmed) is a prefix of an alias word (min 3 letters) and the item matches it. */
export function matchesAlias(query: string, item: MenuItem): boolean {
  if (query.length < 3) return false
  return SEARCH_ALIASES.some((a) => a.words.some((w) => w.startsWith(query)) && a.match(item))
}
