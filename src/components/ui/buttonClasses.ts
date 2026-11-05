import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'cheese' | 'outline' | 'dark' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * Shared button styling (also for <a> tags that must look like buttons).
 * Contrast rule: oat-on-chili is 3:1 → only valid for LARGE bold text (>= 19px bold).
 * So `primary` md/lg use oat text at 19px+, while `primary` sm switches to espresso text.
 */
export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string): string {
  return cn(
    'inline-flex select-none items-center justify-center gap-2 rounded-full font-display font-extrabold tracking-tight',
    'border-[2.5px] border-espresso transition-[translate,scale,box-shadow] duration-150 ease-snappy',
    'hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:scale-[0.97] active:shadow-none',
    'disabled:pointer-events-none disabled:opacity-50',
    {
      sm: 'min-h-11 px-4 text-sm',
      md: 'min-h-12 px-6 text-[1.1875rem]',
      lg: 'min-h-14 px-8 text-[1.3125rem]',
    }[size],
    {
      primary: cn('bg-chili shadow-hard hover:shadow-hard-lg', size === 'sm' ? 'text-espresso' : 'text-oat'),
      cheese: 'bg-cheese text-espresso shadow-hard-oat hover:shadow-hard-oat',
      outline: 'bg-oat text-espresso shadow-hard hover:shadow-hard-lg',
      dark: 'bg-espresso text-oat shadow-hard hover:shadow-hard-lg',
      ghost: 'border-transparent bg-transparent text-current shadow-none hover:translate-x-0 hover:translate-y-0',
    }[variant],
    className,
  )
}
