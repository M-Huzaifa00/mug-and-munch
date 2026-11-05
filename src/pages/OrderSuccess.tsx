import { PagePlaceholder } from '@/components/layout/PagePlaceholder'
import { Seo } from '@/components/layout/Seo'

export function OrderSuccess() {
  return (
    <>
      <Seo title="Order placed" description="Your Mug & Munch order is confirmed." path="/order-success" />
      <PagePlaceholder kicker="We've got it!" title="Garma garam on the way" emoji="🎉" phase={5} className="bg-pickle" />
    </>
  )
}
