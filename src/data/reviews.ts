/**
 * PLACEHOLDER REVIEWS — owner replaces with REAL customer reviews (with permission),
 * e.g. copied from Google Maps or Instagram. While `isPlaceholder` is true, the UI
 * labels them as samples so the live site never shows invented testimonials as real.
 */

export interface Review {
  id: string
  author: string
  text: string
  rating: 1 | 2 | 3 | 4 | 5
  source: 'google' | 'instagram' | 'in-store'
  emoji: string
  isPlaceholder: boolean
}

export const reviews: Review[] = [
  { id: 'r1', author: 'Sample review', text: 'Spanish latte at 1 AM after a deadline? Lifesaver.', rating: 5, source: 'google', emoji: '☕', isPlaceholder: true },
  { id: 'r2', author: 'Sample review', text: 'The double smash has those crispy edges. Yaar, ek aur!', rating: 5, source: 'instagram', emoji: '🍔', isPlaceholder: true },
  { id: 'r3', author: 'Sample review', text: 'Tikka wrap was garma garam and actually filling.', rating: 5, source: 'google', emoji: '🌯', isPlaceholder: true },
  { id: 'r4', author: 'Sample review', text: 'Cute spot, good vibes, perfect for study sessions.', rating: 4, source: 'in-store', emoji: '📚', isPlaceholder: true },
  { id: 'r5', author: 'Sample review', text: 'Desi Hot means desi hot. Respect. 🌶️', rating: 5, source: 'instagram', emoji: '🔥', isPlaceholder: true },
]
