import { motion } from 'motion/react'
import { Trash2 } from 'lucide-react'
import { useIsTouch } from '@/hooks/useIsTouch'
import { SPRING } from '@/lib/motion-presets'
import { formatPKR } from '@/lib/utils'
import type { CartItem } from '@/store/cart'
import { ProductImage } from '@/components/ui/ProductImage'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { RollingNumber } from '@/components/ui/RollingNumber'

interface CartLineItemProps {
  item: CartItem
  onQty: (qty: number) => void
  onRemove: () => void
}

const SWIPE_DISTANCE = -110

/** One cart line: option chips, stepper, trash button; swipe left to remove on touch devices. */
export function CartLineItem({ item, onQty, onRemove }: CartLineItemProps) {
  const isTouch = useIsTouch()

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -120, transition: { duration: 0.2 } }}
      transition={SPRING.soft}
      className="relative"
    >
      {isTouch && (
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-end gap-2 rounded-2xl bg-chili pr-5 font-bold text-espresso">
          <Trash2 size={18} /> Remove
        </div>
      )}
      <motion.div
        drag={isTouch ? 'x' : false}
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.7, right: 0 }}
        dragSnapToOrigin
        onDragEnd={(_, info) => {
          if (info.offset.x < SWIPE_DISTANCE || info.velocity.x < -700) onRemove()
        }}
        className="relative flex gap-3 rounded-2xl border-2 border-espresso bg-oat p-2.5"
      >
        <div className="size-16 shrink-0 overflow-hidden rounded-xl border-2 border-espresso">
          <ProductImage name={item.name} emoji={item.emoji} image={item.image} category={item.category} size="sm" showName={false} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-display text-base leading-tight font-extrabold text-espresso">{item.name}</h3>
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${item.name} from cart`}
              className="-mt-1 -mr-1 flex size-11 shrink-0 items-center justify-center rounded-full text-espresso/70 transition-colors hover:bg-chili/15 hover:text-espresso"
            >
              <Trash2 size={18} aria-hidden="true" />
            </button>
          </div>
          {item.optionLabels.length > 0 && (
            <ul className="mt-1 flex flex-wrap gap-1" aria-label="Options">
              {item.optionLabels.map((label) => (
                <li key={label} className="rounded-full bg-cheese/50 px-2 py-0.5 text-[0.6875rem] font-semibold text-espresso">
                  {label}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-2 flex items-center justify-between gap-2">
            <QuantityStepper value={item.qty} onChange={onQty} label={item.name} min={0} size="sm" />
            <span className="font-display text-base font-extrabold text-espresso">
              <RollingNumber value={item.unitPrice * item.qty} format={formatPKR} />
            </span>
          </div>
        </div>
      </motion.div>
    </motion.li>
  )
}
