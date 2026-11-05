import { motion } from 'motion/react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { SPRING, TAP_SQUISH } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { RollingNumber } from './RollingNumber'

interface QuantityStepperProps {
  value: number
  onChange: (next: number) => void
  /** Item name for screen-reader labels. */
  label: string
  min?: number
  max?: number
  size?: 'sm' | 'md'
  className?: string
}

/** − qty + with squish feedback. At `min` 0 the minus becomes a trash icon. */
export function QuantityStepper({ value, onChange, label, min = 1, max = 20, size = 'md', className }: QuantityStepperProps) {
  const btn = cn(
    'flex items-center justify-center rounded-full text-espresso transition-colors hover:bg-espresso/10 disabled:opacity-35',
    size === 'sm' ? 'size-11' : 'size-12',
  )
  const removing = min === 0 && value <= 1

  return (
    <div
      role="group"
      aria-label={`Quantity for ${label}`}
      className={cn('inline-flex items-center rounded-full border-[2.5px] border-espresso bg-oat', className)}
    >
      <motion.button
        type="button"
        whileTap={TAP_SQUISH}
        transition={SPRING.bouncy}
        className={btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={removing ? `Remove ${label}` : `Decrease ${label}`}
      >
        {removing ? <Trash2 size={18} aria-hidden="true" /> : <Minus size={18} strokeWidth={3} aria-hidden="true" />}
      </motion.button>
      <span className={cn('min-w-6 text-center font-display font-extrabold text-espresso', size === 'sm' ? 'text-base' : 'text-lg')}>
        <RollingNumber value={value} />
      </span>
      <motion.button
        type="button"
        whileTap={TAP_SQUISH}
        transition={SPRING.bouncy}
        className={btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
      >
        <Plus size={18} strokeWidth={3} aria-hidden="true" />
      </motion.button>
    </div>
  )
}
