import { useEffect, useRef, type RefObject } from 'react'
import { useLenis } from 'lenis/react'
import { MUNCH_RUN_CONFIG as CFG, MUNCH_STOPS } from '@/data/munchRun'
import { gsap, MQ, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { MUNCH_RUN } from '@/lib/motion-presets'
import { mascotLookAt } from '@/components/mascot/mascotLook'
import { useCart } from '@/store/cart'
import { dizzy, happyHop, landSquash, popIn, startIdle, takeoffSquash, tapJump } from './munchActions'
import { createCrumbPool, hideNote, playPuff, showNote } from './munchEffects'
import { bump, controlPoint, lerp, parkedStop, quadPoint, quadTangent, segmentProgress, segmentRange, smoothToward, spinAngle, splitProgress, stretchFromVelocity, tiltFromTangent } from './munchRunMath'
import { buildSegmentTimeline } from './munchTimelines'
import { readEls } from './readEls'

export interface MunchApi {
  tap: () => void
}

interface Box {
  top: number
  left: number
  width: number
}
const center = (r: Box) => ({ x: r.left + r.width / 2, y: r.top + r.width / 2 })
const lowEnd = () => (navigator.hardwareConcurrency ?? 4) <= CFG.lowEndCores

/**
 * The Munch Run engine. One fixed traveler; every tick reads the LIVE rects of the current segment's
 * anchors (so pins, Lenis, resizes and refreshes stay correct), smooths progress, and writes transforms
 * only. The ticker runs only while Hero → end of Bestsellers is in range.
 */
export function useMunchRun(root: RefObject<HTMLDivElement | null>, onTap: (stop: number) => void): RefObject<MunchApi | null> {
  const api = useRef<MunchApi | null>(null)
  const lenis = useLenis()
  const lenisRef = useRef(lenis)
  useEffect(() => {
    lenisRef.current = lenis
  }, [lenis])
  const onTapRef = useRef(onTap)
  useEffect(() => {
    onTapRef.current = onTap
  }, [onTap])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ motion: MQ.motionOk, mobile: `(max-width: ${CFG.mobileMax}px)`, fine: MQ.finePointer }, (ctx) => {
        const { motion, mobile, fine } = ctx.conditions as { motion: boolean; mobile: boolean; fine: boolean }
        const els = root.current ? readEls(root.current) : null
        const anchors = MUNCH_STOPS.map((s) => document.querySelector<HTMLElement>(`[data-munch-stop="${s.stop}"]`))
        if (!motion || !els || anchors.some((a) => !a)) return
        const [A1, A2, A3] = anchors as [HTMLElement, HTMLElement, HTMLElement]
        const weak = lowEnd()
        const tl = [buildSegmentTimeline(els.svg, 'burger', 'wrap'), buildSegmentTimeline(els.svg, 'wrap', 'coffee')]
        gsap.set(els.svg.querySelectorAll('[data-part="steam"]'), { opacity: 0 })
        const set = {
          x: gsap.quickSetter(els.outer, 'x', 'px'),
          y: gsap.quickSetter(els.outer, 'y', 'px'),
          rot: gsap.quickSetter(els.mid, 'rotation', 'deg'),
          sx: gsap.quickSetter(els.mid, 'scaleX'),
          sy: gsap.quickSetter(els.mid, 'scaleY'),
        }
        const pupils = els.svg.querySelectorAll('[data-part="pupils"]')
        const aim = { x: gsap.quickTo(pupils, 'x', { duration: 0.3 }), y: gsap.quickTo(pupils, 'y', { duration: 0.3 }) }
        const crumbs = createCrumbPool(els.crumbs, weak ? 0 : mobile ? CFG.crumbs.mobile : CFG.crumbs.desktop)
        const st = { current: 0, snap: true, entered: false, parked: null as number | null, onscreen: true, crumbDist: 0, last: { x: 0, y: 0 }, prevLocal: 0, prevSeg: 0, dizzyAt: 0, lookUntil: 0, hopK: 0, pointer: null as { x: number; y: number } | null, busy: false }
        // Marquee strip doc range (not pinned → cached on refresh; no extra per-frame read).
        const hopEl = document.querySelector<HTMLElement>('[data-munch-hop]')
        const hop = { top: 0, bottom: 0 }
        const measureHop = () => {
          const r = hopEl?.getBoundingClientRect()
          if (r) Object.assign(hop, { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY })
        }
        // Anchor boxes cached as document positions (measured on refresh / layout resize): zero layout reads per frame.
        // Only Stop 3 is read live near the end of the journey, because the desktop pin moves it.
        const docBox: Box[] = [0, 1, 2].map(() => ({ top: 0, left: 0, width: 0 }))
        const measure = () => {
          ;[A1, A2, A3].forEach((a, i) => {
            const r = a.getBoundingClientRect()
            docBox[i] = { top: r.top + window.scrollY, left: r.left, width: r.width }
          })
          measureHop()
        }
        measure()
        const ro = new ResizeObserver(() => measure())
        ro.observe(document.body)
        const screenBox = (i: number, sy: number): Box => {
          const b = docBox[i] as Box
          return { top: b.top - sy, left: b.left, width: b.width }
        }
        const live3 = (): Box => {
          const r = A3.getBoundingClientRect()
          return { top: r.top, left: r.left, width: r.width }
        }
        let lastSy = -1
        const lastAim = { x: NaN, y: NaN }
        const aimTo = (x: number, y: number) => {
          if (x !== lastAim.x) aim.x((lastAim.x = x))
          if (y !== lastAim.y) aim.y((lastAim.y = y))
        }
        const shadow = els.svg.querySelectorAll('[data-part="shadow"]')
        let stopIdle: (() => void) | null = null
        let attached = false

        const syncIdle = () => {
          const want = st.parked !== null && st.onscreen && !st.busy
          if (want && !stopIdle) stopIdle = startIdle(els, st.parked === 2)
          if (!want && stopIdle) {
            stopIdle()
            stopIdle = null
          }
        }

        const tick = (_t: number, dt: number) => {
          // ---- reads (no writes before these) ----
          const vh = window.innerHeight
          const vw = window.innerWidth
          const sy = window.scrollY
          const line = vh * (mobile ? CFG.flightLine.mobile : CFG.flightLine.desktop)
          const depart = vh * (mobile ? CFG.departLine.mobile : CFG.departLine.desktop)
          const r1 = screenBox(0, sy)
          const r2 = screenBox(1, sy)
          let target = segmentProgress(sy, segmentRange(r1.top + sy, r2.top + sy, depart, line, true))
          let r3 = screenBox(2, sy)
          if (target >= 1) {
            target = 1 + segmentProgress(sy, segmentRange(r2.top + sy, r3.top + sy, depart, line, false))
            if (target > 1.85) {
              // Near / at Stop 3: the desktop pin moves the anchor, so read it live.
              r3 = live3()
              target = 1 + segmentProgress(sy, segmentRange(r2.top + sy, r3.top + sy, depart, line, false))
            }
          }
          // Nothing moved → nothing to write (idle loops keep running on their own).
          if (!st.snap && sy === lastSy && Math.abs(st.current - target) < 1e-4 && st.entered) return
          lastSy = sy
          const prev = st.current
          st.current = st.snap ? target : smoothToward(st.current, target, MUNCH_RUN.lerp, Math.min(dt, 64))
          st.snap = false
          const { seg, local } = splitProgress(st.current)
          const from = seg === 0 ? r1 : r2
          const to = seg === 0 ? r2 : r3

          // ---- position on the scoop curve ----
          const p0 = center(from)
          const p1 = center(to)
          const c = controlPoint(p0, p1, { w: vw, h: vh }, mobile ? CFG.arc.pull.mobile : CFG.arc.pull.desktop, mobile ? CFG.arc.drop.mobile : CFG.arc.drop.desktop)
          const pos = quadPoint(p0, c, p1, local)
          // Hop: lift while the marquee strip is under the character; its shadow lands on the strip.
          const hopK = seg === 0 && hop.bottom > hop.top ? bump((pos.y - (hop.top - sy)) / (hop.bottom - hop.top), 0, 1) : 0
          pos.y -= vh * CFG.marqueeHop.height * hopK
          const size = lerp(from.width, to.width, local)
          const parked = parkedStop(st.current, MUNCH_RUN.parkEpsilon)
          const flying = parked === null
          const vel = (st.current - prev) / Math.max(dt / 1000, 1e-3)

          // ---- writes ----
          set.x(pos.x - size / 2)
          set.y(pos.y - size / 2)
          const tilt = flying ? tiltFromTangent(quadTangent(p0, c, p1, local), MUNCH_RUN.maxTilt) : 0
          set.rot(tilt + spinAngle(local, MUNCH_RUN.morphStart, MUNCH_RUN.morphEnd, mobile, seg === 0 ? -1 : 1))
          const [along, across] = flying ? stretchFromVelocity(vel, MUNCH_RUN.stretchGain, MUNCH_RUN.stretchMax) : [1, 1]
          set.sx(along)
          set.sy(across)
          if (hopK > 0 || st.hopK > 0) gsap.set(shadow, { opacity: hopK * 0.35, y: hopK * 40 })
          st.hopK = hopK
          if (seg === 0) {
            tl[1]?.progress(0)
            tl[0]?.progress(local)
          } else {
            tl[0]?.progress(1)
            tl[1]?.progress(local)
          }

          // ---- events ----
          if (!st.entered) {
            st.entered = true
            if (parked === 0) {
              st.busy = true
              popIn(els, () => {
                st.busy = false
                syncIdle()
              })
              if (window.innerWidth >= CFG.notesMinWidth) showNote(els.notes[0] ?? null)
            }
          } else if (st.parked !== null && flying) {
            takeoffSquash(els)
            playPuff(els.dust, pos.x, pos.y + size * 0.45, size * 0.3)
            hideNote(els.notes[0] ?? null)
            hideNote(els.notes[st.parked] ?? null)
            if (st.parked === 0 && fine && !mobile && !weak && st.current > prev) st.lookUntil = performance.now() + MUNCH_RUN.lookFor * 1000
          } else if (st.parked === null && !flying) {
            landSquash(els, parked === 2)
            els.notes.forEach((n, k) => k !== parked && hideNote(n))
            playPuff(els.dust, pos.x, pos.y + size * 0.45, size * 0.3)
            if (parked !== null && parked > 0 && window.innerWidth >= CFG.notesMinWidth) showNote(els.notes[parked] ?? null)
          }
          if (flying) {
            if (seg === st.prevSeg && (st.prevLocal - 0.5) * (local - 0.5) < 0 && !weak) playPuff(els.sparkle, pos.x, pos.y, size * 0.7)
            st.crumbDist += Math.hypot(pos.x - st.last.x, pos.y - st.last.y)
            if (st.crumbDist > CFG.crumbs.everyPx) {
              st.crumbDist = 0
              crumbs.spawn(pos.x, pos.y + size * 0.3, seg === 0 ? 'sesame' : 'herb')
            }
            aimTo(Math.sign(p1.x - p0.x) * 2.4, 1.5)
            const lv = lenisRef.current?.velocity ?? 0
            const now = performance.now()
            if (!weak && Math.abs(lv) > CFG.dizzyVelocity && now > st.dizzyAt) {
              st.dizzyAt = now + MUNCH_RUN.dizzyCooldown * 1000
              dizzy(els)
            }
          } else if (st.pointer) {
            aimTo(Math.round(gsap.utils.clamp(-2.4, 2.4, (st.pointer.x - pos.x) / 120) * 10) / 10, Math.round(gsap.utils.clamp(-2, 2, (st.pointer.y - pos.y) / 120) * 10) / 10)
          } else {
            aimTo(0, -1.2)
          }
          if (performance.now() < st.lookUntil) mascotLookAt(pos.x, pos.y)
          if ((parked === null) !== (st.parked === null)) els.button.style.pointerEvents = parked === null ? 'none' : 'auto'
          st.parked = parked
          st.prevLocal = local
          st.prevSeg = seg
          st.last = pos
          st.onscreen = pos.y + size > 0 && pos.y - size < vh
          syncIdle()
        }

        const attach = (on: boolean) => {
          if (on === attached) return
          attached = on
          gsap.set(els.outer, { autoAlpha: on ? 1 : 0, willChange: on ? 'transform' : 'auto' })
          if (on) {
            st.snap = st.entered
            gsap.ticker.add(tick)
          } else {
            gsap.ticker.remove(tick)
            els.notes.forEach((n) => hideNote(n))
            st.parked = null
            syncIdle()
          }
        }
        // Active from the top of the page until Bestsellers has scrolled away (pin spacing included).
        const range = ScrollTrigger.create({ trigger: A3.closest('section') ?? A3, start: 'bottom top', onEnter: () => attach(false), onLeaveBack: () => attach(true) })
        attach(window.scrollY < range.start)
        const onRefresh = () => {
          st.snap = true
          measure()
        }
        ScrollTrigger.addEventListener('refresh', onRefresh)

        // Hide while a drawer / modal locks scroll (useScrollLock sets html overflow hidden).
        const html = document.documentElement
        const obs = new MutationObserver(() => gsap.to(root.current, { autoAlpha: html.style.overflow === 'hidden' ? 0 : 1, duration: 0.2 }))
        obs.observe(html, { attributes: true, attributeFilter: ['style'] })

        const onPointer = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return
          st.pointer = { x: e.clientX, y: e.clientY }
          // Parked: glance toward the cursor (idle frames skip the tick, so aim here).
          if (st.parked !== null) aimTo(Math.round(gsap.utils.clamp(-2.4, 2.4, (e.clientX - st.last.x) / 120) * 10) / 10, Math.round(gsap.utils.clamp(-2, 2, (e.clientY - st.last.y) / 120) * 10) / 10)
        }
        if (fine) window.addEventListener('pointermove', onPointer, { passive: true })

        // Cart reaction: hop when something is added while it's parked on screen.
        const unsub = useCart.subscribe((s, p) => {
          if (!s.lastAdd || s.lastAdd === p.lastAdd || st.parked === null || !st.onscreen || st.busy) return
          const cat = s.items.find((i) => i.lineId === s.lastAdd?.lineId)?.category
          happyHop(els, cat === MUNCH_STOPS[st.parked]?.form)
        })

        api.current = {
          tap: () => {
            const stop = st.parked
            if (stop === null || st.busy) return
            st.busy = true
            syncIdle()
            tapJump(els, () => {
              st.busy = false
              onTapRef.current(stop)
            })
          },
        }

        return () => {
          attach(false)
          ScrollTrigger.removeEventListener('refresh', onRefresh)
          range.kill()
          obs.disconnect()
          ro.disconnect()
          unsub()
          window.removeEventListener('pointermove', onPointer)
          tl.forEach((t) => t.kill())
          api.current = null
        }
      })
    },
    { scope: root },
  )

  return api
}
