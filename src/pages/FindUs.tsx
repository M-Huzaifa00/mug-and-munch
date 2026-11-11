import { MapPin, MessageCircle, Navigation, Phone } from 'lucide-react'
import { addressLine, site } from '@/config/site'
import { formatPKR } from '@/lib/utils'
import { isWhatsappConfigured, whatsappLink, WHATSAPP_GREETING } from '@/lib/whatsapp'
import { Seo } from '@/components/layout/Seo'
import { Mascot } from '@/components/mascot/Mascot'
import { buttonClasses } from '@/components/ui/buttonClasses'
import { OpenBadge } from '@/components/ui/OpenBadge'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { HoursTable } from '@/sections/findus/HoursTable'
import { MapFacade } from '@/sections/findus/MapFacade'

/** /find-us: live open badge, address + notes, directions / call / WhatsApp, weekly hours, click-to-load map, delivery areas. */
export function FindUs() {
  const c = site.commerce
  const address = addressLine

  return (
    <>
      <Seo title="Find Us" description={`${site.brandName} in ${site.address.area}, ${site.address.city}: opening hours, directions, call or WhatsApp, and delivery areas.`} path="/find-us" />
      <section aria-labelledby="findus-page-title" className="grain bg-oat px-4 pt-28 pb-20 sm:px-6 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <p className="-rotate-2 font-hand text-2xl text-chili">pull up, yaar</p>
          <RevealHeading as="h1" id="findus-page-title" className="text-mega font-extrabold text-espresso">
            Find us
          </RevealHeading>
          <OpenBadge className="mt-3" />

          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-12">
            <div className="space-y-8">
              <div className="sticker relative mt-20 rounded-blob bg-cheese p-6 text-espresso">
                <Mascot mood="wave" className="absolute -top-[7.5rem] right-6 h-32" label="Munchy waving from the address card" />
                <p className="flex items-start gap-2 font-display text-xl font-extrabold">
                  <MapPin size={22} className="mt-1 shrink-0" aria-hidden="true" />
                  <span>{address}</span>
                </p>
                {site.addressNotes && <p className="mt-2 font-semibold">{site.addressNotes}</p>}
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses('primary', 'md')}>
                    <Navigation size={18} aria-hidden="true" /> Get directions
                  </a>
                  <a href={site.contact.phoneHref} className={buttonClasses('outline', 'md')}>
                    <Phone size={18} aria-hidden="true" /> Call
                  </a>
                  {isWhatsappConfigured() && (
                    <a href={whatsappLink(WHATSAPP_GREETING)} target="_blank" rel="noopener noreferrer" className={buttonClasses('outline', 'md')}>
                      <MessageCircle size={18} aria-hidden="true" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h2 className="font-display text-3xl font-extrabold text-espresso">Hours</h2>
                <div className="sticker mt-3 overflow-hidden rounded-3xl bg-oat">
                  <HoursTable />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <MapFacade />
              <div>
                <h2 className="font-display text-3xl font-extrabold text-espresso">We deliver to</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {site.deliveryAreas.map((a) => (
                    <li key={a} className="rounded-full border-2 border-espresso bg-pickle px-3 py-1 text-sm font-bold text-espresso">
                      {a}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-semibold text-ink">
                  Delivery {formatPKR(c.deliveryFee)}, free on orders of {formatPKR(c.freeDeliveryThreshold)} or more.
                  {c.minDeliveryOrder > 0 && ` Minimum delivery order ${formatPKR(c.minDeliveryOrder)}.`} Takeaway and dine-in have no delivery fee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
