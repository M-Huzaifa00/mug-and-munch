import { useEffect, useRef, useState, type ReactNode } from 'react'

interface LazyMountProps {
  children: ReactNode
  /** Space reserved before mounting (avoids layout jumps). */
  minHeight: string
  /** Start loading this far before the placeholder reaches the viewport. */
  rootMargin?: string
  /** Mount immediately (e.g. a #craft-* deep link points here). */
  eager?: boolean
  /** id on the placeholder so anchors work before mount. */
  id?: string
  className?: string
}

/** Mounts children only when the placeholder nears the viewport (IntersectionObserver). */
export function LazyMount({ children, minHeight, rootMargin = '300px', eager = false, id, className }: LazyMountProps) {
  const [seen, setSeen] = useState(false)
  const show = seen || eager
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (show || !el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [show, rootMargin])

  if (show) return <>{children}</>
  return <div ref={ref} id={id} aria-hidden="true" className={className} style={{ minHeight }} />
}
