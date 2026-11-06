import { ArrowUpRight, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router'
import { instagramUrl, site, tiktokUrl } from '@/config/site'
import { DAY_LABELS, formatDayHours, WEEK_ORDER } from '@/lib/hours'
import { whatsappLink, WHATSAPP_GREETING } from '@/lib/whatsapp'
import { OpenBadge } from '@/components/ui/OpenBadge'
import { Logo } from '@/components/brand/Logo'
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from '@/components/ui/SocialIcons'
import { FooterWordmark } from './FooterWordmark'
import { NAV_LINKS } from './navLinks'

const linkCls = 'inline-flex min-h-11 items-center gap-2 font-semibold text-oat/85 transition-colors hover:text-cheese'
const YEAR = new Date().getFullYear()

/** TODO (Phase 3): letter-by-letter scroll reveal on the giant wordmark. */
export function Footer() {
  return (
    <footer className="grain overflow-hidden bg-espresso text-oat">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="relative">
            <div className="flex items-start gap-4">
              <Logo variant="full" size={150} tone="light" className="-rotate-3" />
              <Logo variant="stamp" size={104} className="mt-16 hidden rotate-6 sm:inline-flex md:hidden lg:inline-flex" />
            </div>
            <p className="mt-6 font-display text-4xl font-extrabold tracking-tighter text-cheese">{site.tagline}</p>
            <p lang="ur" dir="rtl" className="mt-3 w-fit font-urdu text-2xl leading-[2.2] text-oat/90">
              {site.nameUrdu}
            </p>
            <p className="mt-2 max-w-xs text-oat/75">{site.heroLine}. Order karo, chill karo.</p>
            <div className="mt-5">
              <OpenBadge />
            </div>
          </div>

          <nav aria-label="Footer">
            <h2 className="mb-3 font-sans text-sm font-bold tracking-widest text-caramel uppercase">Explore</h2>
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/checkout" className={linkCls}>
                  Checkout
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="mb-3 font-sans text-sm font-bold tracking-widest text-caramel uppercase">Hours</h2>
            <dl className="space-y-1 text-sm">
              {WEEK_ORDER.map((d) => (
                <div key={d} className="flex justify-between gap-4">
                  <dt className="text-oat/70">{DAY_LABELS[d].slice(0, 3)}</dt>
                  <dd className="font-semibold">{formatDayHours(site.hours[d])}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="mb-3 font-sans text-sm font-bold tracking-widest text-caramel uppercase">Say hi</h2>
            <ul>
              <li>
                <a href={whatsappLink(WHATSAPP_GREETING)} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  <WhatsAppIcon size={18} /> WhatsApp
                </a>
              </li>
              <li>
                <a href={site.contact.phoneHref} className={linkCls}>
                  <Phone size={18} aria-hidden="true" /> {site.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  <InstagramIcon size={18} /> @{site.socials.instagram}
                </a>
              </li>
              <li>
                <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  <TikTokIcon size={18} /> TikTok
                </a>
              </li>
              <li>
                <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  <MapPin size={18} aria-hidden="true" /> {site.address.area}, {site.address.city}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <FooterWordmark />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-oat/15 px-4 py-6 text-sm text-oat/70 sm:flex-row sm:px-6">
        <p>
          © {YEAR} {site.brandName}. All rights munched.
        </p>
        <p>Made with ☕ in {site.address.city}</p>
      </div>
    </footer>
  )
}
