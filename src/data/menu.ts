/**
 * Menu data: the café's real list (from Syed Ahmed, 2026-11-07; Starters added 2026-11-11). Owner-editable.
 * - `price: null` = the owner hasn't given a price yet → the site shows "Price coming soon" and the item
 *   can't be added to the cart. Fill the number in to make it orderable. (TODO(owner): every null below.)
 * - Descriptions only state what the list says (patties, shape, flavour); no invented ingredients or claims.
 * Images live in /public/images/<folder>/<slug>.webp; until real photos exist the UI shows a styled fallback.
 */

export type Category = 'coffee' | 'matcha' | 'drinks' | 'starters' | 'burger' | 'steak' | 'wrap'
export type Badge = 'bestseller' | 'new' | 'spicy' | 'veg'
export type SpiceLevel = 'mild' | 'medium' | 'desi-hot'

export interface OptionChoice {
  id: string
  label: string
  /** Added to base price (PKR). */
  priceDelta: number
}

export interface ItemOptions {
  sizes?: OptionChoice[]
  temps?: OptionChoice[]
  milks?: OptionChoice[]
  extras?: OptionChoice[]
  /** Sweetness levels in % (coffee). Default level = SWEETNESS_DEFAULT. */
  sweetness?: readonly number[]
}

export const SWEETNESS_LEVELS = [0, 25, 50, 75, 100] as const
export const SWEETNESS_DEFAULT = 50

export interface MenuItem {
  id: string
  slug: string
  name: string
  category: Category
  /** PKR. null = price not given yet → "Price coming soon", not orderable. */
  price: number | null
  description: string
  image: string
  emoji: string
  badges: Badge[]
  options: ItemOptions
  spiceLevels?: SpiceLevel[]
  isVeg: boolean
  /** Handwritten Caveat doodle note (optional). */
  note?: string
  /** Shown in the Home "Our picks" strip (owner's choice, not a popularity claim). */
  featured?: boolean
}

/** A menu item that has a price, i.e. can go in the cart. */
export type PricedItem = MenuItem & { price: number }
export const isPriced = (item: MenuItem): item is PricedItem => item.price !== null

/* ---------- Option sets (only what the menu list states) ---------- */
/** Flavoured lattes: HOT / COLD / BLENDED, same price. */
const HOT_COLD_BLENDED: OptionChoice[] = [
  { id: 'hot', label: 'Hot', priceDelta: 0 },
  { id: 'cold', label: 'Cold', priceDelta: 0 },
  { id: 'blended', label: 'Blended', priceDelta: 0 },
]
const FLAVOURED: ItemOptions = { temps: HOT_COLD_BLENDED }

const FOLDER: Record<Category, string> = {
  coffee: 'coffee',
  matcha: 'drinks',
  drinks: 'drinks',
  starters: 'sides',
  burger: 'burgers',
  steak: 'burgers',
  wrap: 'wraps',
}

type Seed = Omit<MenuItem, 'id' | 'image' | 'badges' | 'options' | 'isVeg'> & Partial<Pick<MenuItem, 'badges' | 'options' | 'isVeg'>>
const make = (s: Seed): MenuItem => ({ badges: [], options: {}, isVeg: false, ...s, id: s.slug, image: `/images/${FOLDER[s.category]}/${s.slug}.webp` })
const drink = (s: Omit<Seed, 'isVeg'>): MenuItem => make({ ...s, isVeg: true })

