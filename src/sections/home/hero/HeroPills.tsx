import { useRef, type ReactNode } from 'react'
import { BRAND_INK } from '@/lib/brand'
import { gsap, MQ, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import { MiniMunchy } from './MiniMunchy'

/** Pill shell: sized in em so it scales with the headline type; GSAP grows it open ([data-capsule] scaleX). */
const SHELL =
  'relative mx-[0.08em] inline-block h-[0.7em] w-[1.4em] overflow-hidden rounded-full border-[0.045em] border-espresso align-[0.04em] shadow-hard-sm'

/** Little heart, top-centre notch at (x, y). */
const heart = (x: number, y: number) => `M${x} ${y}c-2-3-7-3-7 1 0 3 4 5 7 8 3-3 7-5 7-8 0-4-5-4-7-1z`

/**
 * Shared pill: kawaii SVG scene (brand-ink lines like the mascot) + its own GSAP loop that only runs while the
 * pill is on screen; hovering speeds it up. Reduced motion: the static scene.
 */
function Pill({ className, build, children }: { className: string; build: (q: (s: string) => Element[]) => gsap.core.Animation[]; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        const anims = build(gsap.utils.selector(el))
        ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onToggle: (self) => anims.forEach((a) => (self.isActive ? a.play() : a.pause())) })
        const fast = () => anims.forEach((a) => a.timeScale(2.5))
        const normal = () => anims.forEach((a) => a.timeScale(1))
        el.addEventListener('pointerenter', fast)
        el.addEventListener('pointerleave', normal)
        return () => {
          el.removeEventListener('pointerenter', fast)
          el.removeEventListener('pointerleave', normal)
        }
      })
    },
    { scope: ref },
  )

  return (
    <span ref={ref} data-capsule aria-hidden="true" style={{ transformOrigin: 'left center' }} className={cn(SHELL, className)}>
      <svg
        viewBox="0 0 140 70"
        className="absolute inset-0 size-full"
        style={{ color: BRAND_INK }}
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  )
}


/**
 * SIP: mini Munchy, eyes shut in bliss, sips a kawaii iced coffee through a long bendy chili straw.
 * Coffee visibly flows along the straw (dash offset), his cheeks puff, hearts float up; the cup squishes.
 */
export function SipPill() {
  const straw = 'M38 16C42 0 88 -2 99 44'
  return (
    <Pill
      className="bg-caramel"
      build={(q) => {
        const flow = gsap.to(q('[data-flow]'), { strokeDashoffset: -40, duration: 1.1, ease: 'none', repeat: -1 })
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 })
        tl.to(q('[data-cup]'), { scaleX: 1.06, scaleY: 0.92, svgOrigin: '35 64', duration: 0.2, ease: 'power2.out' })
          .to(q('[data-cup]'), { scaleX: 1, scaleY: 1, svgOrigin: '35 64', duration: 0.5, ease: 'back.out(3)' })
          .to(q('[data-cheeks]'), { scale: 1.35, transformOrigin: '50% 50%', duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0)
          .fromTo(q('[data-heart]'), { y: 10, scale: 0.4, opacity: 0, transformOrigin: '50% 50%' }, { y: -16, scale: 1, keyframes: { opacity: [0, 1, 1, 0] }, duration: 1.4, stagger: 0.3, ease: 'sine.out' }, 0.1)
        return [flow, tl]
      }}
    >
      {/* bendy chili straw from the cup to the mini Munchy; oat dashes = coffee flowing */}
      <path d={straw} strokeWidth="6.5" />
      <path d={straw} className="stroke-chili" strokeWidth="3.4" />
      <path data-flow d={straw} className="stroke-oat" strokeWidth="1.6" strokeDasharray="3 7" />
      <g data-cup>
        <path d="M17 26c0-6 4-9 9-9h18c5 0 9 3 9 9z" className="fill-oat" strokeWidth="3" />
        <path d="M17 26h36l-4 34a4 4 0 0 1-4 4H25a4 4 0 0 1-4-4z" className="fill-oat" strokeWidth="3" />
        <path d="M20 46h30l-1 9H21z" className="fill-chili" strokeWidth="2.6" />
        <g stroke="none">
          <ellipse cx="29" cy="35" rx="2.4" ry="3" fill="currentColor" />
          <ellipse cx="41" cy="35" rx="2.4" ry="3" fill="currentColor" />
          <circle cx="29.8" cy="33.8" r="0.9" className="fill-oat" />
          <circle cx="41.8" cy="33.8" r="0.9" className="fill-oat" />
        </g>
        <path d="M32 40q3 3 6 0" strokeWidth="2" />
        <g className="fill-bubblegum" stroke="none" opacity="0.85">
          <ellipse cx="24" cy="40" rx="3" ry="1.8" />
          <ellipse cx="46" cy="40" rx="3" ry="1.8" />
        </g>
      </g>
      <MiniMunchy x={110} y={38} eyes="bliss" mouth="sip" />
      <path data-heart d={heart(128, 14)} className="fill-chili" strokeWidth="1.8" />
      <path data-heart d={heart(118, 6)} className="fill-oat" strokeWidth="1.8" />
    </Pill>
  )
}

