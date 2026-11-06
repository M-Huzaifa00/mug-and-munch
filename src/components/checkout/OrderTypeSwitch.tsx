import { motion } from 'motion/react'
import type { OrderType } from '@/lib/orderTotals'
import { SPRING } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'

const OPTIONS: { id: OrderType; label: string; emoji: string }[] = [
  { id: 'delivery', label: 'Delivery', emoji: '🛵' },
  { id: 'takeaway', label: 'Takeaway', emoji: '🥡' },
  { id: 'dineIn', label: 'Dine-in', emoji: '🍽️' },
]

/** Delivery / Takeaway / Dine-in segmented control (radio semantics, sliding cheese pill). */
export function OrderTypeSwitch({ value, onChange }: { value: OrderType; onChange: (type: OrderType) => void }) {
  return (
    <div role="radiogroup" aria-label="How do you want it?" className="grid grid-cols-3 gap-1 rounded-full border-[2.5px] border-espresso bg-oat p-1 shadow-hard-sm">
      {OPTIONS.map((o) => {
        const active = o.id === value
        return (
          <label key={o.id} className="relative flex min-h-12 cursor-pointer items-center justify-center rounded-full px-1 text-center text-sm font-extrabold text-espresso sm:text-base has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cheese">
            <input type="radio" name="orderType" value={o.id} checked={active} onChange={() => onChange(o.id)} className="sr-only" />
            {active && <motion.span layoutId="order-type-pill" transition={SPRING.snappy} aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-espresso bg-cheese" />}
            <span className={cn('relative flex flex-col items-center gap-0.5 sm:flex-row sm:gap-1.5', !active && 'opacity-80')}>
              <span aria-hidden="true">{o.emoji}</span>
              {o.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}
