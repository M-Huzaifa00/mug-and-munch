import { PagePlaceholder } from '@/components/layout/PagePlaceholder'
import { Seo } from '@/components/layout/Seo'

export function OurStory() {
  return (
    <>
      <Seo title="Our Story" description="How Mug & Munch became Islamabad's late-night coffee & smash spot." path="/our-story" />
      <PagePlaceholder kicker="from one mug to…" title="Our Story" emoji="📖" phase={5} />
    </>
  )
}
