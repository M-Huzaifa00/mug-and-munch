import { gsap } from '@/lib/gsap'
import { MASCOT } from '@/lib/motion-presets'
import { MASCOT_LOOK_EVENT, type MascotLookDetail } from './mascotLook'

/**
 * Pupils follow the cursor (fine pointer) or device tilt (only where no permission prompt is
 * needed, i.e. not iOS 13+). Returns cleanup.
 */
export function followPointer(svg: SVGSVGElement, pupils: Element[]): () => void {
  if (pupils.length === 0) return () => {}
  const xTo = gsap.quickTo(pupils, 'x', { duration: 0.35, ease: 'power3.out' })
  const yTo = gsap.quickTo(pupils, 'y', { duration: 0.35, ease: 'power3.out' })
  const R = MASCOT.followRange

  const aim = (dx: number, dy: number) => {
    const len = Math.hypot(dx, dy) || 1
    const k = Math.min(1, len / 300)
    xTo((dx / len) * R * k)
    yTo((dy / len) * R * k)
  }

  // lookAt: a MASCOT_LOOK_EVENT (e.g. the Munch Run burger taking off) wins over the pointer briefly.
  let lookingUntil = 0
  const aimAt = (x: number, y: number) => {
    const r = svg.getBoundingClientRect()
    aim(x - (r.left + r.width * 0.55), y - (r.top + r.height * 0.55))
  }
  const onLook = (e: Event) => {
    const { x, y } = (e as CustomEvent<MascotLookDetail>).detail
    lookingUntil = performance.now() + 500
    aimAt(x, y)
  }
  window.addEventListener(MASCOT_LOOK_EVENT, onLook)

  const onPointer = (e: PointerEvent) => {
    if (performance.now() < lookingUntil) return
    const r = svg.getBoundingClientRect()
    aim(e.clientX - (r.left + r.width * 0.55), e.clientY - (r.top + r.height * 0.55))
  }
  const onTilt = (e: DeviceOrientationEvent) => {
    if (e.gamma == null || e.beta == null) return
    aim(e.gamma * 10, (e.beta - 45) * 10)
  }

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  type DOEWithPermission = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> }
  const tiltNeedsPermission =
    typeof DeviceOrientationEvent === 'undefined' || typeof (DeviceOrientationEvent as DOEWithPermission).requestPermission === 'function'

  if (fine) window.addEventListener('pointermove', onPointer, { passive: true })
  else if (!tiltNeedsPermission) window.addEventListener('deviceorientation', onTilt, { passive: true })

  return () => {
    window.removeEventListener(MASCOT_LOOK_EVENT, onLook)
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('deviceorientation', onTilt)
    gsap.set(pupils, { x: 0, y: 0 })
  }
}
