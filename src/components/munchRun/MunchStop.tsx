import { MUNCH_SIZE_CLASS, MUNCH_STOPS, type MunchStopId } from '@/data/munchRun'
import { cn } from '@/lib/utils'

/**
 * Invisible anchor where the Munch Run traveler parks (source of truth for its position). Lives in the
 * section, so it scrolls and pins with it. Offsets per breakpoint: data/munchRun.ts. Tiny: stays in the Home chunk.
 */
export function MunchStop({ stop }: { stop: MunchStopId }) {
  const cfg = MUNCH_STOPS.find((s) => s.stop === stop)
  if (!cfg) return null
  return <span data-munch-stop={stop} aria-hidden="true" className={cn('pointer-events-none absolute z-10 block', MUNCH_SIZE_CLASS, cfg.anchorClass)} />
}
