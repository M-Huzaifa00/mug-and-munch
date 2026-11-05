import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { useLenis } from 'lenis/react'
import { ScrollTrigger } from '@/lib/gsap'
import { getBackgroundLocation, getModalSlug } from '@/lib/routing'

/**
 * Jump to top on page change (works with or without Lenis) and refresh ScrollTriggers.
 * Opening/closing the item modal keeps the background page's pathname → no jump.
 */
export function ScrollToTop() {
  const location = useLocation()
  const pagePath = (getModalSlug(location) && getBackgroundLocation(location)?.pathname) || location.pathname
  const lenis = useLenis()
  const lenisRef = useRef(lenis)

  useEffect(() => {
    lenisRef.current = lenis
  }, [lenis])

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  useLayoutEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pagePath])

  return null
}
