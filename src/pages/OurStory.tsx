import { Link } from 'react-router'
import { site } from '@/config/site'
import { STORY_FACTS, STORY_INTRO, STORY_PHOTOS } from '@/data/story'
import { Seo } from '@/components/layout/Seo'
import { Mascot } from '@/components/mascot/Mascot'
import { LogoStamp } from '@/components/brand/LogoStamp'
import { ButtonLink } from '@/components/ui/Button'
import { ProductImage } from '@/components/ui/ProductImage'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { StoryPanels } from '@/sections/story/StoryPanels'
import { StorySteps } from '@/sections/story/StorySteps'

/** /our-story: intro → coffee / burgers / wraps panels → how we make it → photo slots → Munchy + CTAs. No invented facts. */
export function OurStory() {
  const facts = [STORY_FACTS.foundedYear && `Brewing since ${STORY_FACTS.foundedYear}`, STORY_FACTS.founders && `Started by ${STORY_FACTS.founders}`].filter(Boolean)

  return (
    <>
      <Seo title="Our Story" description={`${site.brandName}: coffee, smash burgers and wraps for Islamabad nights. How we make it, and who we make it for.`} path="/our-story" />

      <section aria-labelledby="story-title" className="grain relative overflow-hidden bg-oat px-4 pt-28 pb-16 sm:px-6 md:pt-36 md:pb-24">
        <LogoStamp size={120} className="absolute! top-24 right-6 hidden md:inline-flex" />
        <div className="mx-auto max-w-5xl">
          <p className="-rotate-2 font-hand text-2xl text-chili">{STORY_INTRO.kicker}</p>
          <RevealHeading as="h1" id="story-title" className="text-display max-w-4xl font-extrabold text-espresso">
            {STORY_INTRO.line}
          </RevealHeading>
          <p className="mt-5 max-w-2xl text-lg text-ink">{STORY_INTRO.sub}</p>
          {STORY_FACTS.origin && <p className="mt-4 max-w-2xl text-lg font-semibold text-ink">{STORY_FACTS.origin}</p>}
          {facts.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {facts.map((f) => (
                <li key={f} className="rounded-full border-2 border-espresso bg-cheese px-3 py-1 text-sm font-bold text-espresso">
                  {f}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-6 font-display text-2xl font-extrabold text-espresso">{site.tagline}</p>
        </div>
      </section>

      <StoryPanels />
      <StorySteps />

      <section aria-labelledby="story-photos" className="grain bg-oat px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 id="story-photos" className="text-display font-extrabold text-espresso">
            Behind the counter
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {STORY_PHOTOS.map((p, i) => (
              <li key={p.image} className={i % 2 ? 'sm:translate-y-6' : ''}>
                <figure className="sticker overflow-hidden rounded-3xl bg-oat">
                  <div className="aspect-[4/5]">
                    <ProductImage name={p.label} emoji={p.emoji} image={p.image} category={i === 1 ? 'burger' : 'coffee'} showName={false} />
                  </div>
                  <figcaption className="border-t-2 border-espresso px-4 py-2 font-hand text-xl text-espresso">{p.label}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="story-cta" className="grain bg-cheese px-4 py-16 text-center sm:px-6 md:py-20">
        <Mascot mood="wave" className="mx-auto h-44" label="Munchy waving hello" />
        <h2 id="story-cta" className="text-display mt-4 font-extrabold text-espresso">
          Bhook lagi? We got you.
        </h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink to="/menu" size="lg">
            See the menu
          </ButtonLink>
          <Link to="/#craft-burger" className="inline-flex min-h-11 items-center font-display text-lg font-extrabold text-espresso underline decoration-2 underline-offset-4">
            or craft your own →
          </Link>
        </div>
      </section>
    </>
  )
}
