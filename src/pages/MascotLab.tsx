import { Logo } from '@/components/brand/Logo'
import { Mascot } from '@/components/mascot/Mascot'
import { MASCOT_MOODS } from '@/components/mascot/mascotPoses'
import { Seo } from '@/components/layout/Seo'

/** DEV-ONLY review page (route only registered when import.meta.env.DEV). */
export function MascotLab() {
  return (
    <>
      <Seo title="Mascot lab" description="Internal review page." path="/mascot-lab" />
      <div className="grain bg-oat px-4 pt-28 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-16">
          <header>
            <p className="font-hand text-3xl text-ink">dev only · not shipped</p>
            <h1 className="text-display font-extrabold text-espresso">Mascot lab</h1>
            <p className="mt-3 max-w-2xl text-lg text-ink">
              Does this look like your brand? Anything to change? Static poses only; animation comes after you approve.
            </p>
          </header>

          <section aria-labelledby="cmp" className="sticker rounded-blob bg-oat p-6">
            <h2 id="cmp" className="font-display text-3xl font-extrabold text-espresso">Your logo ↔ the mascot</h2>
            <div className="mt-6 flex flex-wrap items-end justify-center gap-10">
              <figure className="text-center">
                <Logo variant="full" size={320} />
                <figcaption className="mt-2 font-hand text-2xl text-ink">your logo</figcaption>
              </figure>
              <figure className="text-center">
                <Mascot mood="wave" className="h-80" label="Mascot, signature wink" />
                <figcaption className="mt-2 font-hand text-2xl text-ink">mascot · signature wink</figcaption>
              </figure>
              <figure className="text-center">
                <Mascot mood="idle" className="h-80" label="Mascot, idle" />
                <figcaption className="mt-2 font-hand text-2xl text-ink">mascot · idle (both eyes, for blinking)</figcaption>
              </figure>
            </div>
          </section>

          <section aria-labelledby="moods">
            <h2 id="moods" className="font-display text-3xl font-extrabold text-espresso">All 9 moods (static poses)</h2>
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {MASCOT_MOODS.map((mood) => (
                <li key={mood} className="sticker flex flex-col items-center rounded-blob bg-oat p-3">
                  <Mascot mood={mood} className="h-36" label={`Mascot ${mood}`} />
                  <span className="mt-1 font-display font-extrabold text-espresso">{mood}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="logos">
            <h2 id="logos" className="font-display text-3xl font-extrabold text-espresso">Logo system</h2>
            <div className="mt-6 flex flex-wrap items-center gap-8 rounded-blob bg-oat p-6">
              <Logo variant="full" size={160} />
              <Logo variant="icon" size={110} />
              <Logo variant="wordmark" size={60} />
              <Logo variant="horizontal" size={56} />
              <Logo variant="stamp" size={150} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-8 rounded-blob bg-espresso p-6">
              <Logo variant="full" size={160} tone="light" />
              <Logo variant="icon" size={90} tone="light" />
              <Logo variant="wordmark" size={48} tone="light" />
              <Logo variant="stamp" size={150} />
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
