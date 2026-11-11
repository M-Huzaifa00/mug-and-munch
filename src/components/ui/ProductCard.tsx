import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
import { CATEGORY_META, isPriced, type MenuItem } from '@/data/menu'
import { useAddToCart } from '@/hooks/useAddToCart'
import { defaultSelection, hasRequiredOptions, toCartInput } from '@/lib/itemOptions'
import { SPRING } from '@/lib/motion-presets'
import { modalStateFrom } from '@/lib/routing'
import { cn, formatPKR } from '@/lib/utils'
import { Badge } from './Badge'
import { PriceComingSoon } from './PriceComingSoon'
import { ProductImage } from './ProductImage'
import { TempChips } from './TempChips'

interface ProductCardProps {
  item: MenuItem
  variant?: 'default' | 'compact'
  className?: string
  /** Runs before navigating to the item (e.g. close the cart drawer). */
  onNavigate?: () => void
}

const STRETCHED_LINK =
  'after:absolute after:inset-0 after:z-0 after:rounded-[inherit] focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-3 focus-visible:after:outline-(--focus-ring)'

/**
 * Neo-brutalist sticker card. The whole card is a link to the item (modal from inside the site);
 * the round chili "+" quick-adds (or opens the modal when a size must be picked). No price yet → "Price coming soon", no "+".
 */
export function ProductCard({ item, variant = 'default', className, onNavigate }: ProductCardProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const addToCart = useAddToCart()
  const imageRef = useRef<HTMLDivElement>(null)
  const meta = CATEGORY_META[item.category]
  const to = `/menu/${item.slug}`
  const state = modalStateFrom(location)

  const priced = isPriced(item)
  // Hot / Cold / Blended right on the card (flavoured lattes): pick, then "+" adds that one. No modal needed.
  const temps = priced && variant === 'default' && (item.options.temps?.length ?? 0) > 1 ? item.options.temps : undefined
  const [temp, setTemp] = useState(() => item.options.temps?.[0]?.id)
  const onQuickAdd = () => {
    if (!isPriced(item)) return
    if (hasRequiredOptions(item)) {
      onNavigate?.()
      void navigate(to, { state })
      return
    }
    addToCart(toCartInput(item, temps ? { ...defaultSelection(item), temp } : undefined), { source: imageRef.current })
  }

  const addButton = priced && (
    <motion.button
      type="button"
      onClick={onQuickAdd}
      aria-label={`Add ${item.name} to cart`}
      whileTap={{ scale: 0.8, rotate: -15 }}
      transition={SPRING.bouncy}
      className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border-[2.5px] border-espresso bg-chili text-oat shadow-hard-sm transition-shadow hover:shadow-hard"
    >
      <Plus size={22} strokeWidth={3.2} aria-hidden="true" />
    </motion.button>
  )

  if (variant === 'compact') {
    return (
      <article data-cursor={priced ? 'add' : undefined} className={cn('relative flex w-60 shrink-0 items-center gap-3 rounded-2xl border-2 border-espresso bg-oat p-2 shadow-hard-sm', className)}>
        <div ref={imageRef} className="size-14 shrink-0 overflow-hidden rounded-xl border-2 border-espresso">
          <ProductImage name={item.name} emoji={item.emoji} image={item.image} category={item.category} size="sm" showName={false} />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-1 text-sm font-bold text-espresso">
            <Link to={to} state={state} onClick={onNavigate} className={STRETCHED_LINK}>
              {item.name}
            </Link>
          </h4>
          {priced ? <p className="font-display text-sm font-extrabold text-espresso">{formatPKR(item.price)}</p> : <PriceComingSoon className="mt-0.5" />}
        </div>
        {addButton}
      </article>
    )
  }

  return (
    <motion.article
      data-cursor={priced ? 'add' : undefined}
      whileHover={{ y: -6, rotate: -1.2 }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING.bouncy}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-blob border-[2.5px] border-espresso bg-oat shadow-hard transition-shadow duration-300',
        meta.glow,
        className,
      )}
    >
      <div ref={imageRef} data-fly-source className="relative aspect-[4/3] overflow-hidden border-b-[2.5px] border-espresso">
        <ProductImage name={item.name} emoji={item.emoji} image={item.image} category={item.category} />
      </div>

      {item.badges.length > 0 && (
        <div className="pointer-events-none absolute top-2.5 left-2.5 z-10 flex max-w-[85%] flex-wrap gap-1">
          {item.badges.slice(0, 2).map((b) => (
            <Badge key={b} kind={b} />
          ))}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-0.5 p-3 sm:p-4">
        <h3 className="line-clamp-1 font-display text-base leading-tight font-extrabold tracking-tight text-espresso sm:text-xl">
          <Link to={to} state={state} onClick={onNavigate} className={STRETCHED_LINK}>
            {item.name}
          </Link>
        </h3>
        <p className="line-clamp-1 text-xs text-ink/80 sm:text-sm">{item.description}</p>
        {temps && temp && <TempChips name={item.name} choices={temps} value={temp} onChange={setTemp} />}
        <div className="mt-auto flex min-h-13 items-center justify-between gap-2 pt-2">
          {priced ? <span className="font-display text-base font-extrabold text-espresso sm:text-lg">{formatPKR(item.price)}</span> : <PriceComingSoon />}
          {addButton}
        </div>
      </div>
    </motion.article>
  )
}
