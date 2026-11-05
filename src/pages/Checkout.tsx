import { PagePlaceholder } from '@/components/layout/PagePlaceholder'
import { Seo } from '@/components/layout/Seo'

export function Checkout() {
  return (
    <>
      <Seo title="Checkout" description="Checkout your Mug & Munch order: delivery, takeaway or dine-in." path="/checkout" />
      <PagePlaceholder kicker="almost there" title="Checkout" emoji="🛵" phase={5} />
    </>
  )
}
