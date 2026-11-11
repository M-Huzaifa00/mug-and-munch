import { Link, useLocation } from 'react-router'
import { getItemBySlug, isPriced, type MenuItem } from '@/data/menu'
import { modalStateFrom } from '@/lib/routing'
import { cn, formatPKR } from '@/lib/utils'
import { SketchArt } from './SketchArt'

/** Hand-written notes pinned to the drawing: REAL items, real price or "price coming soon". Positions in % of the art. */
const NOTES: { slug: string; pos: string }[] = [
  { slug: 'spanish-latte', pos: 'left-0 top-[1%] sm:-left-[2%]' },
  { slug: 'smash-beast', pos: 'right-[2%] top-[2%] text-right sm:right-[6%]' },
  { slug: 'jalapeno-jolt', pos: 'right-[8%] top-[93%] text-right' },
]

const notes = NOTES.flatMap((n) => {
  const item = getItemBySlug(n.slug)
  return item ? [{ ...n, item }] : []
})

function Note({ item, pos }: { item: MenuItem; pos: string }) {
  const location = useLocation()
  return (
    <Link
      data-sk-note
      to={`/menu/${item.slug}`}
      state={modalStateFrom(location)}
      className={cn('group absolute flex min-h-11 flex-col justify-center leading-none', pos)}
    >
      <span className="font-hand text-2xl text-espresso decoration-chili decoration-2 underline-offset-4 group-hover:underline sm:text-[1.75rem]">{item.name}</span>
      <span className="mt-1 font-display text-xs font-extrabold tracking-wide text-chili uppercase sm:text-sm">
        {isPriced(item) ? formatPKR(item.price) : 'Price coming soon'}
      </span>
    </Link>
  )
}

/** Right side of the new hero: the live sketch + its notes. Animated by HeroNew (one GSAP scope). */
export function HeroSketch() {
  return (
    <div className="relative mx-auto w-full max-w-xl pt-14 pb-10 sm:pt-16">
      <div data-sk-art className="relative">
        <SketchArt />
        {notes.map((n) => (
          <Note key={n.slug} item={n.item} pos={n.pos} />
        ))}
      </div>
    </div>
  )
}
