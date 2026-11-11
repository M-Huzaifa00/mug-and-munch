import { site } from '@/config/site'
import { menuCategoryHref } from '@/components/menu/menuIds'
import { useRef } from 'react'
import { useNavigate } from 'react-router'
import { MUNCH_SIZE_CLASS, MUNCH_STOPS } from '@/data/munchRun'
import { track } from '@/lib/events'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { MunchCharacter } from './MunchCharacter'
import { MunchNote } from './MunchNote'
import { MunchPuffs } from './MunchPuffs'
import { MunchStatic } from './MunchStatic'
import { useMunchRun } from './useMunchRun'

/**
 * "Munch Run": a decorative snack (burger → wrap → coffee) that flies between three anchors on Home
 * as you scroll. aria-hidden + never focusable; the Craft tabs it links to are reachable normally.
 * Reduced motion: three static stickers parked in their sections instead.
 */
export function MunchRun() {
  const reduced = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const api = useMunchRun(root, (stopIndex) => {
    const stop = MUNCH_STOPS[stopIndex]
    if (!stop) return
    track('munch_run_tap', { form: stop.form })
    // Maker shown (play or order) → its Craft tab; switched off → that category on the menu instead.
    void navigate(site.craftMakers[stop.form] !== 'off' ? `/${stop.craftHash}` : menuCategoryHref(stop.form))
  })

  if (reduced) return <MunchStatic />

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[35] overflow-hidden">
      <MunchPuffs />
      <div data-mr="outer" className={cn('invisible absolute top-0 left-0', MUNCH_SIZE_CLASS)}>
        {MUNCH_STOPS.map((s) => (
          s.note ? <MunchNote key={s.stop} id={`note-${s.stop}`} text={s.note} side={s.noteSide} /> : null
        ))}
        <div data-mr="mid" className="size-full">
          <div data-mr="float" className="size-full">
            <div data-mr="act" className="relative size-full">
              <MunchCharacter form="burger" className="size-full" />
              <button
                type="button"
                data-mr="button"
                tabIndex={-1}
                data-cursor="view"
                data-cursor-label="Make one"
                onClick={() => api.current?.tap()}
                className="absolute inset-0 cursor-pointer rounded-full"
                style={{ pointerEvents: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
