import { motion } from 'motion/react'
import type { BuilderIngredient } from '@/data/toys'
import { canAdd, countOf } from '@/lib/builder'
import { SPRING, TAP_SQUISH } from '@/lib/motion-presets'
import { cn, formatPKR } from '@/lib/utils'

interface IngredientPickerProps<Id extends string> {
  ingredients: readonly BuilderIngredient<Id>[]
  picks: readonly Id[]
  maxTotal: number
  onAdd: (id: Id) => void
  /** Locks every button (e.g. burger closed, wrap rolled). */
  locked?: boolean
  /** Background the picker sits on: 'dark' (espresso) or 'light' (oat/pickle/cheese). */
  tone?: 'dark' | 'light'
  /** Ids rendered as the highlighted "finish" button (e.g. the top bun). */
  accent?: Id[]
  className?: string
}

/** Tappable ingredient grid shared by Build Your Burger and Wrap It Up (emoji, name, +price, count badge). */
export function IngredientPicker<Id extends string>({
  ingredients,
  picks,
  maxTotal,
  onAdd,
  locked = false,
  tone = 'dark',
  accent = [],
  className,
}: IngredientPickerProps<Id>) {
  return (
    <div role="group" aria-label="Ingredients" className={cn('grid grid-cols-2 gap-2.5 sm:grid-cols-3', className)}>
      {ingredients.map((ing) => {
        const n = countOf(picks, ing.id)
        const disabled = locked || !canAdd(ingredients, picks, ing.id, maxTotal)
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
              'relative flex min-h-14 items-center gap-2 rounded-2xl border-[2.5px] px-3 py-2 text-left text-espresso',
              'transition-[opacity,translate] enabled:hover:-translate-y-0.5 disabled:opacity-40',
              tone === 'dark' ? 'border-oat shadow-hard-oat' : 'border-espresso shadow-hard-sm',
              accent.includes(ing.id) ? 'bg-cheese' : 'bg-oat',
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
