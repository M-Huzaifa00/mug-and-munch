import { buttonClasses } from '@/components/ui/buttonClasses'
import { OpenBadge } from '@/components/ui/OpenBadge'
import { PagePlaceholder } from '@/components/layout/PagePlaceholder'
import { Seo } from '@/components/layout/Seo'
import { site } from '@/config/site'

export function FindUs() {
  return (
    <>
      <Seo title="Find Us" description={`Mug & Munch location, hours and directions in ${site.address.area}, Islamabad.`} path="/find-us" />
      <PagePlaceholder kicker="pull up, yaar" title="Find Us" emoji="📍" phase={5}>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <OpenBadge />
          <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses('dark', 'md')}>
            Get directions
          </a>
        </div>
      </PagePlaceholder>
    </>
  )
}