export const menu: MenuItem[] = [
  /* ---------- Coffee: espresso speciality ---------- */
  drink({ slug: 'espresso', name: 'Espresso', category: 'coffee', price: 499, emoji: '☕', description: 'A straight shot of espresso.' }),
  drink({ slug: 'americano', name: 'Americano', category: 'coffee', price: 499, emoji: '🖤', description: 'Espresso topped up with hot water.' }),
  drink({ slug: 'cappuccino', name: 'Cappuccino', category: 'coffee', price: 650, emoji: '☕', description: 'Espresso, steamed milk and a thick cap of foam.' }),
  drink({ slug: 'latte', name: 'Latte', category: 'coffee', price: 650, emoji: '🥛', description: 'Espresso with plenty of steamed milk.' }),
  drink({ slug: 'flat-white', name: 'Flat White', category: 'coffee', price: 699, emoji: '🤍', description: 'Espresso with a thin layer of velvety milk.' }),
  drink({ slug: 'mocha', name: 'Mocha', category: 'coffee', price: 699, emoji: '🍫', description: 'Espresso, chocolate and steamed milk.' }),

  /* ---------- Coffee: flavoured speciality (hot / cold / blended) ---------- */
  drink({ slug: 'caramel-latte', name: 'Caramel Latte', category: 'coffee', price: 750, emoji: '🍯', options: FLAVOURED, description: 'Latte with caramel. Hot, cold or blended.' }),
  drink({ slug: 'hazelnut-latte', name: 'Hazelnut Latte', category: 'coffee', price: 750, emoji: '🌰', options: FLAVOURED, description: 'Latte with hazelnut. Hot, cold or blended.' }),
  drink({ slug: 'spanish-latte', name: 'Spanish Latte', category: 'coffee', price: 750, emoji: '🥛', options: FLAVOURED, featured: true, note: 'sweet tooth? start here', description: 'Espresso with sweetened condensed milk. Hot, cold or blended.' }),
  drink({ slug: 'french-vanilla-latte', name: 'French Vanilla Latte', category: 'coffee', price: 799, emoji: '🍦', options: FLAVOURED, description: 'Latte with French vanilla. Hot, cold or blended.' }),
  drink({ slug: 'tiramisu-latte', name: 'Tiramisu Latte', category: 'coffee', price: 799, emoji: '🍰', options: FLAVOURED, featured: true, note: 'dessert in a cup', description: 'Tiramisu-flavoured latte. Hot, cold or blended.' }),

  /* ---------- Whisked matcha ---------- */
  drink({ slug: 'classic-matcha', name: 'Classic Matcha', category: 'matcha', price: 800, emoji: '🍵', description: 'Whisked matcha, the classic way.' }),
  drink({ slug: 'vanilla-matcha', name: 'Vanilla Matcha', category: 'matcha', price: 950, emoji: '🍵', description: 'Whisked matcha with vanilla.' }),
  drink({ slug: 'strawberry-matcha', name: 'Strawberry Matcha', category: 'matcha', price: 999, emoji: '🍓', featured: true, note: 'pink + green 💚', description: 'Whisked matcha with strawberry.' }),

  /* ---------- Iced teas, beyond caffeine, mojitos ---------- */
  drink({ slug: 'peach-iced-tea', name: 'Peach Iced Tea', category: 'drinks', price: 650, emoji: '🍑', description: 'Iced tea with peach.' }),
  drink({ slug: 'raspberry-iced-tea', name: 'Raspberry Iced Tea', category: 'drinks', price: 650, emoji: '🧊', description: 'Iced tea with raspberry.' }),
  drink({ slug: 'tea-chai', name: 'Tea / Chai', category: 'drinks', price: 300, emoji: '🫖', description: 'Tea or chai, the everyday classic.' }),
  drink({ slug: 'green-tea', name: 'Green Tea', category: 'drinks', price: null, emoji: '🍵', description: 'A light cup of green tea.' }),
  drink({ slug: 'green-apple-mojito', name: 'Green Apple Mojito', category: 'drinks', price: 750, emoji: '🍏', description: 'Green apple mojito over ice.' }),
  drink({ slug: 'blue-mint-mojito', name: 'Blue Mint Mojito', category: 'drinks', price: 750, emoji: '💙', featured: true, note: 'instant cool-down', description: 'Blue mint mojito over ice.' }),
  drink({ slug: 'passion-fruit-mojito', name: 'Passion Fruit Mojito', category: 'drinks', price: null, emoji: '🍹', description: 'Passion fruit mojito over ice.' }),

  /* ---------- Starters (TODO(owner): prices) ---------- */
  make({ slug: 'simple-fries', name: 'Simple Fries', category: 'starters', price: null, emoji: '🍟', isVeg: true, description: 'Fries, kept simple.' }),
  make({ slug: 'loaded-fries', name: 'Loaded Fries', category: 'starters', price: null, emoji: '🧀', description: 'Fries, fully loaded.' }),
  make({ slug: 'munch-club', name: 'Munch Club', category: 'starters', price: null, emoji: '🥪', featured: true, note: 'the club sandwich', description: 'Our club sandwich.' }),
  make({ slug: 'golden-munch-wings', name: 'Golden Munch Wings', category: 'starters', price: null, emoji: '🍗', description: 'Golden wings, Munch style.' }),
  make({ slug: 'nuggets', name: 'Nuggets', category: 'starters', price: null, emoji: '🍗', description: 'Nuggets for sharing. Or not.' }),

  /* ---------- Zinger burgers (TODO(owner): prices) ---------- */
  make({ slug: 'munch-zinger-burger', name: 'Munch Zinger Burger', category: 'burger', price: null, emoji: '🍔', description: 'Single-patty zinger burger.' }),
  make({ slug: 'munch-special-burger', name: 'Munch Special Burger', category: 'burger', price: null, emoji: '🍔', description: 'Our special single-patty zinger burger.' }),
  make({ slug: 'munch-overload', name: 'Munch Overload', category: 'burger', price: null, emoji: '🍔', featured: true, note: 'double trouble', description: 'Double-patty zinger burger.' }),
  make({ slug: 'munch-hellfire', name: 'Munch Hellfire', category: 'burger', price: null, emoji: '🔥', badges: ['spicy'], featured: true, note: 'brave ones only 🔥', description: 'Double-patty zinger burger that brings the heat.' }),

  /* ---------- Beef smash burgers (TODO(owner): prices) ---------- */
  make({ slug: 'munch-smash', name: 'Munch Smash', category: 'burger', price: null, emoji: '🍔', description: 'Single smashed beef patty.' }),
  make({ slug: 'smash-beast', name: 'Smash Beast', category: 'burger', price: null, emoji: '🍔', featured: true, description: 'Double smashed beef patties.' }),
  make({ slug: 'smash-monster', name: 'Smash Monster', category: 'burger', price: null, emoji: '🍔', description: 'Triple smashed beef patties.' }),

  /* ---------- Steaks (TODO(owner): price) ---------- */
  make({ slug: 'munch-signature-steak', name: 'Munch Signature Steak', category: 'steak', price: null, emoji: '🥩', featured: true, note: 'the signature', description: 'Our signature steak.' }),

  /* ---------- Wraps: triangle-shaped (TODO(owner): prices) ---------- */
  make({ slug: 'jalapeno-jolt', name: 'Jalapeño Jolt', category: 'wrap', price: null, emoji: '🌶️', badges: ['spicy'], featured: true, description: 'Triangle-shaped wrap with a jalapeño kick.' }),
  make({ slug: 'bbq-blaze', name: 'BBQ Blaze', category: 'wrap', price: null, emoji: '🌯', description: 'Triangle-shaped wrap with smoky BBQ.' }),
  make({ slug: 'creamy-crush', name: 'Creamy Crush', category: 'wrap', price: null, emoji: '🌯', description: 'Triangle-shaped wrap with a creamy sauce.' }),
]

