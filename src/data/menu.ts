/**
 * Menu data. PLACEHOLDER PRICES — owner to update.
 * Images live in /public/images/<folder>/<slug>.webp. Until real photos exist,
 * the UI renders a styled fallback (category gradient + emoji + name).
 */

export type Category = 'coffee' | 'burger' | 'wrap' | 'sides' | 'drinks' | 'desserts'
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
}

export interface MenuItem {
  id: string
  slug: string
  name: string
  category: Category
  price: number
  description: string
  image: string
  emoji: string
  badges: Badge[]
  options: ItemOptions
  spiceLevels?: SpiceLevel[]
  isVeg: boolean
  /** Handwritten Caveat doodle note (optional). */
  note?: string
}

/* ---------- Shared option sets ---------- */
const COFFEE_SIZES: OptionChoice[] = [
  { id: 's', label: 'Small', priceDelta: 0 },
  { id: 'm', label: 'Medium', priceDelta: 150 },
  { id: 'l', label: 'Large', priceDelta: 250 },
]
const TEMPS: OptionChoice[] = [
  { id: 'hot', label: 'Hot', priceDelta: 0 },
  { id: 'iced', label: 'Iced', priceDelta: 50 },
]
const MILKS: OptionChoice[] = [
  { id: 'regular', label: 'Regular milk', priceDelta: 0 },
  { id: 'oat', label: 'Oat milk', priceDelta: 200 },
  { id: 'almond', label: 'Almond milk', priceDelta: 200 },
]
const COFFEE_EXTRAS: OptionChoice[] = [
  { id: 'extra-shot', label: 'Extra shot', priceDelta: 150 },
  { id: 'caramel-syrup', label: 'Caramel syrup', priceDelta: 100 },
  { id: 'hazelnut-syrup', label: 'Hazelnut syrup', priceDelta: 100 },
]
const BURGER_EXTRAS: OptionChoice[] = [
  { id: 'extra-cheese', label: 'Extra cheese', priceDelta: 150 },
  { id: 'extra-patty', label: 'Extra patty', priceDelta: 450 },
  { id: 'jalapenos', label: 'Jalapeños', priceDelta: 100 },
  { id: 'caramelised-onions', label: 'Caramelised onions', priceDelta: 100 },
]
const WRAP_EXTRAS: OptionChoice[] = [
  { id: 'extra-cheese', label: 'Extra cheese', priceDelta: 150 },
  { id: 'jalapenos', label: 'Jalapeños', priceDelta: 100 },
  { id: 'extra-filling', label: 'Extra filling', priceDelta: 300 },
]
const SPICE: SpiceLevel[] = ['mild', 'medium', 'desi-hot']

const COFFEE_OPTIONS: ItemOptions = { sizes: COFFEE_SIZES, temps: TEMPS, milks: MILKS, extras: COFFEE_EXTRAS }
const BLACK_COFFEE_OPTIONS: ItemOptions = { sizes: COFFEE_SIZES, temps: TEMPS, extras: COFFEE_EXTRAS }

const FOLDER: Record<Category, string> = {
  coffee: 'coffee',
  burger: 'burgers',
  wrap: 'wraps',
  sides: 'sides',
  drinks: 'drinks',
  desserts: 'desserts',
}

type Seed = Omit<MenuItem, 'id' | 'image'>
const make = (s: Seed): MenuItem => ({ ...s, id: s.slug, image: `/images/${FOLDER[s.category]}/${s.slug}.webp` })

