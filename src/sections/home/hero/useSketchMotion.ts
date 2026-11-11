import type { RefObject } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { DUR, EASE } from '@/lib/motion-presets'
import { getSketchHandoff, whenPreloaderDone } from '@/lib/preloader'
import { modalStateFrom } from '@/lib/routing'

/**
 * All motion of the hero sketch (one GSAP scope = the hero section):
 * - intro: ink lines draw, colours print in off-register, arrows + notes + sparkles appear. When the preloader
 *   handed its drawing over (Home, sketch on screen), lines are already drawn: we wait for it to land, then print.
 * - idle: items bob, steam curls, sparkles twinkle.
 * - hover an item (mouse): it redraws itself and its note underlines. Click / tap: opens that item.
 * - scroll: the drawing drifts up a little.
 * Reduced motion: finished drawing, static; click still opens the item.
 */
export function useSketchMotion(scope: RefObject<HTMLElement | null>, play: boolean) {
  const navigate = useNavigate()
  const location = useLocation()

  useGSAP(
    (_ctx, contextSafe) => {
      const root = scope.current
      if (!root) return
      const items = [...root.querySelectorAll<SVGGElement>('[data-sk-item][data-sk-slug]')]
      const noteFor = (slug: string) => root.querySelector<HTMLElement>(`[data-sk-note][data-sk-slug="${slug}"]`)

      // click / tap → the item (works with or without motion)
      const open = (e: Event) => {
        const slug = (e.currentTarget as SVGGElement).dataset.skSlug
        if (slug) void navigate(`/menu/${slug}`, { state: modalStateFrom(location) })
      }
      items.forEach((el) => el.addEventListener('click', open))

      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        const handoff = getSketchHandoff()
        if (!handoff) gsap.set('[data-sk-line]', { drawSVG: '0%' })
        else gsap.set('[data-sk-svg]', { autoAlpha: 0 })
        gsap.set(['[data-sk-arrow]', '[data-sk-steam] path'], { drawSVG: '0%' })
        gsap.set('[data-sk-fill]', { autoAlpha: 0, x: 10, y: 10 })
        gsap.set(['[data-sk-note]', '[data-sk-spark]'], { autoAlpha: 0 })
        gsap.to('[data-sk-art]', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } })
        if (!play) return

        const steam = gsap.timeline({ paused: true, repeat: -1 })
        steam
          .fromTo('[data-sk-steam] path', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 1.1, ease: 'sine.inOut', stagger: 0.25 })
          .to('[data-sk-steam] path', { drawSVG: '100% 100%', duration: 1.1, ease: 'sine.inOut', stagger: 0.25 }, '>-0.2')
        const bobs = items.map((el, i) =>
          gsap.to(el, { y: -6, rotate: i % 2 ? 1.2 : -1.2, svgOrigin: '300 432', duration: 1.6 + i * 0.25, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true }),
        )
        const twinkle = gsap.to('[data-sk-spark]', { scale: 0.6, transformOrigin: '50% 50%', duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.4, paused: true })

        const tl = gsap.timeline({ paused: true })
        if (!handoff) tl.to('[data-sk-line]', { drawSVG: '100%', duration: 0.7, ease: 'power2.inOut', stagger: 0.045 }, 0.25)
        tl.to('[data-sk-fill]', { autoAlpha: 1, x: 0, y: 0, duration: 0.5, ease: EASE.out, stagger: 0.18 }, handoff ? 0 : '-=0.5')
          .to('[data-sk-arrow]', { drawSVG: '100%', duration: 0.5, ease: 'power2.out', stagger: 0.15 }, '-=0.2')
          .to('[data-sk-note]', { autoAlpha: 1, duration: DUR.base, stagger: 0.15 }, '<')
          .to('[data-sk-spark]', { autoAlpha: 1, duration: 0.3, stagger: 0.1 }, '<')
          .add(() => [steam, twinkle, ...bobs].forEach((t) => t.play()), '+=0.1')

        const run = { live: true }
        if (handoff)
          void whenPreloaderDone().then(() => {
            if (!run.live) return
            gsap.set('[data-sk-svg]', { autoAlpha: 1 })
            tl.play()
          })
        else tl.play()

        // hover (mouse): the item redraws itself + its note underlines
        const enter = contextSafe?.((e: PointerEvent) => {
          if (e.pointerType !== 'mouse' || !tl.progress()) return
          const el = e.currentTarget as SVGGElement
          noteFor(el.dataset.skSlug ?? '')?.setAttribute('data-active', '')
          const lines = el.querySelectorAll('[data-sk-line]')
          if (gsap.getTweensOf(lines).length) return
          gsap.fromTo(lines, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.55, ease: 'power2.inOut', stagger: 0.025 })
          gsap.fromTo(el.querySelector('[data-sk-fill]'), { x: 12, y: 12 }, { x: 0, y: 0, duration: 0.5, delay: 0.15, ease: EASE.out })
        })
        const leave = (e: PointerEvent) => noteFor((e.currentTarget as SVGGElement).dataset.skSlug ?? '')?.removeAttribute('data-active')
        items.forEach((el) => {
          if (enter) el.addEventListener('pointerenter', enter)
          el.addEventListener('pointerleave', leave)
        })
        return () => {
          run.live = false
          items.forEach((el) => {
            if (enter) el.removeEventListener('pointerenter', enter)
            el.removeEventListener('pointerleave', leave)
          })
        }
      })
      return () => items.forEach((el) => el.removeEventListener('click', open))
    },
    { scope, dependencies: [play], revertOnUpdate: true },
  )
}
