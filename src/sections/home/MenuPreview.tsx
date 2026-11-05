import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Category } from '@/data/menu'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { getPreviewItems } from '@/lib/menuFilter'
import { DUR, EASE, SPRING, STAGGER } from '@/lib/motion-presets'
import { ButtonLink } from '@/components/ui/Button'
import { HandArrow } from '@/components/ui/HandArrow'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { ProductCard } from '@/components/ui/ProductCard'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { Sticker } from '@/components/ui/Sticker'
import { MenuPreviewTabs } from './MenuPreviewTabs'

const TABS: Category[] = ['coffee', 'burger', 'wrap']
const PANEL_ID = 'menu-preview-panel'

/** Home "Kya khaoge aaj?" section: category tabs + 6 cards each + link to the full menu. */
export function MenuPreview() {
  const [tab, setTab] = useState<Category>('coffee')
  const items = useMemo(() => getPreviewItems(tab), [tab])
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)

  // Scroll-reveal for the first batch of cards + the hand-drawn arrow. Runs once.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        gsap.from('[data-reveal-card]', {
          y: 48,
          opacity: 0,
          duration: DUR.base,
          ease: EASE.out,
          stagger: STAGGER.cards,
          scrollTrigger: { trigger: gridRef.current, start: 'top 82%', once: true },
        })
        gsap.from('[data-draw]', {
          drawSVG: 0,
          duration: 1.1,
          ease: EASE.inOut,
          stagger: 0.35,
          scrollTrigger: { trigger: arrowRef.current, start: 'top 85%', once: true },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      aria-labelledby="menu-preview-title"
      className="grain relative overflow-hidden bg-cheese px-4 py-20 sm:px-6 md:py-28"
    >
      <Sticker kind="hot" className="top-6 right-4 sm:top-12 sm:right-[8%]" tilt={10} />
      <Sticker kind="sparkle" className="top-40 right-[38%] hidden lg:block" tilt={-14} />
      <Sticker kind="steam" className="bottom-10 left-[5%] hidden sm:block" tilt={-6} />

      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <RevealHeading id="menu-preview-title" className="text-display font-extrabold text-espresso">
            Kya khaoge aaj?
          </RevealHeading>
          <div className="mt-2 flex items-start gap-1">
            <p className="-rotate-2 font-hand text-2xl text-espresso sm:text-3xl">everything's made fresh, promise 🤞</p>
            <span ref={arrowRef} className="shrink-0">
              <HandArrow className="mt-3 h-14 w-20 sm:h-16 sm:w-24" />
            </span>
          </div>
        </div>

        <MenuPreviewTabs tabs={TABS} active={tab} onChange={setTab} panelId={PANEL_ID} className="mt-4" />

        <div
          ref={gridRef}
          role="tabpanel"
          id={PANEL_ID}
          aria-labelledby={`menu-tab-${tab}`}
          className="relative mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-6"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.85, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { ...SPRING.bouncy, delay: i * 0.05 } }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.18 } }}
              >
                <div data-reveal-card className="h-full">
                  <ProductCard item={item} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-12 flex justify-center">
          <MagneticButton>
            <ButtonLink to="/menu" size="lg">
              See full menu <span aria-hidden="true">→</span>
            </ButtonLink>
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
