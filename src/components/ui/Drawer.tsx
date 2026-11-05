import { useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, useDragControls } from 'motion/react'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useScrollLock } from '@/hooks/useScrollLock'
import { SPRING } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'

interface DrawerProps {
  onClose: () => void
  labelledBy: string
  children: ReactNode
  className?: string
}

/**
 * Side panel (md+, slides from the right) / bottom sheet (mobile, drag the handle down to close).
 * Mount inside <AnimatePresence>. Children own the inner layout; mark scroll areas data-lenis-prevent.
 */
export function Drawer({ onClose, labelledBy, children, className }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const dragControls = useDragControls()
  useFocusTrap(panelRef, true, onClose)
  useScrollLock(true)

  const hidden = isDesktop ? { x: '100%' } : { y: '100%' }

  return createPortal(
    <div className="fixed inset-0 z-[70]">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-espresso/60 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        initial={hidden}
        animate={{ x: 0, y: 0 }}
        exit={hidden}
        transition={SPRING.soft}
        drag={isDesktop ? false : 'y'}
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 600) onClose()
        }}
        className={cn(
          'absolute inset-x-0 bottom-0 flex max-h-[90dvh] flex-col overflow-hidden rounded-t-blob border-[2.5px] border-b-0 border-espresso bg-oat outline-none',
          'md:inset-y-3 md:right-3 md:left-auto md:max-h-none md:w-[440px] md:rounded-blob md:border-b-[2.5px] md:shadow-hard-lg',
          className,
        )}
      >
        {!isDesktop && (
          <div
            onPointerDown={(e) => dragControls.start(e)}
            className="flex h-6 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
            aria-hidden="true"
          >
            <span className="h-1.5 w-12 rounded-full bg-espresso/30" />
          </div>
        )}
        {children}
      </motion.div>
    </div>,
    document.body,
  )
}
