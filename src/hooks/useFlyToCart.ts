import { useCallback } from 'react'
import { gsap } from '@/lib/gsap'
import { EASE } from '@/lib/motion-presets'
import { useReducedMotion } from './useReducedMotion'
import { SHOW_NAV_EVENT } from './useScrollState'

interface FlyOptions {
  /** Called when the clone lands on the cart icon. */
  onLand?: (target: HTMLElement) => void
}

/** Jelly bounce for the cart icon (elastic squash & stretch). */
export function jellyBounce(target: HTMLElement) {
  const el = target.querySelector<HTMLElement>('[data-cart-jelly]') ?? target
  gsap.killTweensOf(el)
  gsap
    .timeline()
    .to(el, { scaleX: 1.3, scaleY: 0.75, duration: 0.12, ease: 'power2.out' })
    .to(el, { scaleX: 0.85, scaleY: 1.15, duration: 0.12, ease: 'power2.out' })
    .to(el, { scaleX: 1, scaleY: 1, duration: 0.9, ease: EASE.elastic })
}

/** Final (un-translated) rect of the cart icon, even while the navbar is sliding back in. */
function targetCenter(target: HTMLElement): { x: number; y: number; size: number } {
  const r = target.getBoundingClientRect()
  let offsetY = 0
  const header = target.closest<HTMLElement>('[data-nav-header]')
  if (header) {
    // Tailwind v4 translate-* utilities use the standalone `translate` property ("x y" or "none").
    const t = getComputedStyle(header).translate
    const y = t && t !== 'none' ? (t.split(' ')[1] ?? '0') : '0'
    const n = parseFloat(y) || 0
    offsetY = y.endsWith('%') ? (n / 100) * header.offsetHeight : n
  }
  return { x: r.left + r.width / 2, y: r.top - offsetY + r.height / 2, size: r.width }
}

/**
 * Returns fly(sourceEl) → clones the product image and arcs it (MotionPathPlugin) into the
 * navbar cart icon, shrinking + fading, then jelly-bounces the icon. Returns false if skipped
 * (reduced motion, no source, or no cart icon).
 */
export function useFlyToCart() {
  const reduced = useReducedMotion()

  return useCallback(
    (source: HTMLElement | null | undefined, { onLand }: FlyOptions = {}): boolean => {
      if (reduced || !source) return false
      const target = document.querySelector<HTMLElement>('[data-cart-target]')
      const s = source.getBoundingClientRect()
      if (!target || s.width === 0) return false

      window.dispatchEvent(new Event(SHOW_NAV_EVENT))
      const t = targetCenter(target)

      const clone = source.cloneNode(true) as HTMLElement
      clone.removeAttribute('id')
      clone.setAttribute('aria-hidden', 'true')
      Object.assign(clone.style, {
        position: 'fixed',
        left: `${s.left}px`,
        top: `${s.top}px`,
        width: `${s.width}px`,
        height: `${s.height}px`,
        margin: '0',
        zIndex: '90',
        pointerEvents: 'none',
        borderRadius: '1.5rem',
        overflow: 'hidden',
      })
      document.body.appendChild(clone)

      const sx = s.left + s.width / 2
      const sy = s.top + s.height / 2
      const dx = t.x - sx
      const dy = t.y - sy
      // Arc apex: above both points, but never off the top of the screen.
      const apexY = Math.max(Math.min(dy, 0) - 90, 24 - sy)
      const endScale = Math.min(0.4, Math.max(0.06, (t.size * 0.8) / Math.max(s.width, s.height)))

      gsap
        .timeline({
          onComplete: () => {
            clone.remove()
            jellyBounce(target)
            onLand?.(target)
          },
        })
        .to(
          clone,
          {
            duration: 0.85,
            ease: 'power1.inOut',
            motionPath: { path: [{ x: 0, y: 0 }, { x: dx * 0.3, y: apexY }, { x: dx, y: dy }], curviness: 1.2 },
            scale: endScale,
            rotation: 18,
          },
          0,
        )
        .to(clone, { opacity: 0.15, duration: 0.25, ease: 'power1.in' }, 0.6)

      return true
    },
    [reduced],
  )
}
