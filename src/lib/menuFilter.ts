import { getItemsByCategory, menu, type Category, type MenuItem } from '@/data/menu'

export type MenuFilter = 'veg' | 'spicy' | 'bestseller'

export const FILTER_LABELS: Record<MenuFilter, string> = {
  veg: '🌱 Veg',
  spicy: '🌶️ Spicy',
  bestseller: '⭐ Bestseller',
}

const matchesFilter = (item: MenuItem, f: MenuFilter): boolean =>
  f === 'veg' ? item.isVeg : item.badges.includes(f)

/** Search name/description (case-insensitive) + every active filter must match. */
export function filterMenu(query: string, filters: ReadonlySet<MenuFilter>, items: MenuItem[] = menu): MenuItem[] {
  const q = query.trim().toLowerCase()
  return items.filter(
    (item) =>
      (!q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)) &&
      [...filters].every((f) => matchesFilter(item, f)),
  )
}

/** Home preview: bestsellers first, then the rest, capped. */
export function getPreviewItems(category: Category, limit = 6): MenuItem[] {
  const items = getItemsByCategory(category)
  const best = items.filter((i) => i.badges.includes('bestseller'))
  const rest = items.filter((i) => !i.badges.includes('bestseller'))
  return [...best, ...rest].slice(0, limit)
}