/**
 * BITE: mini Munchy leans in and chomps a kawaii burger: mouth opens, CHOMP, the bun squishes, crumbs fly,
 * "nom!" pops, then he leans back chewing.
 */
export function BitePill() {
  return (
    <Pill
      className="bg-cheese"
      build={(q) => {
        const munchy = q('[data-munchy]')
        const mouth = q('[data-mouth-open]')
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.9 })
        tl.to(munchy, { x: -14, duration: 0.3, ease: 'power2.in' })
          .to(mouth, { opacity: 1, scaleY: 1.2, transformOrigin: '50% 50%', duration: 0.15 }, '<0.1')
          .to(mouth, { opacity: 0, duration: 0.06 })
          .to(q('[data-burger]'), { scaleY: 0.88, scaleX: 1.06, svgOrigin: '46 66', duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.out' }, '<')
          .fromTo(q('[data-crumb]'), { x: 0, y: 0, opacity: 1, scale: 1 }, { x: (i: number) => -6 - i * 5, y: (i: number) => [-12, 4, -6][i % 3] ?? 0, opacity: 0, scale: 0.6, duration: 0.5, ease: 'power2.out' }, '<')
          .fromTo(q('[data-nom]'), { scale: 0, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(3)' }, '<')
          .to(munchy, { x: 0, duration: 0.4, ease: 'back.out(2)' }, '+=0.05')
          .to(munchy, { y: -2.5, duration: 0.1, yoyo: true, repeat: 3, ease: 'sine.inOut' })
          .to(q('[data-nom]'), { opacity: 0, duration: 0.3 }, '<')
        return [tl]
      }}
    >
      <g data-burger>
        <path d="M20 52h52c3 0 5 2 5 5v1c0 4-3 7-7 7H22c-4 0-7-3-7-7v-1c0-3 2-5 5-5z" className="fill-caramel" strokeWidth="3" />
        <path d="M17 45h58a3.5 3.5 0 0 1 0 7H17a3.5 3.5 0 0 1 0-7z" fill="currentColor" strokeWidth="3" />
        <path d="M16 45c4-4 8 4 12 0s8 4 12 0 8 4 12 0 8 4 12 0 8 4 12 0" className="stroke-pickle" strokeWidth="3.2" />
        <path d="M16 42c0-16 14-26 30-26s30 10 30 26c0 2-2 3-4 3H20c-2 0-4-1-4-3z" className="fill-caramel" strokeWidth="3" />
        <g className="fill-oat" stroke="none">
          <ellipse cx="32" cy="24" rx="2.4" ry="1.4" transform="rotate(-20 32 24)" />
          <ellipse cx="46" cy="20" rx="2.4" ry="1.4" />
          <ellipse cx="60" cy="24" rx="2.4" ry="1.4" transform="rotate(20 60 24)" />
        </g>
        <g stroke="none">
          <ellipse cx="39" cy="32" rx="2.6" ry="3.2" fill="currentColor" />
          <ellipse cx="53" cy="32" rx="2.6" ry="3.2" fill="currentColor" />
          <circle cx="40" cy="30.8" r="1" className="fill-oat" />
          <circle cx="54" cy="30.8" r="1" className="fill-oat" />
        </g>
        <g className="fill-bubblegum" stroke="none" opacity="0.85">
          <ellipse cx="33" cy="37" rx="3" ry="1.8" />
          <ellipse cx="59" cy="37" rx="3" ry="1.8" />
        </g>
      </g>
      <g className="fill-caramel" strokeWidth="1.4">
        <circle data-crumb cx="80" cy="38" r="2.2" />
        <circle data-crumb cx="82" cy="44" r="1.7" />
        <circle data-crumb cx="79" cy="32" r="1.5" />
      </g>
      <g data-munchy>
        <MiniMunchy x={110} y={38} eyes="open" mouth="chomp" />
      </g>
      <text data-nom x="70" y="22" fill="currentColor" stroke="none" fontSize="14" fontWeight="700" opacity="0" className="font-hand" transform="rotate(-10 78 17)">
        nom!
      </text>
    </Pill>
  )
}
