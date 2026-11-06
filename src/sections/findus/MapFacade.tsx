import { useState } from 'react'
import { MapPinned } from 'lucide-react'
import { site } from '@/config/site'
import { Button } from '@/components/ui/Button'
import { StylisedMap } from '@/components/ui/StylisedMap'

const EMBED = `https://www.google.com/maps?q=${site.address.lat},${site.address.lng}&z=16&output=embed`

/** Click-to-load map: the stylised map until "Load map" is tapped, then the Google Maps iframe (no third-party load before). */
export function MapFacade() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="sticker relative aspect-square overflow-hidden rounded-blob bg-oat md:aspect-[4/5]">
      {loaded ? (
        <iframe title={`Map showing ${site.brandName} in ${site.address.area}, ${site.address.city}`} src={EMBED} className="absolute inset-0 size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <>
          <StylisedMap />
          <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-espresso/40 to-transparent p-5 pt-16">
            <Button variant="dark" size="md" onClick={() => setLoaded(true)}>
              <MapPinned size={20} aria-hidden="true" /> Load map
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
