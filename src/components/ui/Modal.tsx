import { useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useScrollLock } from '@/hooks/useScrollLock'
import { SPRING } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'

interface ModalProps {
  onClose: () => void
  /** id of the element that names the dialog. */
  labelledBy: string
  children: ReactNode
  className?: string
}

/**
 * Dialog shell. Mount it inside <AnimatePresence> conditionally: `{open && <Modal …/>}`.
 * Focus trap + Esc, scroll lock, backdrop click closes, own scroll area with data-lenis-prevent.
 * Mobile: bottom sheet. md+: centred card.
 */
export function Modal({ onClose, labelledBy, children, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  useFocusTrap(panelRef, true, onClose)
  useScrollLock(true)

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-espresso/65 backdrop-blur-[3px]"
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
        initial={{ y: 80, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.98 }}
        transition={SPRING.soft}
        className={cn(
          'relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-blob border-[2.5px] border-espresso bg-oat shadow-hard-lg outline-none',
          'md:max-h-[88dvh] md:max-w-4xl md:rounded-blob',
          className,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="sticker absolute top-3 right-3 z-20 flex size-11 items-center justify-center rounded-full bg-oat text-espresso transition-transform hover:rotate-90"
        >
          <X size={20} strokeWidth={2.8} aria-hidden="true" />
        </button>
        <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </motion.div>
    </div>,
    document.body,
  )
}
