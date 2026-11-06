import { useEffect, useLayoutEffect, useRef } from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router'
import { gsap } from '@/lib/gsap'
import { EASE, SCENE } from '@/lib/motion-presets'
import { getBackgroundLocation, getModalSlug, ITEM_PATH } from '@/lib/routing'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Logo } from '@/components/brand/Logo'

const HALF = SCENE.transition / 2

/** Overlay-scoped query (never unscoped global selectors). */
const within = (el: HTMLElement, sel: string) => Array.from(el.querySelectorAll(sel))

/** Second half of the wipe: logo shrinks, panels exit upward, overlay hides. */
function lift(el: HTMLElement) {
  gsap
    .timeline()
    .to(within(el, '[data-mark]'), { scale: 0, duration: 0.16, ease: 'power2.in' })
    .to(within(el, '[data-panel]'), { yPercent: -100, duration: HALF, ease: 'power3.inOut', stagger: 0.06 }, '<0.04')
    .set(el, { autoAlpha: 0, pointerEvents: 'none' })
}

/**
 * Route change wipe: chili + cheese panels cover the screen with the logo popping in the middle,
 * then lift away on the new page (~0.6s). Internal <a> clicks are intercepted in the capture phase
 * (React Router's Link skips navigation when defaultPrevented). Item links are excluded so they keep
 * opening as a modal. Reduced motion: no interception, instant navigation.
 */
export function PageTransition() {
  const navigate = useNavigate()
  const location = useLocation()
  const reduced = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const covering = useRef(false)
  const safety = useRef(0)
  const pagePath = (getModalSlug(location) && getBackgroundLocation(location)?.pathname) || location.pathname

  useEffect(() => {
    if (reduced) return
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || covering.current) return
      const a = e.target instanceof Element ? e.target.closest('a') : null
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return
      if (matchPath(ITEM_PATH, url.pathname)) return

      e.preventDefault()
      covering.current = true
      const el = root.current
      if (!el) return
      gsap
        .timeline({ onComplete: () => void navigate(url.pathname + url.search + url.hash) })
        .set(el, { autoAlpha: 1, pointerEvents: 'auto' })
        .fromTo(within(el, '[data-panel]'), { yPercent: 100 }, { yPercent: 0, duration: HALF, ease: 'power3.inOut', stagger: 0.06 })
        .fromTo(within(el, '[data-mark]'), { scale: 0, rotate: -25 }, { scale: 1, rotate: 0, duration: HALF * 0.8, ease: EASE.bouncy }, '-=0.15')
      // Never leave the overlay stuck if the route somehow doesn't change.
      window.clearTimeout(safety.current)
      safety.current = window.setTimeout(() => {
        if (covering.current) {
          covering.current = false
          lift(el)
        }
      }, 2000)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [reduced, navigate])

  // New page rendered → lift the panels.
  useLayoutEffect(() => {
    if (!covering.current || !root.current) return
    covering.current = false
    window.clearTimeout(safety.current)
    lift(root.current)
  }, [pagePath])

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none invisible fixed inset-0 z-[96] opacity-0">
      <div data-panel className="absolute inset-0 bg-chili" />
      <div data-panel className="absolute inset-0 bg-cheese" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div data-mark>
          <Logo variant="icon" size={120} tone="light" alt="" />
        </div>
      </div>
    </div>
  )
}
