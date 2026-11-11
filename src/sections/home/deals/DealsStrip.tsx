import { useRef } from 'react'
import { Link } from 'react-router'
import { instagramUrl, site } from '@/config/site'
import { deals } from '@/data/deals'
import { gsap, MQ, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { buttonClasses } from '@/components/ui/buttonClasses'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { InstagramIcon } from '@/components/ui/SocialIcons'
import { SECTION_IDS } from '../sectionIds'
import { DealCard } from './DealCard'
import { DealsTicket } from './DealsTicket'

const BACKDROP = 'DEALS ✦ COMBOS ✦ DEALS ✦ COMBOS ✦ '

/**
 * Home deals section (sits where "What's your vibe?" was): bold chili stage with a giant drifting "DEALS ✦ COMBOS"
 * backdrop. No deals yet (data/deals.ts empty) → the golden-ticket teaser + honest copy + Follow / Order CTAs.
 * Real deals → the same stage shows them as DealCards (savings computed from real menu prices).
 * Motion: backdrop drift + ticket sheen, only while on screen. Reduced motion: static.
 */
export function DealsStrip() {
  const ref = useRef<HTMLElement>(null)
  const hasDeals = deals.length > 0

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        const drift = gsap.to('[data-backdrop]', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
        const loops: gsap.core.Tween[] = [drift]
        // The sheen only exists on the teaser ticket (no deals); with real deals there's nothing to sweep.
        if (ref.current?.querySelector('[data-sheen]')) loops.push(gsap.fromTo('[data-sheen]', { xPercent: 0 }, { xPercent: 500, duration: 1.4, ease: 'power2.inOut', repeat: -1, repeatDelay: 2.4 }))
        ScrollTrigger.create({ trigger: ref.current, start: 'top bottom', end: 'bottom top', onToggle: (self) => loops.forEach((t) => (self.isActive ? t.play() : t.pause())) })
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id={SECTION_IDS.deals} aria-labelledby="deals-title" className="grain relative overflow-hidden bg-chili px-4 py-20 sm:px-6 md:py-28">
      {/* giant drifting backdrop type (decorative) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden">
        <div data-backdrop className="flex w-max font-display text-[22vw] leading-none font-extrabold whitespace-nowrap text-espresso/10 md:text-[16vw]">
          <span>{BACKDROP}</span>
          <span>{BACKDROP}</span>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">
        <div>
          <p className="font-hand text-2xl text-espresso sm:text-3xl">paisay bachao, pait bharo 💸</p>
          <RevealHeading id="deals-title" className="text-display font-extrabold text-oat">
            {hasDeals ? 'Deals that hit different' : 'Deals are cooking'}
          </RevealHeading>
          <p className="mt-5 max-w-md text-lg font-semibold text-espresso">
            {hasDeals
              ? 'Real combos, savings worked out from our normal menu prices. No fake timers, ever.'
              : `Combos and deals are on the way. No fake "limited time" stuff, just real ones when they're ready. Follow ${site.brandName} to hear first.`}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {hasDeals ? (
              <Link to="/deals" className={buttonClasses('dark', 'lg')}>
                See all deals
              </Link>
            ) : (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses('dark', 'lg', 'whitespace-nowrap max-sm:px-5 max-sm:text-lg')}>
                <InstagramIcon size={22} /> Follow @{site.socials.instagram}
              </a>
            )}
            <Link to="/menu" className={buttonClasses('outline', 'lg')}>
              Order from the menu
            </Link>
          </div>
        </div>

        {hasDeals ? (
          <ul className="grid gap-8 sm:grid-cols-2">
            {deals.slice(0, 4).map((deal, i) => (
              <li key={deal.id}>
                <DealCard deal={deal} index={i} />
              </li>
            ))}
          </ul>
        ) : (
          <DealsTicket />
        )}
      </div>
    </section>
  )
}
