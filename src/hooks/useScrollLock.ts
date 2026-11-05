import { useEffect } from 'react'
import { useLenis } from 'lenis/react'

let locks = 0

/** Freezes page scroll (Lenis + native) while a modal/drawer is open. Ref-counted. */
export function useScrollLock(active: boolean) {
  const lenis = useLenis()

  useEffect(() => {
    if (!active) return
    const html = document.documentElement
    locks += 1
    if (locks === 1) {
      lenis?.stop()
      html.style.scrollbarGutter = 'stable'
      html.style.overflow = 'hidden'
    }
    return () => {
      locks -= 1
      if (locks === 0) {
        html.style.overflow = ''
        html.style.scrollbarGutter = ''
        lenis?.start()
      }
    }
  }, [active, lenis])
}
