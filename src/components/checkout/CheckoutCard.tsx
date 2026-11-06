import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Numbered checkout step card (1 How · 2 Details · 3 Payment · 4 Review). */
export function CheckoutCard({ step, title, id, className, children }: { step: number; title: string; id: string; className?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className={cn('rounded-3xl border-[2.5px] border-espresso bg-oat p-4 shadow-hard sm:p-5', className)}>
      <h2 id={id} className="mb-4 flex items-center gap-3 font-display text-xl font-extrabold text-espresso sm:text-2xl">
        <span aria-hidden="true" className="flex size-9 shrink-0 -rotate-6 items-center justify-center rounded-full border-2 border-espresso bg-cheese text-base">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}
