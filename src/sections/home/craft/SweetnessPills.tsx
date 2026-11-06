import { SWEETNESS_LEVELS } from '@/data/menu'
import { BRAND_INK } from '@/lib/brand'
import { cn } from '@/lib/utils'

/** Tiny face: the mouth curves up as sweetness goes up. */
function face(level: number) {
  const curve = (level / 100) * 7 - 2 // -2 (meh) → 5 (big smile)
  return (
    <svg viewBox="0 0 20 20" className="size-5" style={{ color: BRAND_INK }} aria-hidden="true">
      <circle cx="10" cy="10" r="8.5" className="fill-cheese" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="7" cy="8" r="1.2" fill="currentColor" />
      <circle cx="13" cy="8" r="1.2" fill="currentColor" />
      <path d={`M6 12.5q4 ${curve} 8 0`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

/** Sweetness 0–100% as a radio group of 5 small pills (native radios → arrow keys). */
export function SweetnessPills({ value, onChange, name }: { value: number; onChange: (v: number) => void; name: string }) {
  return (
    <fieldset>
      <legend className="sr-only">Sweetness</legend>
      <div className="flex flex-wrap gap-2 pt-1">
        {SWEETNESS_LEVELS.map((level) => (
          <label key={level} className="relative cursor-pointer">
            <input type="radio" name={name} value={level} checked={value === level} onChange={() => onChange(level)} className="peer sr-only" />
            <span
              className={cn(
                'flex min-h-11 items-center gap-1.5 rounded-full border-[2.5px] border-oat px-3 font-bold text-espresso shadow-hard-oat transition-colors',
                'peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--focus-ring)',
                value === level ? 'bg-cheese' : 'bg-oat',
              )}
            >
              {face(level)}
              {level}%
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
