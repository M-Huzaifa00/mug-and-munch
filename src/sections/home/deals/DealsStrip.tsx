import { deals } from '@/data/deals'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { Sticker } from '@/components/ui/Sticker'
import { Mascot } from '@/components/mascot/Mascot'
import { SECTION_IDS } from '../sectionIds'
import { DealCard } from './DealCard'

/** Cheese combo strip. Savings always computed from real menu prices (data/deals.ts). Hidden while there are no deals. */
export function DealsStrip() {
  if (deals.length === 0) return null
  return (
    <section id={SECTION_IDS.deals} aria-labelledby="deals-title" className="grain relative overflow-hidden bg-cheese px-4 py-20 sm:px-6 md:py-28">
      <Sticker kind="sparkle" className="top-10 left-[46%] hidden md:block" tilt={-10} />
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <RevealHeading id="deals-title" className="text-display font-extrabold text-espresso">
              Deals that hit different
            </RevealHeading>
            <p className="mt-1 -rotate-1 font-hand text-2xl text-espresso sm:text-3xl">paisay bachao, pait bharo 💸</p>
          </div>
          <Mascot mood="idle" reactive className="hidden h-36 shrink-0 sm:block lg:h-44" label="Munchy cheering for deals" />
        </div>
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {deals.map((deal, i) => (
            <li key={deal.id}>
              <DealCard deal={deal} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
