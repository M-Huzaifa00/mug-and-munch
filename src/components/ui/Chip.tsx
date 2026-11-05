import type { ButtonHTMLAttributes, Ref } from 'react'
import { motion } from 'motion/react'
import { SPRING } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean
  /** Background class when active (e.g. a category colour). */
  activeBg?: string
  /** Text class when active (must pass contrast on activeBg). */
  activeText?: string
  /** Shared layoutId → the active fill slides between chips. */
  layoutId?: string
  ref?: Ref<HTMLButtonElement>
}

/** Pill chip / toggle. Pass role="tab" + aria-selected for tabs; otherwise aria-pressed is set. */
export function Chip({
  active,
  activeBg = 'bg-espresso',
  activeText = 'text-oat',
  layoutId,
  className,
  children,
  type = 'button',
  ref,
  ...rest
}: ChipProps) {
  const isTab = rest.role === 'tab'
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={isTab ? undefined : active}
      className={cn(
        'relative isolate inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border-[2.5px] border-espresso px-4 font-bold whitespace-nowrap',
        'transition-[box-shadow,scale] duration-200 active:scale-95',
        active ? 'shadow-hard-sm' : 'bg-oat text-espresso hover:bg-espresso/10',
        active && !layoutId && activeBg,
        className,
      )}
      {...rest}
    >
      {active && layoutId && (
        <motion.span
          layoutId={layoutId}
          transition={SPRING.snappy}
          aria-hidden="true"
          className={cn('absolute inset-0 -z-10 rounded-full', activeBg)}
        />
      )}
      <span className={cn('inline-flex items-center gap-1.5', active ? activeText : 'text-espresso')}>{children}</span>
    </button>
  )
}
