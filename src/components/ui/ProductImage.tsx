import { useState } from 'react'
import photos from 'virtual:photos'
import { CATEGORY_META, type Category } from '@/data/menu'
import { cn } from '@/lib/utils'

interface ProductImageProps {
  name: string
  emoji: string
  image: string
  category: Category | 'deal'
  size?: 'lg' | 'sm'
  showName?: boolean
  priority?: boolean
  className?: string
}

const DEAL_GRADIENT = 'bg-linear-to-br from-cheese via-cheese/70 to-chili/40'

/**
 * Real photo when one exists in public/images (see `virtual:photos`), otherwise a styled
 * fallback: category gradient + big emoji + handwritten name. Never requests missing files.
 */
export function ProductImage({ name, emoji, image, category, size = 'lg', showName = true, priority, className }: ProductImageProps) {
  const src = photos[image.replace(/\.[a-z0-9]+$/i, '')]
  const [failed, setFailed] = useState(false)

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        width={800}
        height={600}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onError={() => setFailed(true)}
        className={cn('size-full object-cover', className)}
      />
    )
  }

  const gradient = category === 'deal' ? DEAL_GRADIENT : CATEGORY_META[category].gradient
  return (
    <div role="img" aria-label={name} className={cn('relative flex size-full flex-col items-center justify-center overflow-hidden', gradient, className)}>
      <span aria-hidden="true" className="absolute -top-6 -left-6 size-24 rounded-full bg-oat/35 blur-xl" />
      <span aria-hidden="true" className="absolute -right-8 -bottom-10 size-32 rounded-full bg-cheese/40 blur-2xl" />
      <span
        aria-hidden="true"
        className={cn(
          'relative leading-none drop-shadow-[3px_4px_0_var(--color-espresso)] transition-transform duration-500 ease-bouncy group-hover:scale-110 group-hover:-rotate-6',
          size === 'lg' ? 'text-[clamp(2.75rem,11vw,5rem)]' : 'text-3xl',
        )}
      >
        {emoji}
      </span>
      {showName && size === 'lg' && (
        <span aria-hidden="true" className="relative mt-1 line-clamp-1 px-2 text-center font-hand text-xl leading-tight text-espresso sm:text-2xl">
          {name}
        </span>
      )}
    </div>
  )
}
