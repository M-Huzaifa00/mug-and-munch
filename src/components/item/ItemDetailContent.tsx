import { useEffect, useRef, useState } from 'react'
import { CATEGORY_META, type MenuItem } from '@/data/menu'
import { useAddToCart } from '@/hooks/useAddToCart'
import { defaultSelection, toCartInput, unitPriceFor, type OptionSelection } from '@/lib/itemOptions'
import { cn, formatPKR } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProductImage } from '@/components/ui/ProductImage'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { RollingNumber } from '@/components/ui/RollingNumber'
import { ItemOptionsForm } from './ItemOptionsForm'
import { StickyAddBar } from './StickyAddBar'

interface ItemDetailContentProps {
  item: MenuItem
  mode: 'page' | 'modal'
  /** Called after a successful add (modal closes itself). */
  onAdded?: () => void
}

/** Shared body for the item modal and the full item page: image, info, options, qty, add. */
export function ItemDetailContent({ item, mode, onAdded }: ItemDetailContentProps) {
  const [selection, setSelection] = useState<OptionSelection>(() => defaultSelection(item))
  const [qty, setQty] = useState(1)
  const [showSticky, setShowSticky] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const addToCart = useAddToCart()
  const meta = CATEGORY_META[item.category]
  const total = unitPriceFor(item, selection) * qty
  const Heading = mode === 'page' ? 'h1' : 'h2'

  // Sticky bar shows while the main button is out of view (IO root = viewport, clipped by the modal scroller).
  useEffect(() => {
    const el = addButtonRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setShowSticky(!(entry?.isIntersecting ?? true)))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const add = () => {
    addToCart(toCartInput(item, selection), { qty, source: imageRef.current })
    setQty(1)
    onAdded?.()
  }

  return (
    <>
      <div className={cn('grid gap-6 md:grid-cols-2 md:gap-8', mode === 'modal' ? 'p-4 pt-4 md:p-6' : '')}>
        <div className="relative">
          <div
            ref={imageRef}
            className={cn(
              'overflow-hidden rounded-blob border-[2.5px] border-espresso shadow-hard',
              mode === 'modal' ? 'aspect-[4/3] md:aspect-square' : 'aspect-square',
            )}
          >
            <ProductImage name={item.name} emoji={item.emoji} image={item.image} category={item.category} priority={mode === 'page'} />
          </div>
          {item.note && (
            <p className="sticker absolute -bottom-4 left-4 -rotate-3 rounded-full bg-oat px-4 py-1 font-hand text-xl text-ink">
              {item.note}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={cn('rounded-full border-2 border-espresso px-2.5 py-0.5 text-xs font-extrabold uppercase', meta.bg, meta.text)}>
              {meta.emoji} {meta.label}
            </span>
            {item.badges.map((b) => (
              <Badge key={b} kind={b} />
            ))}
          </div>
          <Heading id="item-title" className="pr-12 font-display text-4xl font-extrabold text-espresso md:text-5xl">
            {item.name}
          </Heading>
          <p className="text-lg text-ink">{item.description}</p>
          <p className="font-display text-2xl font-extrabold text-espresso">from {formatPKR(item.price)}</p>

          <ItemOptionsForm item={item} value={selection} onChange={setSelection} />

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <QuantityStepper value={qty} onChange={setQty} label={item.name} />
            <Button ref={addButtonRef} size="lg" onClick={add} className="flex-1 whitespace-nowrap">
              Add to cart · <RollingNumber value={total} format={formatPKR} />
            </Button>
          </div>
        </div>
      </div>

      <StickyAddBar visible={showSticky} name={item.name} total={total} onAdd={add} mode={mode} />
    </>
  )
}
