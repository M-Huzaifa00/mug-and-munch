import { useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { CATEGORY_META, CATEGORY_ORDER, type Category } from '@/data/menu'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useScrollState } from '@/hooks/useScrollState'
import { cn } from '@/lib/utils'
import { Chip } from '@/components/ui/Chip'
import { JUMP_OFFSET, MENU_TOP_ID, sectionId } from './menuIds'

type NavKey = 'all' | Category

/** Section is "current" once its top passes this line (px from viewport top). */
const SPY_LINE = 200

/**
 * Sticky chip bar: All + every category. Horizontally scrollable on mobile,
 * scroll-spies the category sections, sits under the navbar when it's visible.
 */
export function CategoryNav({ counts, className }: { counts: Record<Category, number>; className?: string }) {
  const [active, setActive] = useState<NavKey>('all')
  const { hidden } = useScrollState()
  const lenis = useLenis()
  const reduced = useReducedMotion()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const chipRefs = useRef(new Map<NavKey, HTMLButtonElement>())

  // Scroll-spy (rAF-throttled window scroll; Lenis scrolls the window too).
  useEffect(() => {
    let ticking = false
    const update = () => {
      ticking = false
      let current: NavKey = 'all'
      for (const c of CATEGORY_ORDER) {
        const el = document.getElementById(sectionId(c))
        if (el && el.getBoundingClientRect().top <= SPY_LINE) current = c
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Keep the active chip centred in the horizontal scroller.
  useEffect(() => {
    const scroller = scrollerRef.current
    const chip = chipRefs.current.get(active)
    if (!scroller || !chip) return
    const left = chip.offsetLeft - scroller.clientWidth / 2 + chip.offsetWidth / 2
    scroller.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' })
  }, [active, reduced])

  const jump = (key: NavKey) => {
    const el = document.getElementById(key === 'all' ? MENU_TOP_ID : sectionId(key))
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: JUMP_OFFSET, duration: 1.1 })
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + JUMP_OFFSET, behavior: reduced ? 'auto' : 'smooth' })
  }

  const keys: NavKey[] = ['all', ...CATEGORY_ORDER]

  return (
    <nav
      aria-label="Menu categories"
      className={cn('sticky z-30 -mx-4 px-2 transition-[top] duration-500 ease-snappy sm:mx-0 sm:px-0', className)}
      style={{ top: hidden ? 8 : 86 }}
    >
      <div
        ref={scrollerRef}
        data-lenis-prevent-wheel
        className="glass flex gap-2 overflow-x-auto rounded-full border-[2.5px] border-espresso p-1.5 shadow-hard [scrollbar-width:none]"
      >
        {keys.map((key) => {
          const isAll = key === 'all'
          const meta = isAll ? null : CATEGORY_META[key]
          const empty = !isAll && counts[key] === 0
          return (
            <Chip
              key={key}
              ref={(el) => {
                if (el) chipRefs.current.set(key, el)
                else chipRefs.current.delete(key)
              }}
              active={active === key}
              aria-pressed={undefined}
              aria-current={active === key ? 'true' : undefined}
              activeBg={meta?.bg ?? 'bg-espresso'}
              activeText={meta?.text ?? 'text-oat'}
              layoutId="menu-category-pill"
              disabled={empty}
              onClick={() => jump(key)}
              className="disabled:opacity-40"
            >
              {meta ? (
                <>
                  <span aria-hidden="true">{meta.emoji}</span> {meta.label}
                </>
              ) : (
                'All'
              )}
            </Chip>
          )
        })}
      </div>
    </nav>
  )
}
