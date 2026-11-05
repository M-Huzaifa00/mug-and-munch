import { useRef, type ReactNode } from 'react'
import { DUR, EASE } from '@/lib/motion-presets'
import { gsap, MQ, SplitText, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

interface RevealHeadingProps {
  as?: 'h1' | 'h2' | 'h3'
  id?: string
  className?: string
  children: ReactNode
}

/**
 * Section heading that reveals line by line on scroll (SplitText, masked lines sliding up).
 * Reduced motion: renders static, fully visible.
 */
export function RevealHeading({ as: Tag = 'h2', id, className, children }: RevealHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOk, () => {
        const split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 115,
              rotate: 3,
              duration: DUR.slow,
              ease: EASE.out,
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }),
        })
        return () => split.revert()
      })
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} id={id} className={cn(className)}>
      {children}
    </Tag>
  )
}
