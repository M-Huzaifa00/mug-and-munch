import { useEffect, useRef, type ReactNode } from 'react'
import { ReactLenis, useLenis, type LenisRef } from 'lenis/react'
import { gsap, refreshScrollTriggersSoon, ScrollTrigger } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** Stable reference so useLenis doesn't re-subscribe every render. */
const syncScrollTrigger = () => ScrollTrigger.update()

function ScrollTriggerSync() {
  useLenis(syncScrollTrigger)
  return null
}

/**
 * Lenis smooth scroll driven by the GSAP ticker (one RAF loop for everything).
 * Disabled entirely for prefers-reduced-motion → native scrolling.
 * Touch devices keep native scrolling (Lenis default syncTouch: false) for mid-range Android.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const lenisRef = useRef<LenisRef>(null)

  // Layout settles after the window load, web fonts and late images → re-measure ScrollTriggers.
  useEffect(() => {
    const refresh = () => refreshScrollTriggersSoon()
    if (document.readyState !== 'complete') window.addEventListener('load', refresh, { once: true })
    void document.fonts?.ready.then(refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  useEffect(() => {
    if (reduced) return
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => gsap.ticker.remove(update)
  }, [reduced])

  if (reduced) return <>{children}</>

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.12, wheelMultiplier: 1 }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  )
}
