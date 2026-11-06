import { motion } from 'motion/react'
import { BURGER_BUILDER, type BurgerLayerId } from '@/data/toys'
import { countOf } from '@/lib/burgerBuilder'
import { SPRING, TAP_SQUISH } from '@/lib/motion-presets'
import { cn, formatPKR } from '@/lib/utils'

interface BurgerControlsProps {
  layers: BurgerLayerId[]
  onAdd: (id: BurgerLayerId) => void
}

/** Ingredient buttons: emoji, name, price, count. Disabled at the per-ingredient max or once the top bun is on. */
export function BurgerControls({ layers, onAdd }: BurgerControlsProps) {
  const closed = layers.includes('bun')
  const full = layers.length >= BURGER_BUILDER.maxLayers

  return (
    <div role="group" aria-label="Ingredients" className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {BURGER_BUILDER.ingredients.map((ing) => {
        const n = countOf(layers, ing.id)
        const disabled = closed || full || n >= ing.max
        return (
          <motion.button
            key={ing.id}
            type="button"
            whileTap={disabled ? undefined : TAP_SQUISH}
            transition={SPRING.bouncy}
            disabled={disabled}
            onClick={() => onAdd(ing.id)}
            aria-label={`Add ${ing.label}${ing.price ? `, plus ${formatPKR(ing.price)}` : ''}${n ? `, ${n} added` : ''}`}
            className={cn(
              'relative flex min-h-14 items-center gap-2 rounded-2xl border-[2.5px] border-oat bg-oat px-3 py-2 text-left text-espresso',
              'shadow-hard-oat transition-[opacity,translate] disabled:opacity-40 enabled:hover:-translate-y-0.5',
              ing.id === 'bun' && 'bg-cheese',
            )}
          >
            <span className="text-2xl" aria-hidden="true">
              {ing.emoji}
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold">{ing.label}</span>
              <span className="block text-xs font-semibold text-ink/80">{ing.price ? `+${formatPKR(ing.price)}` : 'included'}</span>
            </span>
            {n > 0 && (
              <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border-2 border-espresso bg-chili text-xs font-extrabold text-espresso">
                {n}
              </span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
