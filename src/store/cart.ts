import { useMemo } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { repriceLines } from '@/lib/itemOptions'
import { getOrderTotals, type OrderType } from '@/lib/orderTotals'
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
  /** Set by re-pricing when the item / an ingredient no longer exists → blocks sending. */
  unavailable?: boolean
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

export interface EditTarget {
  lineId: string
  tab: 'burger' | 'wrap' | 'coffee'
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
  /** Delivery / takeaway / dine-in (persisted; checkout + drawer read it). */
  orderType: OrderType
  /** Line being edited in the Craft section (Edit / Tweak). Not persisted. */
  editing: EditTarget | null

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
  setOrderType: (type: OrderType) => void
  /** Replace a line in place (Edit / Tweak). Merges into an identical existing line. Returns the new lineId. */
  replaceItem: (lineId: string, input: AddItemInput) => string
  /** Re-price every line from the current data files. Returns true when a price changed (→ one honest notice). */
  reprice: () => boolean
  startEditing: (target: EditTarget) => void
  stopEditing: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasAddedThisSession: readSessionFlag(),
      lastAdd: null,
      orderType: 'delivery',
      editing: null,

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
      setOrderType: (orderType) => set({ orderType }),

      replaceItem: (lineId, input) => {
        const nextId = buildLineId(input.itemId, input.options)
        set((state) => {
          const index = state.items.findIndex((i) => i.lineId === lineId)
          if (index < 0) return state
          const old = state.items[index]!
          const twin = nextId !== lineId ? state.items.find((i) => i.lineId === nextId) : undefined
          if (twin) {
            // Edited into an identical existing creation → merge quantities, drop the old line.
            return {
              items: state.items
                .filter((i) => i.lineId !== lineId)
                .map((i) => (i.lineId === nextId ? { ...i, qty: Math.min(MAX_QTY, i.qty + old.qty) } : i)),
              editing: null,
              lastAdd: null,
            }
          }
          const items = [...state.items]
          items[index] = { ...input, lineId: nextId, qty: old.qty }
          return { items, editing: null, lastAdd: null }
        })
        return nextId
      },

      reprice: () => {
        const { items, changed, priceChanged } = repriceLines(get().items)
        if (changed) set({ items })
        return priceChanged
      },

      startEditing: (editing) => set({ editing, isOpen: false }),
      stopEditing: () => set({ editing: null }),
    }),
    {
      name: 'mm-cart',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, orderType: state.orderType }),
      // v1 (Phase 1) used a different line shape and was never user-facing → start fresh.
      migrate: () => ({ items: [] }),
    },
  ),
)

/* ---------- Selectors (money maths lives in lib/orderTotals.ts) ---------- */
type S = Pick<CartState, 'items' | 'orderType'>
export const selectCount = (s: Pick<CartState, 'items'>): number => s.items.reduce((n, i) => n + i.qty, 0)
export const selectTotals = (s: S) => getOrderTotals({ items: s.items, orderType: s.orderType })
export const selectSubtotal = (s: S): number => selectTotals(s).subtotal

export const useCartCount = (): number => useCart(selectCount)
export const useCartSubtotal = (): number => useCart(selectSubtotal)
export const useOrderType = (): OrderType => useCart((s) => s.orderType)
/** Totals for the current cart + order type (memoised; selectors must return stable values). */
export const useOrderTotals = () => {
  const items = useCart((s) => s.items)
  const orderType = useCart((s) => s.orderType)
  return useMemo(() => getOrderTotals({ items, orderType }), [items, orderType])
}
