import type { ReactNode, RefObject } from 'react'
import { CATEGORY_META, type MenuItem } from '@/data/menu'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { ProductImage } from '@/components/ui/ProductImage'

interface ItemIntroProps {
  item: MenuItem
  mode: 'page' | 'modal'
  imageRef?: RefObject<HTMLDivElement | null>
  /** Price line, options, add button (or the "coming soon" note) under the description. */
  children: ReactNode
}

/** Shared item layout (modal + full page): image + note, category chip, badges, name, description, then children. */
export function ItemIntro({ item, mode, imageRef, children }: ItemIntroProps) {
  const meta = CATEGORY_META[item.category]
  const Heading = mode === 'page' ? 'h1' : 'h2'

  return (
    <div className={cn('grid gap-6 md:grid-cols-2 md:gap-8', mode === 'modal' ? 'p-4 pt-4 md:p-6' : '')}>
      <div className="relative">
        <div
          ref={imageRef}
          className={cn('overflow-hidden rounded-blob border-[2.5px] border-espresso shadow-hard', mode === 'modal' ? 'aspect-[4/3] md:aspect-square' : 'aspect-square')}
        >
          <ProductImage name={item.name} emoji={item.emoji} image={item.image} category={item.category} priority={mode === 'page'} />
        </div>
        {item.note && <p className="sticker absolute -bottom-4 left-4 -rotate-3 rounded-full bg-oat px-4 py-1 font-hand text-xl text-ink">{item.note}</p>}
      </div>

      <div className="flex flex-col gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn('rounded-full border-2 border-espresso px-2.5 py-0.5 text-xs font-extrabold uppercase', meta.bg, meta.text)}>
            {meta.emoji} {meta.label}
          </span>
          {item.badges.map((b) => (
            <Badge key={b} kind={b} />
          ))}
        </div>
        <Heading id="item-title" className="pr-12 font-display text-4xl font-extrabold text-espresso md:text-5xl">
          {item.name}
        </Heading>
        <p className="text-lg text-ink">{item.description}</p>
        {children}
      </div>
    </div>
  )
}
