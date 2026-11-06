import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocation } from 'react-router'
import { useLenis } from 'lenis/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { track } from '@/lib/events'
import { gsap, refreshScrollTriggersSoon, ScrollTrigger } from '@/lib/gsap'
import { EASE } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { BurgerMaker } from './BurgerMaker'
import { CraftSwitch, type CraftSwitchTab, type CraftTab } from './CraftSwitch'
import { MakerLoading } from './MakerLoading'

// Coffee + Wrap load only when their tab is first opened.
const CoffeeMaker = lazy(() => import('./CoffeeMaker').then((m) => ({ default: m.CoffeeMaker })))
const WrapMaker = lazy(() => import('./WrapMaker').then((m) => ({ default: m.WrapMaker })))

const TABS: (CraftSwitchTab & { word: string; wordClass: string; note: string; cta: string; glow: string })[] = [
  { id: 'coffee', label: 'Coffee', emoji: '☕', activeBg: 'bg-caramel', activeText: 'text-espresso', word: 'coffee', wordClass: 'text-caramel', note: 'study grind fuel ☕', cta: 'Add my coffee', glow: 'bg-caramel' },
  { id: 'burger', label: 'Burger', emoji: '🍔', activeBg: 'bg-chili', activeText: 'text-espresso', word: 'burger', wordClass: 'text-chili', note: 'garma garam, fresh off the grill 🔥', cta: 'Add my burger', glow: 'bg-chili' },
  { id: 'wrap', label: 'Wrap', emoji: '🌯', activeBg: 'bg-pickle', activeText: 'text-espresso', word: 'wrap', wordClass: 'text-pickle', note: 'wrapped fresh, eaten faster 🌯', cta: 'Add my wrap', glow: 'bg-pickle' },
]
export const CRAFT_ID = 'craft'
const tabFromHash = (hash: string): CraftTab | null => {
  const m = /^#craft-(coffee|burger|wrap)$/.exec(hash)
  return (m?.[1] as CraftTab | undefined) ?? null
}

/** ONE "Craft your own" section: Coffee / Burger / Wrap makers behind a switch. State is kept per tab. */
export function CraftSection() {
  const location = useLocation()
  const lenis = useLenis()
  const reduced = useReducedMotion()
  const [tab, setTab] = useState<CraftTab>(() => tabFromHash(window.location.hash) ?? 'burger')
  const [mounted, setMounted] = useState<Record<CraftTab, boolean>>(() => ({ coffee: tab === 'coffee', burger: true, wrap: tab === 'wrap' }))
  const root = useRef<HTMLElement>(null)
  const switching = useRef(false)
  const firstRender = useRef(true)
  const meta = TABS.find((t) => t.id === tab) ?? TABS[1]!

  useEffect(() => refreshScrollTriggersSoon(300), [])

  // Deep links: #craft-coffee | #craft-burger | #craft-wrap → open that tab (adjusted during render) …
  const [seenHash, setSeenHash] = useState(location.hash)
  if (location.hash !== seenHash) {
    setSeenHash(location.hash)
    const target = tabFromHash(location.hash)
    if (target) {
      setTab(target)
      setMounted((m) => ({ ...m, [target]: true }))
    }
  }

  // … and scroll the section into view.
  // ScrollTrigger refreshes after load (pin spacing above us changes our position), so re-aim after each
  // refresh for a short window, then stop.
  useEffect(() => {
    if (!tabFromHash(location.hash)) return
    const go = (immediate: boolean) => {
      const el = root.current
      if (!el) return
      if (lenis) lenis.scrollTo(el, { offset: -8, duration: 1.1, immediate: immediate || reduced })
      else el.scrollIntoView({ behavior: immediate || reduced ? 'auto' : 'smooth' })
    }
    const onRefresh = () => go(true)
    const first = window.setTimeout(() => go(false), 180)
    ScrollTrigger.addEventListener('refresh', onRefresh)
    const stop = window.setTimeout(() => ScrollTrigger.removeEventListener('refresh', onRefresh), 2500)
    return () => {
      window.clearTimeout(first)
      window.clearTimeout(stop)
      ScrollTrigger.removeEventListener('refresh', onRefresh)
    }
  }, [location.hash, lenis, reduced])

  const change = (next: CraftTab) => {
    if (next === tab || switching.current) return
    track('craft_tab_switch', { tab: next })
    setMounted((m) => ({ ...m, [next]: true }))
    window.history.replaceState(window.history.state, '', `#craft-${next}`)
    const el = root.current
    const out = el?.querySelector(`[data-maker="${tab}"] [data-creation]`)
    if (reduced || !el || !out) return setTab(next)
    switching.current = true
    gsap
      .timeline({
        onComplete: () => {
          gsap.set(out, { clearProps: 'x,opacity' })
          switching.current = false
          setTab(next)
        },
      })
      .to(out, { x: -90, opacity: 0, duration: 0.22, ease: 'power2.in' }, 0)
      .to(el.querySelector('[data-word]'), { yPercent: -110, duration: 0.22, ease: 'power2.in' }, 0)
  }

  // Incoming creation drops onto the plate; tiles + word slide/fade in.
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const el = root.current
    if (!el || reduced) return
    gsap.fromTo(el.querySelector('[data-word]'), { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: EASE.out })
    const creation = el.querySelector(`[data-maker="${tab}"] [data-creation]`)
    if (creation) gsap.fromTo(creation, { y: -140, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: EASE.bouncy })
    const controls = el.querySelector(`[data-maker="${tab}"] [data-controls]`)
    if (controls) gsap.fromTo(controls, { opacity: 0 }, { opacity: 1, duration: 0.35 })
    refreshScrollTriggersSoon(400)
  }, [tab, reduced])

  return (
    <section ref={root} id={CRAFT_ID} aria-labelledby="craft-title" className="grain relative overflow-hidden bg-espresso px-4 py-16 text-oat sm:px-6 md:py-24">
      {TABS.map((t) => (
        <span key={t.id} aria-hidden="true" className={cn('absolute top-1/3 left-1/4 -z-10 size-[28rem] rounded-full blur-3xl transition-opacity duration-500', t.glow, t.id === tab ? 'opacity-25' : 'opacity-0')} />
      ))}

      <div className="mx-auto max-w-6xl">
        <h2 id="craft-title" className="text-display font-extrabold text-oat">
          Craft your{' '}
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span data-word className={cn('inline-block', meta.wordClass)}>
              {meta.word}
            </span>
          </span>
        </h2>
        <div className="mt-1 h-9">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="-rotate-1 font-hand text-2xl text-cheese sm:text-3xl">
              {meta.note}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* grid-cols-1 = minmax(0,1fr): stops wide scroll trays from stretching the mobile column */}
        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 [grid-template-areas:'stage'_'switch'_'controls'] md:grid-cols-2 md:items-center md:[grid-template-areas:'switch_switch'_'stage_controls']">
          <div className="[grid-area:switch]">
            <CraftSwitch tabs={TABS} active={tab} onChange={change} />
          </div>
          <BurgerMaker active={tab === 'burger'} ctaLabel={TABS[1]!.cta} />
          {mounted.coffee && (
            <Suspense fallback={<MakerLoading show={tab === 'coffee'} />}>
              <CoffeeMaker active={tab === 'coffee'} ctaLabel={TABS[0]!.cta} />
            </Suspense>
          )}
          {mounted.wrap && (
            <Suspense fallback={<MakerLoading show={tab === 'wrap'} />}>
              <WrapMaker active={tab === 'wrap'} ctaLabel={TABS[2]!.cta} />
            </Suspense>
          )}
        </div>
      </div>
    </section>
  )
}