/* ---------- Category metadata (colour-coding lives here) ---------- */
export interface CategoryMeta {
  id: Category
  label: string
  emoji: string
  /** Tailwind classes using theme tokens only. */
  bg: string
  text: string
  ring: string
  /** Fallback-image gradient. */
  gradient: string
  /** Card hover: hard shadow in the category colour. */
  glow: string
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  coffee: {
    id: 'coffee', label: 'Coffee', emoji: '☕', bg: 'bg-caramel', text: 'text-espresso', ring: 'ring-caramel',
    gradient: 'bg-linear-to-br from-caramel via-caramel/50 to-cheese/40',
    glow: 'hover:shadow-[7px_7px_0_0_var(--color-caramel)]',
  },
  matcha: {
    id: 'matcha', label: 'Matcha', emoji: '🍵', bg: 'bg-pickle', text: 'text-espresso', ring: 'ring-pickle',
    gradient: 'bg-linear-to-br from-pickle via-pickle/50 to-oat',
    glow: 'hover:shadow-[7px_7px_0_0_var(--color-pickle)]',
  },
  drinks: {
    id: 'drinks', label: 'Teas & Mojitos', emoji: '🍹', bg: 'bg-bubblegum', text: 'text-espresso', ring: 'ring-bubblegum',
    gradient: 'bg-linear-to-br from-bubblegum via-bubblegum/60 to-pickle/40',
    glow: 'hover:shadow-[7px_7px_0_0_var(--color-bubblegum)]',
  },
  starters: {
    id: 'starters', label: 'Starters', emoji: '🍟', bg: 'bg-cheese', text: 'text-espresso', ring: 'ring-cheese',
    gradient: 'bg-linear-to-br from-cheese via-cheese/60 to-chili/30',
    glow: 'hover:shadow-[7px_7px_0_0_var(--color-cheese)]',
  },
  burger: {
    id: 'burger', label: 'Burgers', emoji: '🍔', bg: 'bg-chili', text: 'text-espresso', ring: 'ring-chili',
    gradient: 'bg-linear-to-br from-chili via-chili/60 to-cheese/60',
    glow: 'hover:shadow-[7px_7px_0_0_var(--color-chili)]',
  },
  steak: {
    id: 'steak', label: 'Steaks', emoji: '🥩', bg: 'bg-cheese', text: 'text-espresso', ring: 'ring-cheese',
    gradient: 'bg-linear-to-br from-cheese via-cheese/60 to-chili/40',
    glow: 'hover:shadow-[7px_7px_0_0_var(--color-cheese)]',
  },
  wrap: {
    id: 'wrap', label: 'Wraps', emoji: '🌯', bg: 'bg-pickle', text: 'text-espresso', ring: 'ring-pickle',
    gradient: 'bg-linear-to-br from-pickle via-pickle/60 to-cheese/40',
    glow: 'hover:shadow-[7px_7px_0_0_var(--color-pickle)]',
  },
}

export const CATEGORY_ORDER: Category[] = ['coffee', 'starters', 'burger', 'wrap', 'steak', 'matcha', 'drinks']

export const SPICE_LABELS: Record<SpiceLevel, string> = {
  mild: 'Mild',
  medium: 'Medium',
  'desi-hot': 'Desi Hot 🌶️',
}

/* ---------- Lookups ---------- */
const bySlug = new Map(menu.map((item) => [item.slug, item]))
const byId = new Map(menu.map((item) => [item.id, item]))

export const getItemBySlug = (slug: string): MenuItem | undefined => bySlug.get(slug)
export const getItemById = (id: string): MenuItem | undefined => byId.get(id)
export const getItemsByCategory = (category: Category): MenuItem[] => menu.filter((i) => i.category === category)
/** Home "Our picks" strip + marquee + 404 suggestions (owner-chosen via `featured`, not sales data). */
export const getFeatured = (): MenuItem[] => menu.filter((i) => i.featured)
/** Items that can be added to the cart right now. */
export const getPricedItems = (): PricedItem[] => menu.filter(isPriced)
