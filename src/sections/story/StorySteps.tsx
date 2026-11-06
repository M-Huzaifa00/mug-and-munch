import { useRef } from 'react'
import { STORY_STEPS } from '@/data/story'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { EASE } from '@/lib/motion-presets'

/** "How we make it": steps joined by a hand-drawn connector that draws itself on scroll (DrawSVG). */
export function StorySteps() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        gsap.fromTo('[data-connector]', { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', scrollTrigger: { trigger: '[data-steps]', start: 'top 75%', end: 'bottom 60%', scrub: 0.6 } })
        gsap.from('[data-step]', { y: 30, opacity: 0, duration: 0.5, stagger: 0.12, ease: EASE.out, scrollTrigger: { trigger: '[data-steps]', start: 'top 75%', once: true } })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="story-how" className="grain bg-espresso px-4 py-16 text-oat sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 id="story-how" className="text-display font-extrabold text-oat">
          How we make it
        </h2>
        <p className="-rotate-1 font-hand text-2xl text-cheese">order karo, chill karo</p>
        <div data-steps className="relative mt-10">
          {/* Connector: vertical on mobile, horizontal on desktop. */}
          <svg aria-hidden="true" className="absolute top-0 left-4 h-full w-6 overflow-visible md:hidden" viewBox="0 0 24 400" preserveAspectRatio="none" fill="none">
            <path data-connector d="M12 0 C 24 60, 0 120, 12 200 S 24 340, 12 400" className="stroke-cheese" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <svg aria-hidden="true" className="absolute top-7 left-0 hidden h-6 w-full overflow-visible md:block" viewBox="0 0 1000 24" preserveAspectRatio="none" fill="none">
            <path data-connector d="M40 12 C 200 -8, 300 32, 500 12 S 800 -8, 960 12" className="stroke-cheese" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <ol className="relative grid gap-8 md:grid-cols-4">
            {STORY_STEPS.map((s, i) => (
              <li key={s.title} data-step className="flex gap-4 md:flex-col">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-[2.5px] border-oat bg-cheese text-2xl shadow-hard-oat" aria-hidden="true">
                  {s.emoji}
                </span>
                <div>
                  <p className="font-display text-sm font-extrabold tracking-widest text-cheese uppercase">Step {i + 1}</p>
                  <h3 className="font-display text-2xl font-extrabold text-oat">{s.title}</h3>
                  <p className="mt-1 text-oat/85">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
