import { site } from '@/config/site'
import { cn } from '@/lib/utils'
import { ButtonLink } from '@/components/ui/Button'
import { Seo } from '@/components/layout/Seo'
import { MenuPreview } from '@/sections/home/MenuPreview'

/** Placeholder bands for sections built in Phases 3 + 4 (see claude.mind.md). */
const UPCOMING: { name: string; line: string; bg: string; text: string; phase: number }[] = [
  { name: 'Marquee strip', line: 'Yaar, ek aur?', bg: 'bg-espresso', text: 'text-oat', phase: 3 },
  { name: 'Bestsellers', line: 'the ones everyone orders 👀', bg: 'bg-oat', text: 'text-espresso', phase: 3 },
  { name: 'Build Your Burger', line: 'Garma garam, fresh off the grill', bg: 'bg-espresso', text: 'text-oat', phase: 4 },
  { name: 'Coffee Lab', line: 'Study grind fuel ☕', bg: 'bg-oat', text: 'text-espresso', phase: 4 },
  { name: 'Wrap It Up', line: 'Rolled tight, packed right', bg: 'bg-pickle', text: 'text-espresso', phase: 4 },
  { name: "What's Your Vibe?", line: 'Mood batao, food lo', bg: 'bg-espresso', text: 'text-oat', phase: 4 },
  { name: 'Deals', line: 'Late-night munchies sorted', bg: 'bg-cheese', text: 'text-espresso', phase: 3 },
  { name: 'Find Us', line: 'Order karo, chill karo', bg: 'bg-oat', text: 'text-espresso', phase: 3 },
]

export function Home() {
  return (
    <>
      <Seo
        description="Mug & Munch: Islamabad's late-night coffee & smash spot. Lattes, smash burgers and wraps for delivery, takeaway or dine-in."
        path="/"
      />

      {/* TODO (Phase 3): replace with the full Hero section. */}
      <section className="grain flex min-h-dvh flex-col justify-center bg-oat px-4 pt-28 pb-16 sm:px-6">
        <div className="mx-auto w-full max-w-7xl">
          <p className="font-hand text-3xl text-ink sm:text-4xl">Bhook lagi? We got you.</p>
          <h1 className="text-mega mt-2 font-extrabold text-espresso">
            SIP. <span className="text-chili">BITE.</span>
            <br />
            REPEAT.
          </h1>
          <p className="mt-6 max-w-md text-lg font-medium text-ink">{site.heroLine}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/menu" size="lg">
              Order Now
            </ButtonLink>
            <ButtonLink to="/menu" size="lg" variant="outline">
              See the Menu
            </ButtonLink>
          </div>
        </div>
      </section>

      <MenuPreview />

      {UPCOMING.map((s) => (
        <section key={s.name} className={cn('grain px-4 py-24 sm:px-6 md:py-32', s.bg, s.text)}>
          <div className="mx-auto max-w-7xl">
            <p className="font-hand text-3xl">{s.line}</p>
            <h2 className="text-display mt-2 font-extrabold">{s.name}</h2>
            <p className="mt-6 inline-block rounded-full border-2 border-current px-4 py-1.5 text-sm font-bold">
              Coming in Phase {s.phase}
            </p>
          </div>
        </section>
      ))}
    </>
  )
}
