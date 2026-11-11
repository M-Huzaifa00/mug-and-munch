import { getItemsByCategory, isPriced, menu, type Category, type MenuItem } from '@/data/menu'

export type MenuFilter = 'orderable' | 'spicy' | 'picks'

export const FILTER_LABELS: Record<MenuFilter, string> = {
  orderable: '🛒 Order online',
  spicy: '🌶️ Spicy',
  picks: '⭐ Our picks',
}

const matchesFilter = (item: MenuItem, f: MenuFilter): boolean =>
  f === 'orderable' ? isPriced(item) : f === 'picks' ? Boolean(item.featured) : item.badges.includes('spicy')

/** Search name/description (case-insensitive) + every active filter must match. */
export function filterMenu(query: string, filters: ReadonlySet<MenuFilter>, items: MenuItem[] = menu): MenuItem[] {
  const q = query.trim().toLowerCase()
  return items.filter(
    (item) =>
      (!q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)) &&
      [...filters].every((f) => matchesFilter(item, f)),
  )
}

/** Home preview: our picks first, then items you can order now, then the rest; capped. Stable within each group. */
export function getPreviewItems(category: Category, limit = 6): MenuItem[] {
  const rank = (i: MenuItem) => (i.featured ? 0 : isPriced(i) ? 1 : 2)
  return [...getItemsByCategory(category)].sort((a, b) => rank(a) - rank(b)).slice(0, limit)
}
