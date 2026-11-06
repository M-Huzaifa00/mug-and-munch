import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { refreshScrollTriggersSoon } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { BurgerBuilder } from '../burger/BurgerBuilder'
import { CoffeeBuilder } from '../coffee/CoffeeBuilder'
import { SECTION_IDS } from '../sectionIds'
import { WrapBuilder } from '../wrap/WrapBuilder'
import { BuildTabs, type BuildTab } from './BuildTabs'

type Kind = 'burger' | 'coffee' | 'wrap'

/** Per-tab look: section background (category colour coding) + text colours. */
const TABS: (BuildTab<Kind> & { bg: string; text: string; note: string; noteText: string })[] = [
  { id: 'burger', label: 'Burger', emoji: '🍔', activeBg: 'bg-chili', activeText: 'text-espresso', bg: 'bg-espresso', text: 'text-oat', note: 'garma garam, fresh off the grill 🔥', noteText: 'text-cheese' },
  { id: 'coffee', label: 'Coffee', emoji: '☕', activeBg: 'bg-caramel', activeText: 'text-espresso', bg: 'bg-oat', text: 'text-espresso', note: 'study grind fuel ☕ mix yours', noteText: 'text-ink' },
  { id: 'wrap', label: 'Wrap', emoji: '🌯', activeBg: 'bg-espresso', activeText: 'text-oat', bg: 'bg-pickle', text: 'text-espresso', note: 'rolled tight, packed right 🌯', noteText: 'text-espresso' },
]
const PANEL_ID = 'build-studio-panel'

/**
 * One "build your own" section: tabs switch between the burger, coffee and wrap builders.
 * Only the active builder is rendered (conditional rendering); background crossfades per tab
 * via stacked opacity layers (no colour animation).
 */
export function BuildStudio() {
  const [active, setActive] = useState<Kind>('burger')
  const tab = TABS.find((t) => t.id === active) ?? TABS[0]!

  const change = (id: Kind) => {
    setActive(id)
    refreshScrollTriggersSoon(400) // section height changes with the builder
  }

  return (
    <section id={SECTION_IDS.build} aria-labelledby="build-title" className="grain relative overflow-hidden px-4 py-20 sm:px-6 md:py-28">
      {TABS.map((t) => (
        <span key={t.id} aria-hidden="true" className={cn('absolute inset-0 -z-10 transition-opacity duration-500', t.bg, t.id === active ? 'opacity-100' : 'opacity-0')} />
      ))}

      <div className="mx-auto max-w-6xl">
        <RevealHeading id="build-title" className={cn('text-display font-extrabold transition-colors duration-500', tab.text)}>
          Build your own
        </RevealHeading>
        <div className="mt-1 h-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={tab.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={cn('-rotate-1 font-hand text-2xl sm:text-3xl', tab.noteText)}
            >
              {tab.note}
            </motion.p>
          </AnimatePresence>
        </div>

        <BuildTabs tabs={TABS} active={active} onChange={change} panelId={PANEL_ID} className="mt-5" />

        <div role="tabpanel" id={PANEL_ID} aria-labelledby={`build-tab-${active}`} className="mt-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
              {active === 'burger' ? <BurgerBuilder /> : active === 'coffee' ? <CoffeeBuilder /> : <WrapBuilder />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
