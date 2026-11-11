import { site } from '@/config/site'
import { Mascot } from '@/components/mascot/Mascot'

/**
 * The "golden ticket" teaser shown while there are no deals yet: a cheese combo ticket (notched edges, dashed
 * tear line), "??? ✦ ???" instead of invented items/prices, a slowly spinning "COMING SOON" stamp, a sheen that
 * sweeps across ([data-sheen], animated by DealsStrip) and Munchy waving on top. Honest: nothing here is a deal.
 */
export function DealsTicket() {
  return (
    <div className="relative mx-auto w-full max-w-md pt-20 sm:pt-24">
      <div className="absolute top-0 right-6 z-10 sm:right-10">
        <Mascot mood="wave" className="h-28 sm:h-32" label="Munchy waving: deals are coming soon" />
      </div>

      <div data-ticket className="relative rotate-[-3deg] rounded-[1.75rem] border-[3px] border-espresso bg-cheese text-espresso shadow-hard-lg">
        {/* notches: the section colour "cuts" the ticket edges */}
        <span aria-hidden="true" className="absolute top-[58%] -left-4 size-8 rounded-full border-[3px] border-espresso bg-chili" />
        <span aria-hidden="true" className="absolute top-[58%] -right-4 size-8 rounded-full border-[3px] border-espresso bg-chili" />
        <div className="relative overflow-hidden rounded-[1.6rem]">
          <span data-sheen aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-oat/70 to-transparent" />
          <div className="px-6 pt-6 pb-5 sm:px-8">
            <p className="text-xs font-extrabold tracking-[0.3em] uppercase">{site.brandName} · Combo</p>
            <p className="mt-3 font-display text-5xl leading-none font-extrabold tracking-tight sm:text-6xl">
              ??? <span className="text-chili">✦</span> ???
            </p>
            <p className="mt-2 font-hand text-2xl">something tasty is being cooked up</p>
          </div>
          <div className="mx-6 border-t-[3px] border-dashed border-espresso/50 sm:mx-8" />
          <div className="flex items-center justify-between gap-4 px-6 pt-4 pb-6 sm:px-8">
            <div>
              <p className="text-xs font-extrabold tracking-[0.25em] uppercase opacity-70">Price</p>
              <p className="font-display text-3xl font-extrabold">Rs ???</p>
            </div>
            <span className="flex size-24 shrink-0 animate-stamp-spin items-center justify-center rounded-full border-[3px] border-dashed border-espresso bg-bubblegum text-center font-display text-sm leading-tight font-extrabold uppercase">
              coming
              <br />
              soon
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
