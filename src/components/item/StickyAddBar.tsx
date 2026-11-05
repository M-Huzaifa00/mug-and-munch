import { AnimatePresence, motion } from 'motion/react'
import { SPRING } from '@/lib/motion-presets'
import { cn, formatPKR } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { RollingNumber } from '@/components/ui/RollingNumber'

interface StickyAddBarProps {
  visible: boolean
  name: string
  total: number
  onAdd: () => void
  /** page = fixed to viewport (above mobile tab bar); modal = sticky inside the modal scroll area. */
  mode: 'page' | 'modal'
}

/** Appears when the main "Add to cart" button scrolls out of view. */
export function StickyAddBar({ visible, name, total, onAdd, mode }: StickyAddBarProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={SPRING.soft}
          className={cn(
            'z-30 px-3',
            mode === 'page'
              ? 'fixed inset-x-0 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] md:bottom-6'
              : 'sticky bottom-0 pt-2 pb-3',
          )}
        >
          <div className="glass sticker mx-auto flex max-w-xl items-center gap-3 rounded-full p-1.5 sm:pl-5">
            <span className="line-clamp-1 hidden flex-1 font-display font-extrabold text-espresso sm:block">{name}</span>
            <Button size="md" onClick={onAdd} className="w-full shrink-0 sm:w-auto">
              Add to cart · <RollingNumber value={total} format={formatPKR} />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
