import type { OptionChoice } from '@/data/menu'
import { cn } from '@/lib/utils'

/**
 * Small Hot / Cold / Blended switch on a product card. Sits above the card's stretched link (z-10); each chip's
 * hit area is padded out to ~44px with an invisible ::after. Same price for every choice (owner rule), so no prices here.
 */
export function TempChips({ name, choices, value, onChange }: { name: string; choices: OptionChoice[]; value: string; onChange: (id: string) => void }) {
  return (
    <div role="radiogroup" aria-label={`${name}: temperature`} className="relative z-10 mt-2 flex w-fit gap-1 rounded-full border-2 border-espresso/15 bg-oat p-0.5">
      {choices.map((c) => {
        const on = c.id === value
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(c.id)}
            className={cn(
              'relative rounded-full px-2.5 py-1 text-[0.7rem] font-bold transition-colors after:absolute after:-inset-y-2 after:-inset-x-0.5 sm:text-xs',
              on ? 'bg-espresso text-oat' : 'text-ink/75 hover:text-espresso',
            )}
          >
            {c.label}
          </button>
        )
      })}
    </div>
  )
}
