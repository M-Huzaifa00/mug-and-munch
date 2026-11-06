import { site } from '@/config/site'
import { visibleReviews } from '@/data/reviews'
import { buttonClasses } from '@/components/ui/buttonClasses'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { LogoStamp } from '@/components/brand/LogoStamp'
import { InstaGrid } from './InstaGrid'
import { ReviewsBoard } from './ReviewsBoard'

/**
 * Social proof. Placeholder reviews only render in development (labelled "sample");
 * production shows a "be the first" card until the owner adds real reviews.
 */
export function Reviews() {
  const reviews = visibleReviews()
  const allSamples = reviews.length > 0 && reviews.every((r) => r.isPlaceholder)

  return (
    <section aria-labelledby="reviews-title" className="grain relative overflow-hidden bg-espresso px-4 py-20 text-oat sm:px-6 md:py-28">
      <LogoStamp size={110} className="absolute top-8 right-4 -rotate-12 sm:right-10" />
      <div className="mx-auto max-w-6xl">
        <RevealHeading id="reviews-title" className="text-display max-w-[80%] font-extrabold text-oat">
          What Islamabad says
        </RevealHeading>
        <p className="mt-1 -rotate-1 font-hand text-2xl text-cheese sm:text-3xl">grab a sticker, toss it around ✋</p>
        {allSamples && (
          <p className="mt-3 inline-block rounded-full bg-cheese px-3 py-1 text-xs font-bold text-espresso">
            Sample reviews (dev only). Real reviews replace these before launch.
          </p>
        )}

        <div className="mt-10">
          {reviews.length > 0 ? (
            <ReviewsBoard reviews={reviews} />
          ) : (
            <div className="sticker mx-auto max-w-md rounded-blob bg-cheese p-6 text-center text-espresso">
              <p className="font-display text-2xl font-extrabold">Reviews coming soon ⭐</p>
              <p className="mt-1">Tried us already? Tell Islamabad what you think.</p>
              <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses('primary', 'sm', 'mt-4')}>
                Leave a review on Google
              </a>
            </div>
          )}
        </div>

        <InstaGrid />
      </div>
    </section>
  )
}
