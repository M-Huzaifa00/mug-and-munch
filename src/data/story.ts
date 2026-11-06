/**
 * Our Story content. NO invented facts: no founding year, awards, owner names or "since 20XX".
 * Owner facts below render ONLY when filled in. Everything else is honest, generic brand copy the
 * owner can edit freely.
 */
import type { Category } from './menu'
import type { StickerKind } from '@/components/ui/Sticker'

export const STORY_FACTS = {
  foundedYear: '', // TODO: owner fills (e.g. "2023"); shown as "Brewing since …" only when set
  founders: '', // TODO: owner fills (e.g. "Ali & Sara"); shown only when set
  origin: '', // TODO: owner fills (one or two lines about how it started); shown only when set
} as const

export const STORY_INTRO = {
  kicker: 'our story',
  line: 'Good coffee, smash burgers and wraps, for Islamabad nights.',
  sub: 'We started with a simple idea: the late-night food you actually crave, made properly, at prices that make sense. Students, night owls, office crews, first dates. Pull up a chair.',
}

export interface StoryPanel {
  id: Category
  title: string
  body: string
  /** Background token class + text rules (espresso on light tokens). */
  bg: string
  image: string
  emoji: string
  sticker: StickerKind
  doodle: string
}

export const STORY_PANELS: StoryPanel[] = [
  {
    id: 'coffee',
    title: 'Coffee that keeps up',
    body: 'Lattes, Spanish lattes, cold brew and the rest. Made your way: size, milk, hot or iced, extra shot, sweetness. Study grind fuel, basically.',
    bg: 'bg-caramel',
    image: '/images/coffee/spanish-latte.webp',
    emoji: '☕',
    sticker: 'steam',
    doodle: 'one more shot? 👀',
  },
  {
    id: 'burger',
    title: 'Smashed, not stacked lazy',
    body: 'Beef pressed onto a hot grill for crispy edges, cheese melted right on top, soft bun, house sauce. Or build your own, layer by layer.',
    bg: 'bg-chili',
    image: '/images/burgers/classic-smash.webp',
    emoji: '🍔',
    sticker: 'hot',
    doodle: 'garma garam 🔥',
  },
  {
    id: 'wrap',
    title: 'Wraps for the road',
    body: 'Tikka, malai boti, crispy chicken or paneer, rolled with crunchy veg and the sauces you pick. Easy to eat on the go, hard to share.',
    bg: 'bg-pickle',
    image: '/images/wraps/build-your-own.webp',
    emoji: '🌯',
    sticker: 'new',
    doodle: 'lapet ke kha lo 🌯',
  },
]

/** "How we make it". Owner: edit to match your kitchen exactly. */
export const STORY_STEPS = [
  { emoji: '📝', title: 'You choose', body: 'Pick from the menu or craft your own coffee, burger or wrap.' },
  { emoji: '💬', title: 'We confirm', body: 'Your order lands with us on WhatsApp and we confirm it there.' },
  { emoji: '🔥', title: 'We make it', body: 'Brewed, smashed and rolled after you order.' },
  { emoji: '🛵', title: 'You munch', body: 'Delivered, ready at the counter, or brought to your table.' },
]

/** Photo slots: drop real photos at these paths (styled fallbacks until then). */
export const STORY_PHOTOS = [
  { image: '/images/brand/kitchen.webp', label: 'The kitchen', emoji: '👩‍🍳' },
  { image: '/images/brand/team.webp', label: 'The crew', emoji: '🙌' },
  { image: '/images/brand/counter.webp', label: 'The counter', emoji: '☕' },
]
