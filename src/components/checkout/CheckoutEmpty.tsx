import { Mascot } from '@/components/mascot/Mascot'
import { ButtonLink } from '@/components/ui/Button'
import { CraftLinks } from '@/components/layout/cart/CraftLinks'

/** Empty cart on /checkout: never render an empty form. */
export function CheckoutEmpty() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-16 text-center">
      <Mascot mood="sad" className="h-44" label="Munchy looking sad at an empty cart" />
      <h1 className="font-display text-3xl font-extrabold text-espresso">Cart khaali hai… pehle kuch order toh karo 😅</h1>
      <ButtonLink to="/menu" size="md" className="mt-2">
        Browse menu
      </ButtonLink>
      <p className="mt-2 text-sm font-semibold text-ink/80">or craft your own</p>
      <CraftLinks />
    </div>
  )
}
