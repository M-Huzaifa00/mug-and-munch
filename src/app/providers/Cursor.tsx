import { useRef } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { isLowEndDevice } from '@/hooks/useIsTouch'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { EASE } from '@/lib/motion-presets'

type Mode = 'dot' | 'link' | 'add' | 'drag'
const SCALE: Record<Mode, number> = { dot: 0.18, link: 0.34, add: 1, drag: 1 }
const LABEL: Record<Mode, string> = { dot: '', link: '', add: 'Add +', drag: 'Drag' }

/** Read the hovered target's intent: explicit data-cursor wins, then links/buttons. */
function modeFor(target: EventTarget | null): Mode {
  if (!(target instanceof Element)) return 'dot'
  const explicit = target.closest<HTMLElement>('[data-cursor]')?.dataset.cursor
  if (explicit === 'add' || explicit === 'drag') return explicit
  return target.closest('a, button, [role="button"], label, input, select, textarea') ? 'link' : 'dot'
}

/**
 * Custom cursor companion: chili dot that grows into an "Add +" bubble over product cards
 * ([data-cursor="add"]) and a cheese "Drag" bubble over draggables ([data-cursor="drag"]).
 * Desktop fine pointer + motion allowed + not low-end (cores > 4) only. Native cursor stays visible.
 */
export function Cursor() {
  const capable = useMediaQuery(`${MQ.finePointer} and ${MQ.motionOk}`)
  const enabled = capable && !isLowEndDevice()
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!enabled || !el) return
      const bubble = el.querySelector<HTMLElement>('[data-bubble]')
      const label = el.querySelector<HTMLElement>('[data-label]')
      if (!bubble || !label) return
      const html = document.documentElement
      html.dataset.customCursor = 'on'

      const xTo = gsap.quickTo(el, 'x', { duration: 0.22, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.22, ease: 'power3.out' })
      gsap.set(bubble, { scale: SCALE.dot, autoAlpha: 0 })
      const cur: { mode: Mode; visible: boolean } = { mode: 'dot', visible: false }

      const setMode = (next: Mode) => {
        if (next === cur.mode) return
        cur.mode = next
        el.dataset.mode = next
        bubble.classList.toggle('bg-cheese', next === 'drag')
        bubble.classList.toggle('bg-chili', next !== 'drag')
        label.textContent = LABEL[next]
        gsap.to(bubble, { scale: SCALE[next], duration: 0.35, ease: EASE.bouncy, overwrite: 'auto' })
        gsap.to(label, { autoAlpha: LABEL[next] ? 1 : 0, duration: 0.2 })
      }

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return
        xTo(e.clientX)
        yTo(e.clientY)
        if (!cur.visible) {
          cur.visible = true
          gsap.to(bubble, { autoAlpha: 1, duration: 0.2 })
        }
        setMode(modeFor(e.target))
      }
      const onLeave = () => {
        cur.visible = false
        gsap.to(bubble, { autoAlpha: 0, duration: 0.2 })
      }
      const onDown = () => gsap.to(bubble, { scale: SCALE[cur.mode] * 0.8, duration: 0.12 })
      const onUp = () => gsap.to(bubble, { scale: SCALE[cur.mode], duration: 0.3, ease: EASE.bouncy })

      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerleave', onLeave)
      window.addEventListener('pointerdown', onDown)
      window.addEventListener('pointerup', onUp)
      return () => {
        delete html.dataset.customCursor
        window.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerleave', onLeave)
        window.removeEventListener('pointerdown', onDown)
        window.removeEventListener('pointerup', onUp)
      }
    },
    { dependencies: [enabled] },
  )

  if (!enabled) return null
  return (
    <div ref={root} aria-hidden="true" data-mode="dot" className="pointer-events-none fixed top-0 left-0 z-[99]">
      <div data-bubble className="absolute -top-10 -left-10 flex size-20 items-center justify-center rounded-full border-2 border-espresso bg-chili">
        <span data-label className="font-display text-sm font-extrabold whitespace-nowrap text-espresso" />
      </div>
    </div>
  )
}
