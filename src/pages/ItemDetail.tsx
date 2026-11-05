import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { getItemBySlug } from '@/data/menu'
import { ItemDetailContent } from '@/components/item/ItemDetailContent'
import { Seo } from '@/components/layout/Seo'
import { NotFound } from './NotFound'

/** Full-page item view (direct links / refresh). In-site clicks open ItemModal instead. */
export function ItemDetail() {
  const { slug = '' } = useParams()
  const item = getItemBySlug(slug)
  if (!item) return <NotFound />

  return (
    <>
      <Seo title={item.name} description={item.description} path={`/menu/${item.slug}`} />
      <section className="grain bg-oat px-4 pt-28 pb-32 sm:px-6 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/menu"
            className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-full pr-3 font-bold text-espresso hover:underline"
          >
            <ArrowLeft size={18} aria-hidden="true" /> Back to menu
          </Link>
          <ItemDetailContent key={item.id} item={item} mode="page" />
        </div>
      </section>
    </>
  )
}
