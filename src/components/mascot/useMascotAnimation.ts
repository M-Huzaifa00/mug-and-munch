import { useEffect, useRef, type RefObject } from 'react'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { EASE, MASCOT } from '@/lib/motion-presets'
import type { MascotMood } from './mascotPoses'
import { followPointer } from './mascotFollow'

type Q = (selector: string) => Element[]
const ARM_ORIGIN = { armL: '100 242', armR: '146 240' } as const

/** Loops shared by every awake mood: body bob + steam flicker. */
function ambient(q: Q, bob = true) {
  if (bob) gsap.to(q('[data-part="rig"]'), { y: -5, duration: MASCOT.bob, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  gsap.to(q('[data-part="steam"] path'), {
    y: -6,
    opacity: 0.35,
    duration: MASCOT.steam / 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    stagger: { each: 0.35, from: 'random' },
  })
}

/** Random blinks every 3–6s. Returns cleanup. */
function blinking(q: Q) {
  const eyes = [...q('[data-part="eyeL"]'), ...q('[data-part="eyeR"]')]
  let timer = 0
  let tween: gsap.core.Tween | null = null
  const blink = () => {
    tween = gsap.to(eyes, { scaleY: 0.1, transformOrigin: '50% 60%', duration: MASCOT.blink, yoyo: true, repeat: 1, ease: 'power1.inOut' })
    timer = window.setTimeout(blink, gsap.utils.random(MASCOT.blinkMin, MASCOT.blinkMax) * 1000)
  }
  timer = window.setTimeout(blink, gsap.utils.random(1.5, MASCOT.blinkMax) * 1000)
  return () => {
    window.clearTimeout(timer)
    tween?.kill()
    gsap.set(eyes, { clearProps: 'transform' })
  }
}

const lookAround = (q: Q) =>
  gsap
    .timeline()
    .to(q('[data-part^="pupil"]'), { x: -4, duration: MASCOT.peekLook, ease: EASE.out })
    .to(q('[data-part^="pupil"]'), { x: 4, duration: MASCOT.peekLook, ease: EASE.out }, '+=0.25')
    .to(q('[data-part^="pupil"]'), { x: 0, duration: MASCOT.peekLook / 2 }, '+=0.25')

/**
 * GSAP layer for <Mascot>. Each mood builds its own timelines; useGSAP reverts them on mood change.
 * Reduced motion: nothing runs → the React-rendered static pose stays.
 */
export function useMascotAnimation(ref: RefObject<SVGSVGElement | null>, mood: MascotMood, onPeekEnd?: () => void) {
  const prevMouth = useRef<string | null>(null)
  const peekEnd = useRef(onPeekEnd)
  useEffect(() => {
    peekEnd.current = onPeekEnd
  }, [onPeekEnd])

  useGSAP(
    () => {
      const svg = ref.current
      if (!svg) return
      const q: Q = gsap.utils.selector(svg)
      const mouth = q('[data-part="mouthShape"]')[0]
      const mm = gsap.matchMedia()

      mm.add(MQ.motionOk, () => {
        // Morph the mouth from the previous mood's shape.
        const d = mouth?.getAttribute('d') ?? null
        if (mouth && prevMouth.current && d && prevMouth.current !== d) {
          gsap.from(mouth, { morphSVG: prevMouth.current, duration: MASCOT.morph, ease: EASE.bouncy })
        }
        prevMouth.current = d

        const rig = q('[data-part="rig"]')
        const armR = q('[data-part="armR"]')
        const armL = q('[data-part="armL"]')
        let cleanup: (() => void) | undefined

        switch (mood) {
          case 'idle':
            ambient(q)
            cleanup = blinking(q)
            break
          case 'follow': {
            ambient(q)
            const stopBlink = blinking(q)
            const stopFollow = followPointer(svg, q('[data-part^="pupil"]'))
            cleanup = () => {
              stopBlink()
              stopFollow()
            }
            break
          }
          case 'wave':
            ambient(q)
            gsap.fromTo(armR, { rotation: -100, svgOrigin: ARM_ORIGIN.armR }, { rotation: -60, svgOrigin: ARM_ORIGIN.armR, duration: 0.22, ease: 'sine.inOut', yoyo: true, repeat: -1 })
            break
          case 'excited':
            gsap
              .timeline({ repeat: -1, repeatDelay: 0.6 })
              .to(rig, { y: -26, duration: 0.25, ease: 'power2.out' })
              .to(rig, { y: 0, duration: 0.45, ease: 'bounce.out' })
              .fromTo(q('[data-part="sparkles"] path'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1.2, duration: 0.3, ease: EASE.bouncy, stagger: 0.08 }, 0.1)
            break
          case 'sleep':
            gsap.to(rig, { scaleY: 1.02, transformOrigin: '50% 100%', duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
            gsap.fromTo(q('[data-part="zzz"] text'), { y: 6, opacity: 0 }, { y: -10, opacity: 1, duration: 1.4, ease: 'sine.out', stagger: { each: 0.45, repeat: -1 } })
            break
          case 'sad':
            gsap.to(q('[data-part="head"]'), { rotation: -16, svgOrigin: '128 230', duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
            gsap.fromTo(q('[data-part="tear"]'), { y: 0, opacity: 1 }, { y: 18, opacity: 0, duration: 1.3, ease: 'power1.in', repeat: -1, repeatDelay: 0.5 })
            break
          case 'guilty':
            ambient(q, false)
            gsap.timeline({ repeat: -1, repeatDelay: 1 }).add(lookAround(q))
            gsap.to(q('[data-part="crumbs"] circle'), { y: 2, duration: 0.4, yoyo: true, repeat: -1, stagger: 0.15, ease: 'sine.inOut' })
            break
          case 'dance':
            gsap.to(rig, { rotation: 7, svgOrigin: '122 300', duration: 0.32, ease: 'sine.inOut', yoyo: true, repeat: -1 })
            gsap.to(rig, { y: -8, duration: 0.16, ease: 'power1.out', yoyo: true, repeat: -1 })
            gsap.to(armL, { rotation: 60, svgOrigin: ARM_ORIGIN.armL, duration: 0.32, yoyo: true, repeat: -1, ease: 'sine.inOut' })
            gsap.to(armR, { rotation: -20, svgOrigin: ARM_ORIGIN.armR, duration: 0.32, yoyo: true, repeat: -1, ease: 'sine.inOut' })
            break
          case 'peek': {
            const tl = gsap.timeline()
            tl.from(rig, { y: 320, duration: MASCOT.peekIn, ease: EASE.bouncy })
              .fromTo(armR, { rotation: -100, svgOrigin: ARM_ORIGIN.armR }, { rotation: -60, svgOrigin: ARM_ORIGIN.armR, duration: 0.2, yoyo: true, repeat: 3 }, '<0.4')
              .add(lookAround(q))
            if (peekEnd.current) tl.call(() => peekEnd.current?.())
            else tl.to(rig, { y: 320, duration: MASCOT.peekIn * 0.8, ease: 'back.in(1.4)' }, `+=${MASCOT.peekHold}`).repeat(-1).repeatDelay(MASCOT.peekRepeatDelay)
            break
          }
        }
        return cleanup
      })
    },
    { scope: ref, dependencies: [mood], revertOnUpdate: true },
  )
}
