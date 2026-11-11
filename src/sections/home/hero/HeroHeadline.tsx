import { useRef } from 'react'
import { MUNCH_SIZE_CLASS } from '@/data/munchRun'
import { gsap, MQ, SplitText, useGSAP } from '@/lib/gsap'
import { DUR, EASE, STAGGER } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { MunchStop } from '@/components/munchRun/MunchStop'
import { BitePill, SipPill } from './HeroPills'

const WORDS = [
  { text: 'SIP.', ink: 'stroke-caramel', className: 'text-espresso', after: 'sip' },
  { text: 'BITE.', ink: 'stroke-chili', className: 'text-chili', after: 'bite' },
  { text: 'REPEAT.', ink: 'stroke-pickle', className: 'text-espresso', after: 'munch' },
] as const

/**
 * "SIP. (sipping coffee) BITE. (chomping burger) REPEAT. (burger)": cartoon-typography.
 * Intro (when `play`): chars pop in with an elastic stagger, the pills grow open, underlines draw (DrawSVG).
 * The pills animate themselves (HeroPills: sip / chomp loops, faster on hover, paused off-screen).
 * Desktop extras: letters hop on hover; SIP and BITE drift apart on scroll (REPEAT. stays still: it holds
 * the Munch Run Stop 1 anchor, which must not move while the burger is parked).
 * Reduced motion: static, pills open, underlines drawn.
 */
export function HeroHeadline({ play }: { play: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add({ motion: MQ.motionOk, fine: MQ.finePointer, desktop: MQ.desktop }, (ctx) => {
        const { motion, fine, desktop } = ctx.conditions as { motion: boolean; fine: boolean; desktop: boolean }
        if (!motion) return
        const split = SplitText.create(el.querySelectorAll('[data-word]'), { type: 'chars' })
        const lines = el.querySelectorAll('[data-underline]')
        const capsules = el.querySelectorAll('[data-capsule]')
        const ready = { intro: !play }
        gsap.set(split.chars, { yPercent: 115, rotate: 12, opacity: 0 })
        gsap.set(capsules, { scaleX: 0 })
        gsap.set(lines, { drawSVG: '0%' })
        if (play) {
          gsap
            .timeline({ delay: 0.05, onComplete: () => {
                ready.intro = true
              }, })
            .to(split.chars, { yPercent: 0, rotate: 0, opacity: 1, duration: DUR.hero, ease: EASE.elastic, stagger: STAGGER.chars })
            .to(capsules, { scaleX: 1, duration: DUR.slow, ease: EASE.snappy, stagger: 0.12 }, 0.35)
            .to(lines, { drawSVG: '100%', duration: DUR.base, ease: EASE.out, stagger: 0.15 }, '-=0.9')
        }

        if (desktop) {
          const st = { trigger: el, start: 'top 30%', end: 'bottom top', scrub: true }
          gsap.to('[data-unit="0"]', { xPercent: -6, ease: 'none', scrollTrigger: st })
          gsap.to('[data-unit="1"]', { xPercent: 8, ease: 'none', scrollTrigger: st })
        }

        // Letters hop when hovered (after the intro; y is separate from the intro's yPercent).
        const offs: (() => void)[] = []
        if (fine) {
          for (const ch of split.chars as HTMLElement[]) {
            const hop = () => {
              if (!ready.intro || gsap.isTweening(ch)) return
              gsap.fromTo(ch, { y: 0 }, { y: '-0.12em', duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 })
            }
            ch.addEventListener('pointerenter', hop)
            offs.push(() => ch.removeEventListener('pointerenter', hop))
          }
        }
        return () => {
          offs.forEach((off) => off())
          split.revert()
        }
      })
    },
    { scope: ref, dependencies: [play], revertOnUpdate: true },
  )

  return (
    <h1 ref={ref} className="text-mega font-extrabold md:text-[clamp(4.5rem,8.6vw,9.5rem)]">
      {WORDS.map((w, i) => (
        <span key={w.text} data-unit={i} className="mr-[0.14em] inline-block whitespace-nowrap last:mr-0">
          <span className="relative inline-block">
            <span data-word className={cn('inline-block overflow-hidden pb-[0.06em] align-bottom', w.className)}>
              {w.text}
            </span>
            <svg aria-hidden="true" viewBox="0 0 200 20" preserveAspectRatio="none" className={cn('absolute -bottom-[0.04em] left-0 h-[0.16em] w-full fill-none', w.ink)}>
              {/* espresso outline under the colour stroke so light tokens (pickle) still read on oat */}
              <path data-underline d="M4 13c38-8 78-9 118-5s54 5 74-2" strokeWidth="11" strokeLinecap="round" className="stroke-espresso" />
              <path data-underline d="M4 13c38-8 78-9 118-5s54 5 74-2" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </span>
          {w.after === 'munch' ? (
            <span aria-hidden="true" className={cn('relative ml-[0.1em] inline-block align-middle', MUNCH_SIZE_CLASS)}>
              <MunchStop stop={1} />
            </span>
          ) : w.after === 'sip' ? (
            <SipPill />
          ) : (
            <BitePill />
          )}
        </span>
      ))}
    </h1>
  )
}
