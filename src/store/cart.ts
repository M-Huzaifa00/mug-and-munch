import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { site } from '@/config/site'
import type { Category, SpiceLevel } from '@/data/menu'
import type { WrapChoice } from '@/data/wrapBuilder'

export interface CartOptions {
  size?: string
  spice?: SpiceLevel
  extras?: string[]
  milk?: string
  temp?: string
  /** Coffee sweetness % (menu + coffee maker). */
  sweetness?: number
  /** Custom burger: layers bottom → top (order matters), bun excluded. */
  layers?: string[]
  /** Custom wrap: every choice. */
  wrap?: WrapChoice
  /** Custom creation name ("Name it"). */
  name?: string
}

export interface CartItem {
  /** itemId + stable hash of options → same item & options merge into one line. */
  lineId: string
  itemId: string
  slug: string
  name: string
  image: string
  emoji: string
  category: Category | 'deal'
  /** Final price per unit including option deltas (PKR). */
  unitPrice: number
  qty: number
  options: CartOptions
  /** Human-readable option chips, e.g. ["Large", "Oat milk", "+ Extra shot"]. */
  optionLabels: string[]
  isCustom?: boolean
}

export type AddItemInput = Omit<CartItem, 'lineId' | 'qty'>

const MAX_QTY = 20
const SESSION_KEY = 'mm-first-add'

/** djb2 → base36. Small, stable, good enough for option fingerprints. */
function hash(input: string): string {
  let h = 5381
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

/**
 * Same item + same options → same line (qty merges).
 * Menu extras are order-insensitive; custom burger layers are ORDERED; custom names count.
 */
export function buildLineId(itemId: string, o: CartOptions): string {
  const w = o.wrap
  const wrap = w ? [w.base, w.protein, w.double ? 'x2' : '', [...w.cheeses].sort().join('+'), [...w.veggies].sort().join('+'), [...w.sauces].sort().join('+'), w.spice].join(',') : ''
  const normalized = [
    o.size ?? '',
    o.temp ?? '',
    o.milk ?? '',
    o.spice ?? '',
    [...(o.extras ?? [])].sort().join('+'),
    o.sweetness ?? '',
    (o.layers ?? []).join('>'),
    wrap,
    (o.name ?? '').trim().toLowerCase(),
  ]
  return `${itemId}::${hash(normalized.join('|'))}`
}

const readSessionFlag = (): boolean => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

interface LastAdd {
  lineId: string
  /** Quantity before the add (0 = line was new). */
  prevQty: number
}

interface CartState {
  items: CartItem[]
  /** Drawer visibility (not persisted). */
  isOpen: boolean
  /** First add of this browser session (sessionStorage) → confetti once. */
  hasAddedThisSession: boolean
  lastAdd: LastAdd | null

  /** Adds (or merges) a line. Returns the lineId and whether it was the session's first add. */
  addItem: (input: AddItemInput, qty?: number) => { lineId: string; isFirstAdd: boolean }
  removeItem: (lineId: string) => void
  updateQty: (lineId: string, qty: number) => void
  /** Put a removed line back (swipe-to-remove "Undo"). */
  restoreItem: (item: CartItem, index: number) => void
  clear: () => void
  undoLastAdd: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasAddedThisSession: readSessionFlag(),
      lastAdd: null,

      addItem: (input, qty = 1) => {
        const lineId = buildLineId(input.itemId, input.options)
        const isFirstAdd = !get().hasAddedThisSession
        if (isFirstAdd) {
          try {
            sessionStorage.setItem(SESSION_KEY, '1')
          } catch {
            /* private mode: confetti may repeat, harmless */
          }
        }
        set((state) => {
          const existing = state.items.find((i) => i.lineId === lineId)
          const prevQty = existing?.qty ?? 0
          const items = existing
            ? state.items.map((i) => (i.lineId === lineId ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i))
            : [...state.items, { ...input, lineId, qty: Math.min(MAX_QTY, qty) }]
          return { items, hasAddedThisSession: true, lastAdd: { lineId, prevQty } }
        })
        return { lineId, isFirstAdd }
      },

      removeItem: (lineId) => set((state) => ({ items: state.items.filter((i) => i.lineId !== lineId) })),

      updateQty: (lineId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.lineId !== lineId)
              : state.items.map((i) => (i.lineId === lineId ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)),
        })),

      restoreItem: (item, index) =>
        set((state) => {
          if (state.items.some((i) => i.lineId === item.lineId)) return state
          const items = [...state.items]
          items.splice(Math.min(index, items.length), 0, item)
          return { items }
        }),

      clear: () => set({ items: [], lastAdd: null }),

      undoLastAdd: () => {
        const last = get().lastAdd
        if (!last) return
        get().updateQty(last.lineId, last.prevQty)
        set({ lastAdd: null })
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'mm-cart',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      // v1 (Phase 1) used a different line shape and was never user-facing → start fresh.
      migrate: () => ({ items: [] }),
    },
  ),
)

/* ---------- Selectors ---------- */
type S = Pick<CartState, 'items'>
export const selectCount = (s: S): number => s.items.reduce((n, i) => n + i.qty, 0)
export const selectSubtotal = (s: S): number => s.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0)
export const selectDeliveryFee = (s: S): number => {
  const subtotal = selectSubtotal(s)
  if (subtotal === 0 || subtotal >= site.commerce.freeDeliveryThreshold) return 0
  return site.commerce.deliveryFee
}
export const selectAmountToFreeDelivery = (s: S): number =>
  Math.max(0, site.commerce.freeDeliveryThreshold - selectSubtotal(s))

export const useCartCount = (): number => useCart(selectCount)
export const useCartSubtotal = (): number => useCart(selectSubtotal)
export const useDeliveryFee = (): number => useCart(selectDeliveryFee)
export const useAmountToFreeDelivery = (): number => useCart(selectAmountToFreeDelivery)
