import { MapPin, Phone } from 'lucide-react'
import { site } from '@/config/site'
import { formatDayHours, getTodayKey } from '@/lib/hours'
import { buttonClasses } from '@/components/ui/buttonClasses'
import { OpenBadge } from '@/components/ui/OpenBadge'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { StylisedMap } from '@/components/ui/StylisedMap'
import { Mascot } from '@/components/mascot/Mascot'
import { SECTION_IDS } from './sectionIds'

/** Live open/closed (Asia/Karachi, after-midnight aware), today's hours, address, directions + call. */
export function FindUsTeaser() {
  const today = formatDayHours(site.hours[getTodayKey()])

  return (
    <section id={SECTION_IDS.findUs} aria-labelledby="findus-title" className="grain relative overflow-hidden bg-oat px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <RevealHeading id="findus-title" className="text-display font-extrabold text-espresso">
            Pull up, yaar
          </RevealHeading>
          <p className="mt-1 -rotate-1 font-hand text-2xl text-ink sm:text-3xl">late-night munchies sorted 🌙</p>

          <div className="sticker relative mt-24 rounded-blob bg-cheese p-6 text-espresso">
            {/* Munchy sits on the address card */}
            <Mascot mood="idle" className="absolute -top-[7.5rem] right-6 h-32" label="Munchy sitting on the address card" />
            <OpenBadge />
            <p className="mt-4 text-sm font-bold tracking-widest uppercase">Today</p>
            <p className="font-display text-3xl font-extrabold">{today}</p>
            <p className="mt-4 flex items-start gap-2 font-semibold">
              <MapPin size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                {site.address.line1}, {site.address.area}, {site.address.city}
              </span>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses('primary', 'md')}>
                Get directions
              </a>
              <a href={site.contact.phoneHref} className={buttonClasses('outline', 'md')}>
                <Phone size={18} aria-hidden="true" /> Call us
              </a>
            </div>
          </div>
        </div>

        {/* Stylised map placeholder (no heavy embed; links to Google Maps) */}
        <a
          href={site.address.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${site.brandName} on Google Maps (opens in new tab)`}
          className="sticker group relative block aspect-square overflow-hidden rounded-blob"
        >
          <StylisedMap hoverLift />
        </a>
      </div>
    </section>
  )
}
