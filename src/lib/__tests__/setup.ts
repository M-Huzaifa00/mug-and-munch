/**
 * Test-only menu + deal data, appended to the real data files for every test.
 * The real menu (owner data) may have no sizes / milks / add-ons / spice / deals at a given moment, but the
 * cart, line-description, re-pricing and WhatsApp code still supports them → keep those paths covered here,
 * independent of what the owner currently sells.
 */
import { vi } from 'vitest'
import type { Deal } from '@/data/deals'
import type { MenuItem } from '@/data/menu'

vi.mock('@/data/menu', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/data/menu')>()
  const test: MenuItem[] = [
    {
      id: 'test-latte', slug: 'test-latte', name: 'Test Latte', category: 'coffee', price: 700, image: '/images/coffee/test-latte.webp', emoji: '☕', badges: [], isVeg: true,
      description: 'Test coffee with every option group.',
      options: {
        sizes: [{ id: 's', label: 'Small', priceDelta: 0 }, { id: 'm', label: 'Medium', priceDelta: 150 }, { id: 'l', label: 'Large', priceDelta: 250 }],
        temps: [{ id: 'hot', label: 'Hot', priceDelta: 0 }, { id: 'iced', label: 'Iced', priceDelta: 50 }],
        milks: [{ id: 'regular', label: 'Regular milk', priceDelta: 0 }, { id: 'oat', label: 'Oat milk', priceDelta: 200 }],
        extras: [{ id: 'extra-shot', label: 'Extra shot', priceDelta: 150 }, { id: 'hazelnut-syrup', label: 'Hazelnut syrup', priceDelta: 100 }],
        sweetness: real.SWEETNESS_LEVELS,
      },
    },
    {
      id: 'test-smash', slug: 'test-smash', name: 'Test Smash', category: 'burger', price: 950, image: '/images/burgers/test-smash.webp', emoji: '🍔', badges: [], isVeg: false,
      description: 'Test burger with spice + extras.',
      options: { extras: [{ id: 'extra-cheese', label: 'Extra cheese', priceDelta: 150 }] },
      spiceLevels: ['mild', 'medium', 'desi-hot'],
    },
  ]
  const menu = [...real.menu, ...test]
  const byId = new Map(menu.map((i) => [i.id, i]))
  return {
    ...real,
    menu,
    getItemById: (id: string) => byId.get(id),
    getItemBySlug: (slug: string) => byId.get(slug),
    getItemsByCategory: (c: MenuItem['category']) => menu.filter((i) => i.category === c),
    getFeatured: () => menu.filter((i) => i.featured),
    getPricedItems: () => menu.filter(real.isPriced),
  }
})

vi.mock('@/data/deals', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/data/deals')>()
  const testDeal: Deal = {
    id: 'test-deal', slug: 'test-deal', name: 'Test Deal', emoji: '🎁', price: 1100, tagline: 'Test combo.', type: 'solo',
    items: [{ itemId: 'test-smash', qty: 1 }, { itemId: 'tea-chai', qty: 1 }],
  }
  return { ...real, deals: [...real.deals, testDeal] }
})

// Makers the owner has switched off are still covered by tests: turn every maker on here.
// (Tests that need the "off" behaviour flip a flag on this mutable copy and restore it.)
vi.mock('@/config/site', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/config/site')>()
  return { ...real, site: { ...real.site, craftMakers: { coffee: 'order', burger: 'order', wrap: 'order' } } }
})
