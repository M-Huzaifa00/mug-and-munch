import { site } from '@/config/site'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { LayoutGroup } from 'motion/react'
import { CATEGORY_ORDER, menu, type Category } from '@/data/menu'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { FILTER_LABELS, filterMenu, type MenuFilter } from '@/lib/menuFilter'
import { Chip } from '@/components/ui/Chip'
import { Seo } from '@/components/layout/Seo'
import { CategoryNav } from '@/components/menu/CategoryNav'
import { MENU_TOP_ID } from '@/components/menu/menuIds'
import { MenuEmpty } from '@/components/menu/MenuEmpty'
import { MenuSearch } from '@/components/menu/MenuSearch'
import { MenuSection } from '@/components/menu/MenuSection'

const FILTERS: MenuFilter[] = ['orderable', 'spicy', 'picks']

export function Menu() {
  // ?q= (e.g. from the 404 search) pre-fills the search box.
  const [params] = useSearchParams()
  const [query, setQuery] = useState(() => (params.get('q') ?? '').slice(0, 60))
  const [filters, setFilters] = useState<ReadonlySet<MenuFilter>>(new Set())
  const debouncedQuery = useDebouncedValue(query, 300)

  const results = useMemo(() => filterMenu(debouncedQuery, filters), [debouncedQuery, filters])
  const grouped = useMemo(
    () => CATEGORY_ORDER.map((c) => ({ category: c, items: results.filter((i) => i.category === c) })),
    [results],
  )
  const counts = useMemo(
    () => Object.fromEntries(grouped.map((g) => [g.category, g.items.length])) as Record<Category, number>,
    [grouped],
  )

  const toggleFilter = (f: MenuFilter) =>
    setFilters((prev) => {
      const next = new Set(prev)
      if (next.has(f)) next.delete(f)
      else next.add(f)
      return next
    })

  const reset = () => {
    setQuery('')
    setFilters(new Set())
  }

  return (
    <>
      <Seo title="Menu" description={`Coffee, smash burgers, wraps, sides, drinks and desserts at ${site.brandName} Islamabad.`} path="/menu" />
      <div className="grain bg-oat px-4 pt-28 pb-24 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="font-hand text-3xl text-ink">pick your poison</p>
          <h1 className="text-display font-extrabold text-espresso">The Menu 📜</h1>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
            <MenuSearch value={query} onChange={setQuery} />
            <div role="group" aria-label="Filters" className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <Chip key={f} active={filters.has(f)} activeBg="bg-cheese" activeText="text-espresso" onClick={() => toggleFilter(f)}>
                  {FILTER_LABELS[f]}
                </Chip>
              ))}
            </div>
          </div>
          <p aria-live="polite" className="mt-3 text-sm font-semibold text-ink/80">
            Showing {results.length} of {menu.length} items
          </p>

          {/* Direct child of the tall container so `sticky` spans the whole menu. */}
          <CategoryNav counts={counts} className="mt-4" />

          <div id={MENU_TOP_ID} className="mt-8 scroll-mt-40">
            {results.length === 0 ? (
              <MenuEmpty query={debouncedQuery} onReset={reset} />
            ) : (
              <LayoutGroup>
                <div className="space-y-14">
                  {grouped.map(({ category, items }) =>
                    items.length > 0 ? <MenuSection key={category} category={category} items={items} /> : null,
                  )}
                </div>
              </LayoutGroup>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
