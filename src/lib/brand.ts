/**
 * Brand ink (logo maroon) = CSS variable defined once in src/styles/brand.css from locked tokens.
 * Mascot / illustration line work only: style={{ color: BRAND_INK }} + fill/stroke="currentColor".
 */
export const BRAND_INK = 'var(--brand-ink)'

export type BrandAssetKind = 'full' | 'icon' | 'wordmark'

const PREFIX: Record<BrandAssetKind, string> = { full: 'logo', icon: 'logo-icon', wordmark: 'logo-wordmark' }

export const brandSrc = (kind: BrandAssetKind, height: 64 | 128 | 256 | 512) => `/brand/${PREFIX[kind]}-${height}.webp`
