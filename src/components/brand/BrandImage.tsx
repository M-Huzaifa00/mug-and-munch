import { brandSrc, type BrandAssetKind } from '@/lib/brand'
import { cn } from '@/lib/utils'
import { BRAND_ASPECT, BRAND_HEIGHTS } from './brandAssets'

interface BrandImageProps {
  kind: BrandAssetKind
  /** Rendered height in CSS px. */
  height: number
  alt: string
  priority?: boolean
  className?: string
}

/** Responsive WebP of a logo crop with exact width/height (no layout shift). */
export function BrandImage({ kind, height, alt, priority, className }: BrandImageProps) {
  const aspect = BRAND_ASPECT[kind]
  const width = Math.round(height * aspect)
  const srcSet = BRAND_HEIGHTS.map((h) => `${brandSrc(kind, h)} ${Math.round(h * aspect)}w`).join(', ')
  const fallback = BRAND_HEIGHTS.find((h) => h >= height * 2) ?? 512

  return (
    <img
      src={brandSrc(kind, fallback)}
      srcSet={srcSet}
      sizes={`${width}px`}
      width={width}
      height={height}
      alt={alt}
      draggable={false}
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={cn('block shrink-0 select-none', className)}
      style={{ height, width }}
    />
  )
}
