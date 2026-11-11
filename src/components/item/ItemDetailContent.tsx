import { useEffect, useRef, useState } from 'react'
import { Phone } from 'lucide-react'
import { site } from '@/config/site'
import { isPriced, type MenuItem, type PricedItem } from '@/data/menu'
import { useAddToCart } from '@/hooks/useAddToCart'
import { defaultSelection, toCartInput, unitPriceFor, type OptionSelection } from '@/lib/itemOptions'
import { formatPKR } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { buttonClasses } from '@/components/ui/buttonClasses'
import { PriceComingSoon } from '@/components/ui/PriceComingSoon'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { RollingNumber } from '@/components/ui/RollingNumber'
import { ItemIntro } from './ItemIntro'
import { ItemOptionsForm } from './ItemOptionsForm'
import { StickyAddBar } from './StickyAddBar'

interface ItemDetailContentProps {
  item: MenuItem
  mode: 'page' | 'modal'
  /** Called after a successful add (modal closes itself). */
  onAdded?: () => void
}

/** Shared body for the item modal and the full item page. Items without a price yet can't be ordered online. */
export function ItemDetailContent({ item, mode, onAdded }: ItemDetailContentProps) {
  if (isPriced(item)) return <OrderableItem item={item} mode={mode} onAdded={onAdded} />
  return (
    <ItemIntro item={item} mode={mode}>
      <PriceComingSoon className="self-start px-3 py-1 text-sm" />
      <p className="text-ink">We're finalising this one's price. It's on the menu at the café; give us a call and we'll sort you out.</p>
      <a href={site.contact.phoneHref} className={buttonClasses('outline', 'md', 'self-start')}>
        <Phone size={18} strokeWidth={2.6} aria-hidden="true" /> Call {site.contact.phoneDisplay}
      </a>
    </ItemIntro>
  )
}

function OrderableItem({ item, mode, onAdded }: ItemDetailContentProps & { item: PricedItem }) {
  const [selection, setSelection] = useState<OptionSelection>(() => defaultSelection(item))
  const [qty, setQty] = useState(1)
  const [showSticky, setShowSticky] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const addToCart = useAddToCart()
  const total = unitPriceFor(item, selection) * qty
  // "from" only when some choice actually costs more (Hot / Cold / Blended are the same price).
  const o = item.options
  const pricesVary = [o.sizes, o.temps, o.milks, o.extras].some((g) => g?.some((c) => c.priceDelta > 0))

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
      <ItemIntro item={item} mode={mode} imageRef={imageRef}>
        <p className="font-display text-2xl font-extrabold text-espresso">
          {pricesVary ? 'from ' : ''}
          {formatPKR(item.price)}
        </p>
        <ItemOptionsForm item={item} value={selection} onChange={setSelection} />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <QuantityStepper value={qty} onChange={setQty} label={item.name} />
          <Button ref={addButtonRef} size="lg" onClick={add} className="flex-1 whitespace-nowrap">
            Add to cart · <RollingNumber value={total} format={formatPKR} />
          </Button>
        </div>
      </ItemIntro>
      <StickyAddBar visible={showSticky} name={item.name} total={total} onAdd={add} mode={mode} />
    </>
  )
}
