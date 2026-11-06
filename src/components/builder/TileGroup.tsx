import { Children, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TileGroupProps {
  label: string
  /** Visually hide the legend (e.g. when a tray tab already names the group). */
  hideLabel?: boolean
  children: ReactNode
  /** Note under the tiles (e.g. "max 3 sauces"). */
  note?: string
  className?: string
}

/**
 * A group of IngredientTiles: fieldset + legend (native radio inputs inside get arrow-key navigation).
 * Mobile: horizontal snap-scroll tray. md+: 3-column grid.
 */
export function TileGroup({ label, hideLabel, children, note, className }: TileGroupProps) {
  return (
    <fieldset className={cn('min-w-0', className)}>
      <legend className={cn('mb-2 text-xs font-extrabold tracking-widest uppercase', hideLabel && 'sr-only')}>{label}</legend>
      <div className="-mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pt-2 pb-3 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
        {Children.map(children, (child) => (
          <div className="w-[9.5rem] shrink-0 snap-start md:w-auto">{child}</div>
        ))}
      </div>
      {note && <p className="mt-1 text-xs font-semibold opacity-80">{note}</p>}
    </fieldset>
  )
}
