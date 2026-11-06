import { ButtonLink } from '@/components/ui/Button'
import { Logo } from '@/components/brand/Logo'
import { Seo } from '@/components/layout/Seo'
import { Munchy } from '@/components/mascot/Munchy'

/** TODO (Phase 3, after mascot approval): swap Munchy for <Mascot mood="guilty" />. */
export function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="This page got munched." path="/404" />
      <section className="grain flex min-h-[80dvh] flex-col items-center justify-center bg-oat px-4 pt-28 pb-16 text-center">
        <div className="flex items-end gap-4">
          <Munchy mood="oops" className="h-36 w-32" />
          <Logo variant="icon" size={88} alt="" className="-rotate-6" />
        </div>
        <p className="mt-6 font-hand text-3xl text-ink">oops… sorry yaar</p>
        <h1 className="text-display mt-2 font-extrabold text-espresso">This page got munched 🍔</h1>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/menu" size="lg">
            See the Menu
          </ButtonLink>
          <ButtonLink to="/" size="lg" variant="outline">
            Go home
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
