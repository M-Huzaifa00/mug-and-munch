import { useEffect, useState } from 'react'

export interface ScrollState {
  /** Scrolled past the top threshold → shrink navbar. */
  scrolled: boolean
  /** Scrolling down past the hide threshold → hide navbar. */
  hidden: boolean
}

/** Dispatch on window to force the navbar back into view (e.g. fly-to-cart needs the cart icon). */
export const SHOW_NAV_EVENT = 'mm:show-nav'

/**
 * rAF-throttled window scroll listener. Works with Lenis (root mode scrolls the window)
 * and with native scroll when Lenis is disabled for reduced motion.
 */
export function useScrollState(shrinkAt = 24, hideAfter = 160, tolerance = 6): ScrollState {
  const [state, setState] = useState<ScrollState>(() => ({ scrolled: window.scrollY > shrinkAt, hidden: false }))

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const update = () => {
      ticking = false
      const y = window.scrollY
      const delta = y - lastY
      if (Math.abs(delta) < tolerance) return
      const next: ScrollState = {
        scrolled: y > shrinkAt,
        hidden: delta > 0 && y > hideAfter,
      }
      lastY = y
      setState((prev) => (prev.scrolled === next.scrolled && prev.hidden === next.hidden ? prev : next))
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    const onShow = () => {
      lastY = window.scrollY
      setState((prev) => (prev.hidden ? { ...prev, hidden: false } : prev))
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener(SHOW_NAV_EVENT, onShow)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener(SHOW_NAV_EVENT, onShow)
    }
  }, [shrinkAt, hideAfter, tolerance])

  return state
}
