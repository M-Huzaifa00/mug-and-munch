import { MapPin, Phone } from 'lucide-react'
import { site } from '@/config/site'
import { formatDayHours, getTodayKey } from '@/lib/hours'
import { buttonClasses } from '@/components/ui/buttonClasses'
import { OpenBadge } from '@/components/ui/OpenBadge'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { LogoStamp } from '@/components/brand/LogoStamp'
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
          className="sticker group relative block aspect-square overflow-hidden rounded-blob bg-pickle/40"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 [background-image:linear-gradient(var(--color-oat)_10px,transparent_10px),linear-gradient(90deg,var(--color-oat)_10px,transparent_10px)] [background-size:90px_90px] [background-position:22px_30px]"
          />
          <span aria-hidden="true" className="absolute top-[38%] left-[-10%] h-5 w-[120%] -rotate-12 bg-cheese" />
          <span className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center transition-transform duration-300 ease-bouncy group-hover:-translate-y-[110%]">
            <span className="sticker rounded-full bg-oat px-3 py-1 font-display font-extrabold whitespace-nowrap text-espresso">{site.address.area}</span>
            <MapPin size={56} className="fill-chili text-espresso" aria-hidden="true" />
          </span>
          <LogoStamp size={100} className="absolute right-4 bottom-4 rotate-6" />
        </a>
      </div>
    </section>
  )
}
