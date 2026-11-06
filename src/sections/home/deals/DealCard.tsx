import { useRef } from 'react'
import { motion } from 'motion/react'
import { getItemById } from '@/data/menu'
import { getDealOriginalPrice, getDealSavings, type Deal } from '@/data/deals'
import { useAddToCart } from '@/hooks/useAddToCart'
import { SPRING } from '@/lib/motion-presets'
import { cn, formatPKR } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ProductImage } from '@/components/ui/ProductImage'

/** Combo card: real computed savings, one cart line on "Add deal". Tilts on hover. */
export function DealCard({ deal, index }: { deal: Deal; index: number }) {
  const addToCart = useAddToCart()
  const art = useRef<HTMLDivElement>(null)
  const original = getDealOriginalPrice(deal)
  const savings = getDealSavings(deal)
  const lines = deal.items.map((l) => `${l.qty}× ${getItemById(l.itemId)?.name ?? l.itemId}`)

  const add = () =>
    addToCart(
      {
        itemId: deal.id,
        slug: deal.slug,
        name: deal.name,
        image: `/images/deals/${deal.slug}.webp`,
        emoji: deal.emoji,
        category: 'deal',
        unitPrice: deal.price,
        options: {},
        optionLabels: lines,
      },
      { source: art.current },
    )

  return (
    <motion.article
      whileHover={{ rotate: index % 2 ? 2 : -2, y: -8 }}
      transition={SPRING.bouncy}
      className="sticker relative flex h-full flex-col rounded-blob bg-oat p-4 sm:p-5"
    >
      {savings > 0 && (
        <span className="sticker absolute -top-4 -right-3 z-10 rotate-6 rounded-full bg-chili px-3 py-1 font-display text-sm font-extrabold text-espresso">
          Save {formatPKR(savings)}
        </span>
      )}
      <div ref={art} className="aspect-[16/10] overflow-hidden rounded-2xl border-2 border-espresso">
        <ProductImage name={deal.name} emoji={deal.emoji} image={`/images/deals/${deal.slug}.webp`} category="deal" showName={false} />
      </div>
      <h3 className="mt-4 font-display text-2xl font-extrabold text-espresso">{deal.name}</h3>
      <p className="font-hand text-xl text-ink">{deal.tagline}</p>
      <ul className="mt-3 space-y-0.5 text-sm text-ink">
        {lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      {deal.availability && <p className="mt-2 text-xs font-semibold text-ink/80">{deal.availability}</p>}
      <div className="mt-auto flex items-end justify-between gap-2 pt-4">
        <p>
          <s className="block text-sm text-ink/70">{formatPKR(original)}</s>
          <span className={cn('font-display text-2xl font-extrabold text-espresso')}>{formatPKR(deal.price)}</span>
        </p>
        <Button size="sm" onClick={add} aria-label={`Add ${deal.name} to cart`}>
          Add deal
        </Button>
      </div>
    </motion.article>
  )
}
