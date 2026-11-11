import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MenuSearchProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

/** Controlled search input (debounce happens in the page). */
export function MenuSearch({ value, onChange, className }: MenuSearchProps) {
  return (
    <div className={cn('relative w-full md:max-w-md', className)}>
      <label htmlFor="menu-search" className="sr-only">
        Search the menu
      </label>
      <Search size={20} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-espresso" />
      <input
        id="menu-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search lattes, zinger, smash…"
        autoComplete="off"
        enterKeyHint="search"
        className="min-h-12 w-full rounded-full border-[2.5px] border-espresso bg-oat pr-12 pl-11 font-semibold text-espresso shadow-hard-sm placeholder:text-ink/60 focus-visible:shadow-hard [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute top-1/2 right-1 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-espresso hover:bg-espresso/10"
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
