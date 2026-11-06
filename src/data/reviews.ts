// PLACEHOLDER — replace with real reviews
/**
 * Owner: paste REAL customer reviews here (with permission), e.g. from Google Maps / Instagram,
 * then set `isPlaceholder: false`. Placeholder reviews are only shown in development builds
 * (labelled "sample") and are never shown as real reviews on the production site.
 */

export interface Review {
  id: string
  /** First name only. */
  name: string
  /** Islamabad sector / area, e.g. "F-7". */
  area: string
  text: string
  rating: 1 | 2 | 3 | 4 | 5
  source: 'google' | 'instagram' | 'in-store'
  emoji: string
  isPlaceholder: boolean
}

export const reviews: Review[] = [
  { id: 'r1', name: 'Ali', area: 'F-7', text: 'Spanish latte at 1 AM after a deadline? Lifesaver.', rating: 5, source: 'google', emoji: '☕', isPlaceholder: true },
  { id: 'r2', name: 'Hira', area: 'G-11', text: 'The double smash has those crispy edges. Yaar, ek aur!', rating: 5, source: 'instagram', emoji: '🍔', isPlaceholder: true },
  { id: 'r3', name: 'Usman', area: 'E-11', text: 'Tikka wrap was garma garam and actually filling.', rating: 5, source: 'google', emoji: '🌯', isPlaceholder: true },
  { id: 'r4', name: 'Zara', area: 'F-10', text: 'Cute spot, good vibes, perfect for study sessions.', rating: 4, source: 'in-store', emoji: '📚', isPlaceholder: true },
  { id: 'r5', name: 'Hamza', area: 'Blue Area', text: 'Desi Hot means desi hot. Respect. 🌶️', rating: 5, source: 'instagram', emoji: '🔥', isPlaceholder: true },
  { id: 'r6', name: 'Mahnoor', area: 'DHA', text: 'Pistachio latte is my whole personality now.', rating: 5, source: 'google', emoji: '💚', isPlaceholder: true },
]

/** Reviews safe to display: real ones always; placeholders only in development. */
export const visibleReviews = (): Review[] => reviews.filter((r) => !r.isPlaceholder || import.meta.env.DEV)
