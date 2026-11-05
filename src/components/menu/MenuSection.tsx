import { AnimatePresence, motion } from 'motion/react'
import { CATEGORY_META, type Category, type MenuItem } from '@/data/menu'
import { SPRING } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/ui/ProductCard'
import { sectionId } from './menuIds'

/** One category block on /menu. Cards animate in/out with Motion layout when filters change. */
export function MenuSection({ category, items }: { category: Category; items: MenuItem[] }) {
  const meta = CATEGORY_META[category]
  const id = sectionId(category)

  return (
    <motion.section layout="position" transition={SPRING.soft} id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="flex items-center gap-3 font-display text-3xl font-extrabold text-espresso sm:text-4xl">
        <span
          aria-hidden="true"
          className={cn('flex size-12 items-center justify-center rounded-full border-[2.5px] border-espresso text-2xl shadow-hard-sm', meta.bg)}
        >
          {meta.emoji}
        </span>
        {meta.label}
        <span className="text-base font-bold text-ink/70">({items.length})</span>
      </h2>
      <div className="relative mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.15 } }}
              transition={SPRING.soft}
            >
              <ProductCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
