import { useMemo } from 'react'
import { getUpsells } from '@/lib/recommendations'
import { useCart } from '@/store/cart'
import { ProductCard } from '@/components/ui/ProductCard'

/** "Goes great with…" horizontal row of compact cards (rules in lib/recommendations.ts). */
export function CartUpsell() {
  const items = useCart((s) => s.items)
  const closeCart = useCart((s) => s.closeCart)
  const picks = useMemo(() => getUpsells(items, 4), [items])

  if (picks.length === 0) return null

  return (
    <section aria-labelledby="upsell-title" className="pt-1">
      <h3 id="upsell-title" className="mb-2 font-hand text-2xl text-espresso">
        Goes great with…
      </h3>
      <ul className="-mx-4 flex gap-3 overflow-x-auto px-4 pt-1 pb-3 [scrollbar-width:none]">
        {picks.map((item) => (
          <li key={item.id}>
            <ProductCard item={item} variant="compact" onNavigate={closeCart} />
          </li>
        ))}
      </ul>
    </section>
  )
}