export const menu: MenuItem[] = [
  /* ---------- Coffee ---------- */
  make({ slug: 'classic-latte', name: 'Classic Latte', category: 'coffee', price: 650, emoji: '☕', badges: [], isVeg: true, options: COFFEE_OPTIONS, description: 'Double espresso, silky steamed milk. The everyday hug.' }),
  make({ slug: 'spanish-latte', name: 'Spanish Latte', category: 'coffee', price: 790, emoji: '🥛', badges: ['bestseller'], isVeg: true, options: COFFEE_OPTIONS, note: 'the one everyone orders 👀', description: 'Espresso over sweet condensed milk. Creamy, dangerous, addictive.' }),
  make({ slug: 'caramel-macchiato', name: 'Caramel Macchiato', category: 'coffee', price: 850, emoji: '🍯', badges: [], isVeg: true, options: COFFEE_OPTIONS, description: 'Vanilla milk, marked with espresso, drowned in caramel drizzle.' }),
  make({ slug: 'mocha', name: 'Mocha', category: 'coffee', price: 820, emoji: '🍫', badges: [], isVeg: true, options: COFFEE_OPTIONS, description: 'Dark chocolate meets espresso. Dessert you can drink.' }),
  make({ slug: 'pistachio-latte', name: 'Pistachio Latte', category: 'coffee', price: 850, emoji: '💚', badges: ['new'], isVeg: true, options: COFFEE_OPTIONS, note: 'new obsession unlocked', description: 'Nutty pistachio cream, espresso, a sprinkle of crushed pista.' }),
  make({ slug: 'flat-white', name: 'Flat White', category: 'coffee', price: 700, emoji: '🤍', badges: [], isVeg: true, options: COFFEE_OPTIONS, description: 'Ristretto shots, velvet microfoam. Strong and smooth.' }),
  make({ slug: 'americano', name: 'Americano', category: 'coffee', price: 550, emoji: '🖤', badges: [], isVeg: true, options: BLACK_COFFEE_OPTIONS, description: 'Espresso + water. No drama, just caffeine.' }),
  make({ slug: 'cold-brew', name: 'Cold Brew', category: 'coffee', price: 750, emoji: '🧊', badges: [], isVeg: true, options: { sizes: COFFEE_SIZES, extras: COFFEE_EXTRAS }, note: 'study grind fuel ☕', description: 'Steeped 18 hours. Smooth, low-acid, seriously strong.' }),

  /* ---------- Burgers ---------- */
  make({ slug: 'classic-smash', name: 'Classic Smash', category: 'burger', price: 950, emoji: '🍔', badges: ['bestseller'], isVeg: false, options: { extras: BURGER_EXTRAS }, spiceLevels: SPICE, note: 'start here, trust us', description: 'Smashed beef patty, American cheese, pickles, house sauce, potato bun.' }),
  make({ slug: 'double-smash', name: 'Double Smash', category: 'burger', price: 1350, emoji: '🍔', badges: ['bestseller'], isVeg: false, options: { extras: BURGER_EXTRAS }, spiceLevels: SPICE, note: 'double trouble 🔥', description: 'Two crispy-edged patties, double cheese, caramelised onions, house sauce.' }),
  make({ slug: 'smoky-bbq-stack', name: 'Smoky BBQ Stack', category: 'burger', price: 1450, emoji: '🔥', badges: [], isVeg: false, options: { extras: BURGER_EXTRAS }, spiceLevels: SPICE, description: 'Double beef, smoked cheddar, crispy onion rings, sticky BBQ glaze.' }),
  make({ slug: 'mushroom-swiss', name: 'Mushroom Swiss', category: 'burger', price: 1250, emoji: '🍄', badges: [], isVeg: false, options: { extras: BURGER_EXTRAS }, spiceLevels: SPICE, description: 'Beef smash, garlic butter mushrooms, melted Swiss, truffle mayo.' }),
  make({ slug: 'jalapeno-kicker', name: 'Jalapeño Kicker', category: 'burger', price: 1200, emoji: '🌶️', badges: ['spicy'], isVeg: false, options: { extras: BURGER_EXTRAS }, spiceLevels: SPICE, description: 'Beef smash, pepper jack, fresh + pickled jalapeños, chipotle mayo.' }),
  make({ slug: 'tikka-smash', name: 'Desi Tikka Smash', category: 'burger', price: 1150, emoji: '🍗', badges: ['new', 'spicy'], isVeg: false, options: { extras: BURGER_EXTRAS }, spiceLevels: SPICE, note: 'desi heart, smash soul', description: 'Chicken tikka patty, mint raita mayo, onion lachha, cheese.' }),
  make({ slug: 'nashville-hot-chicken', name: 'Nashville Hot Chicken', category: 'burger', price: 1150, emoji: '🐔', badges: ['spicy'], isVeg: false, options: { extras: BURGER_EXTRAS }, spiceLevels: SPICE, description: 'Crispy fried thigh, hot chilli oil, slaw, pickles, brioche.' }),
  make({ slug: 'aloo-tikki-crunch', name: 'Aloo Tikki Crunch', category: 'burger', price: 850, emoji: '🥔', badges: ['veg'], isVeg: true, options: { extras: BURGER_EXTRAS }, spiceLevels: SPICE, description: 'Crispy spiced aloo tikki, imli chutney, cheese, crunchy lettuce.' }),

  /* ---------- Wraps ---------- */
  make({ slug: 'chicken-tikka-wrap', name: 'Chicken Tikka Wrap', category: 'wrap', price: 950, emoji: '🌯', badges: ['bestseller'], isVeg: false, options: { extras: WRAP_EXTRAS }, spiceLevels: SPICE, note: 'garma garam 🔥', description: 'Char-grilled tikka, garlic mayo, onions, mint chutney, toasted tortilla.' }),
  make({ slug: 'peri-peri-wrap', name: 'Peri Peri Wrap', category: 'wrap', price: 990, emoji: '🌶️', badges: ['spicy'], isVeg: false, options: { extras: WRAP_EXTRAS }, spiceLevels: SPICE, description: 'Peri peri chicken, fries inside (yes), cheese, lettuce, peri mayo.' }),
  make({ slug: 'crispy-ranch-wrap', name: 'Crispy Ranch Wrap', category: 'wrap', price: 1050, emoji: '🥬', badges: [], isVeg: false, options: { extras: WRAP_EXTRAS }, spiceLevels: SPICE, description: 'Crunchy fried chicken strips, ranch, cheddar, iceberg, tomato.' }),
  make({ slug: 'malai-boti-wrap', name: 'Malai Boti Wrap', category: 'wrap', price: 1050, emoji: '🤍', badges: ['new'], isVeg: false, options: { extras: WRAP_EXTRAS }, spiceLevels: SPICE, description: 'Creamy malai boti, white garlic sauce, pickled onions, coriander.' }),
  make({ slug: 'smoky-beef-wrap', name: 'Smoky Beef Wrap', category: 'wrap', price: 1150, emoji: '🥩', badges: [], isVeg: false, options: { extras: WRAP_EXTRAS }, spiceLevels: SPICE, description: 'Smoky pulled beef, cheese sauce, jalapeños, crispy onions.' }),
  make({ slug: 'paneer-tikka-wrap', name: 'Paneer Tikka Wrap', category: 'wrap', price: 890, emoji: '🧀', badges: ['veg'], isVeg: true, options: { extras: WRAP_EXTRAS }, spiceLevels: SPICE, description: 'Tandoori paneer, peppers, onions, mint yogurt, chaat masala.' }),

  /* ---------- Sides ---------- */
  make({ slug: 'classic-fries', name: 'Classic Fries', category: 'sides', price: 350, emoji: '🍟', badges: ['veg'], isVeg: true, options: {}, description: 'Golden, crispy, salted just right.' }),
  make({ slug: 'masala-fries', name: 'Masala Fries', category: 'sides', price: 450, emoji: '🍟', badges: ['veg', 'spicy'], isVeg: true, options: {}, description: 'Tossed in our chatpata masala blend.' }),
  make({ slug: 'loaded-fries', name: 'Loaded Fries', category: 'sides', price: 650, emoji: '🧀', badges: ['bestseller'], isVeg: false, options: {}, description: 'Cheese sauce, jalapeños, crispy chicken bits, house sauce.' }),
  make({ slug: 'chicken-nuggets', name: 'Chicken Nuggets (6)', category: 'sides', price: 550, emoji: '🍗', badges: [], isVeg: false, options: {}, description: 'Crunchy bites with your choice of dip.' }),

  /* ---------- Drinks ---------- */
  make({ slug: 'karak-chai', name: 'Karak Chai', category: 'drinks', price: 280, emoji: '🫖', badges: [], isVeg: true, options: {}, description: 'Strong, milky, cardamom-kissed. Late-night essential.' }),
  make({ slug: 'mint-margarita', name: 'Mint Margarita', category: 'drinks', price: 450, emoji: '🌿', badges: ['veg'], isVeg: true, options: {}, description: 'Fresh mint, lime, crushed ice. Instant cool-down.' }),
  make({ slug: 'fresh-lime', name: 'Fresh Lime', category: 'drinks', price: 300, emoji: '🍋', badges: ['veg'], isVeg: true, options: {}, description: 'Sweet or salty, fizzy or still.' }),
  make({ slug: 'soft-drink', name: 'Soft Drink', category: 'drinks', price: 180, emoji: '🥤', badges: ['veg'], isVeg: true, options: {}, description: 'Chilled can. Ask for flavours.' }),

  /* ---------- Desserts ---------- */
  make({ slug: 'choc-chunk-cookie', name: 'Choc Chunk Cookie', category: 'desserts', price: 350, emoji: '🍪', badges: ['veg'], isVeg: true, options: {}, description: 'Gooey centre, crispy edges, big chocolate puddles.' }),
  make({ slug: 'nutella-brownie', name: 'Nutella Brownie', category: 'desserts', price: 550, emoji: '🟫', badges: ['veg'], isVeg: true, options: {}, description: 'Fudgy brownie, Nutella swirl, served warm.' }),
  make({ slug: 'lotus-cheesecake', name: 'Lotus Cheesecake', category: 'desserts', price: 750, emoji: '🍰', badges: ['new', 'veg'], isVeg: true, options: {}, description: 'Creamy baked cheesecake on a Biscoff crumb.' }),
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
  burger: {
    id: 'burger', label: 'Burgers', emoji: '🍔', bg: 'bg-chili', text: 'text-espresso', ring: 'ring-chili',
    gradient: 'bg-linear-to-br from-chili via-chili/60 to-cheese/60',
    glow: 'hover:shadow-[7px_7px_0_0_var(--color-chili)]',
  },
  wrap: {
    id: 'wrap', label: 'Wraps', emoji: '🌯', bg: 'bg-pickle', text: 'text-espresso', ring: 'ring-pickle',
    gradient: 'bg-linear-to-br from-pickle via-pickle/60 to-cheese/40',
    glow: 'hover:shadow-[7px_7px_0_0_var(--color-pickle)]',
  },
  sides: {
    id: 'sides', label: 'Sides', emoji: '🍟', bg: 'bg-cheese', text: 'text-espresso', ring: 'ring-cheese',
    gradient: 'bg-linear-to-br from-cheese via-cheese/60 to-chili/30',
    glow: 'hover:shadow-[7px_7px_0_0_var(--color-cheese)]',
  },
  drinks: {
    id: 'drinks', label: 'Drinks', emoji: '🥤', bg: 'bg-bubblegum', text: 'text-espresso', ring: 'ring-bubblegum',
    gradient: 'bg-linear-to-br from-bubblegum via-bubblegum/60 to-pickle/40',
    glow: 'hover:shadow-[7px_7px_0_0_var(--color-bubblegum)]',
  },
  desserts: {
    id: 'desserts', label: 'Desserts', emoji: '🍪', bg: 'bg-bubblegum', text: 'text-espresso', ring: 'ring-bubblegum',
    gradient: 'bg-linear-to-br from-bubblegum via-bubblegum/50 to-caramel/50',
    glow: 'hover:shadow-[7px_7px_0_0_var(--color-bubblegum)]',
  },
}

export const CATEGORY_ORDER: Category[] = ['coffee', 'burger', 'wrap', 'sides', 'drinks', 'desserts']

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
export const getBestsellers = (): MenuItem[] => menu.filter((i) => i.badges.includes('bestseller'))
