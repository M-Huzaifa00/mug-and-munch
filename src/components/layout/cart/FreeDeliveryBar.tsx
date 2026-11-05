import { motion } from 'motion/react'
import { site } from '@/config/site'
import { SPRING } from '@/lib/motion-presets'
import { cn, formatPKR } from '@/lib/utils'
import { useAmountToFreeDelivery, useCartSubtotal } from '@/store/cart'

/** "Rs X away from free delivery 🛵" → fills up → "Free delivery unlocked 🎉". */
export function FreeDeliveryBar() {
  const subtotal = useCartSubtotal()
  const remaining = useAmountToFreeDelivery()
  const threshold = site.commerce.freeDeliveryThreshold
  const progress = Math.min(1, subtotal / threshold)
  const unlocked = remaining === 0

  return (
    <div className={cn('rounded-2xl border-2 border-espresso p-3', unlocked ? 'bg-pickle' : 'bg-cheese/45')}>
      <p role="status" aria-live="polite" className="text-sm font-bold text-espresso">
        {unlocked ? 'Free delivery unlocked 🎉' : `${formatPKR(remaining)} away from free delivery 🛵`}
      </p>
      <div
        className="mt-2 h-3 overflow-hidden rounded-full border-2 border-espresso bg-oat"
        role="progressbar"
        aria-label="Progress to free delivery"
        aria-valuemin={0}
        aria-valuemax={threshold}
        aria-valuenow={Math.min(subtotal, threshold)}
      >
        <motion.div
          className={cn('h-full origin-left', unlocked ? 'bg-espresso' : 'bg-chili')}
          initial={false}
          animate={{ scaleX: progress }}
          transition={SPRING.soft}
        />
      </div>
    </div>
  )
}
