import { site } from '@/config/site'
import { PagePlaceholder } from '@/components/layout/PagePlaceholder'
import { Seo } from '@/components/layout/Seo'

export function Deals() {
  return (
    <>
      <Seo title="Deals" description={`Student, midnight and duo combo deals at ${site.brandName} Islamabad.`} path="/deals" />
      <PagePlaceholder kicker="paisay bachao, pait bharo" title="Deals" emoji="💸" phase={5} className="bg-cheese" />
    </>
  )
}
