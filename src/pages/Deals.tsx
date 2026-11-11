import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { site } from '@/config/site'
import { DEAL_TYPE_LABELS, deals, getDealSavings, type DealType } from '@/data/deals'
import { SPRING } from '@/lib/motion-presets'
import { formatPKR } from '@/lib/utils'
import { Seo } from '@/components/layout/Seo'
import { Mascot } from '@/components/mascot/Mascot'
import { Chip } from '@/components/ui/Chip'
import { ButtonLink } from '@/components/ui/Button'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { Sticker } from '@/components/ui/Sticker'
import { DealCard } from '@/sections/home/deals/DealCard'

type Filter = DealType | 'all'
const TYPES = [...new Set(deals.map((d) => d.type))]
const BEST = Math.max(0, ...deals.map(getDealSavings))

/** /deals: every combo with real savings, filter chips (Motion layout grid), honest Karachi-time windows. */
export function Deals() {
  const [filter, setFilter] = useState<Filter>('all')
  const shown = filter === 'all' ? deals : deals.filter((d) => d.type === filter)

  return (
    <>
      <Seo
        title="Deals"
        description={deals.length ? `Combo deals at ${site.brandName} Islamabad. Real savings, no gimmicks.` : `Deals at ${site.brandName} Islamabad are coming soon. Browse the full menu meanwhile.`}
        path="/deals"
      />
      <section aria-labelledby="deals-page-title" className="grain relative overflow-hidden bg-cheese px-4 pt-28 pb-20 sm:px-6 md:pt-36">
        <Sticker kind="sparkle" className="top-28 right-[12%] hidden md:block" tilt={12} />
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <RevealHeading as="h1" id="deals-page-title" className="text-mega font-extrabold text-espresso">
                Deals
              </RevealHeading>
              <p className="-rotate-1 font-hand text-2xl text-espresso sm:text-3xl">Paise bachao, pet bharo 💸</p>
              {BEST > 0 && <p className="mt-2 font-semibold text-espresso">Save up to {formatPKR(BEST)} vs ordering separately.</p>}
            </div>
            <Mascot mood="idle" reactive className="h-32 shrink-0 sm:h-44" label="Munchy cheering for deals" />
          </div>

          {deals.length === 0 ? (
            <div className="sticker mt-10 max-w-xl rounded-blob bg-oat p-6 text-espresso">
              <p className="font-display text-3xl font-extrabold">Deals are coming soon 🎁</p>
              <p className="mt-2 text-ink">No combos right now, and we won't fake one. The full menu is open though.</p>
              <ButtonLink to="/menu" size="md" className="mt-5">
                See the menu
              </ButtonLink>
            </div>
          ) : (
          <>
          <div role="group" aria-label="Filter deals" className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {(['all', ...TYPES] as Filter[]).map((t) => (
              <Chip key={t} active={filter === t} layoutId="deal-filter" activeBg="bg-espresso" activeText="text-oat" onClick={() => setFilter(t)}>
                {t === 'all' ? 'All deals' : DEAL_TYPE_LABELS[t]}
              </Chip>
            ))}
          </div>

          <motion.ul layout className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((deal, i) => (
                <motion.li key={deal.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={SPRING.soft}>
                  <DealCard deal={deal} index={i} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
          <p className="mt-10 text-sm font-semibold text-espresso/80">Savings are worked out from our normal menu prices. Deal windows are Islamabad time.</p>
          </>
          )}
        </div>
      </section>
    </>
  )
}
