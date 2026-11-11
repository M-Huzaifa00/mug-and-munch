import { site } from '@/config/site'
import { HERO_PHOTO } from '@/data/heroPhoto'

/** srcset for one format of the generated hero photo (npm run photos). */
export const heroSrcSet = (ext: 'avif' | 'webp') => HERO_PHOTO.widths.map((w) => `${HERO_PHOTO.base}-${w}.${ext} ${w}w`).join(', ')

/** Mid-size WebP for browsers that ignore <source>. */
export const HERO_FALLBACK_SRC = `${HERO_PHOTO.base}-${HERO_PHOTO.widths.at(-2) ?? HERO_PHOTO.widths[0]}.webp`

export const HERO_ALT = `${site.brandName} iced coffee and burger box on a rock at golden hour, Faisal Mosque and the Margalla Hills behind`
