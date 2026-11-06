import { MapPin } from 'lucide-react'
import { site } from '@/config/site'
import { LogoStamp } from '@/components/brand/LogoStamp'

/** Lightweight stylised map art (no embed): grid streets, a main road, the pin with the area. Fills its parent. */
export function StylisedMap({ hoverLift = false }: { hoverLift?: boolean }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-pickle/40 [background-image:linear-gradient(var(--color-oat)_10px,transparent_10px),linear-gradient(90deg,var(--color-oat)_10px,transparent_10px)] [background-size:90px_90px] [background-position:22px_30px]"
      />
      <span aria-hidden="true" className="absolute top-[38%] left-[-10%] h-5 w-[120%] -rotate-12 bg-cheese" />
      <span
        aria-hidden="true"
        className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center transition-transform duration-300 ease-bouncy ${hoverLift ? 'group-hover:-translate-y-[110%]' : ''}`}
      >
        <span className="sticker rounded-full bg-oat px-3 py-1 font-display font-extrabold whitespace-nowrap text-espresso">{site.address.area}</span>
        <MapPin size={56} className="fill-chili text-espresso" />
      </span>
      <LogoStamp size={100} className="absolute! right-4 bottom-4 rotate-6" />
    </>
  )
}
