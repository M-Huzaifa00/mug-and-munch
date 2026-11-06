import { site } from '@/config/site'
import { ButtonLink } from '@/components/ui/Button'
import { Logo } from '@/components/brand/Logo'
import { Seo } from '@/components/layout/Seo'
import { Mascot } from '@/components/mascot/Mascot'

/** Order confirmation. Full flow (order number, details) arrives in Phase 5. */
export function OrderSuccess() {
  return (
    <>
      <Seo title="Order placed" description={`Your ${site.brandName} order is confirmed.`} path="/order-success" />
      <section className="grain flex min-h-[80dvh] flex-col items-center justify-center bg-pickle px-4 pt-28 pb-16 text-center">
        <div className="flex items-end gap-4">
          <Mascot mood="dance" className="h-48" label="Munchy doing a happy dance" />
          <Logo variant="icon" size={96} tone="light" alt="" className="rotate-6" />
        </div>
        <p className="mt-6 font-hand text-3xl text-espresso">We've got it!</p>
        <h1 className="text-display mt-2 font-extrabold text-espresso">Garma garam on the way</h1>
        <p className="mt-3 text-espresso">Order details and tracking arrive with checkout in Phase 5.</p>
        <ButtonLink to="/menu" size="lg" variant="outline" className="mt-8">
          Back to the menu
        </ButtonLink>
      </section>
    </>
  )
}
