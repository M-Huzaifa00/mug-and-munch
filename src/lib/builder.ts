import type { BuilderIngredient } from '@/data/builder'

/** One priced pick: `price` per unit × `qty` (default 1). */
export interface PricedPick {
  price: number
  qty?: number
}

/** Generic maker pricing: base + Σ choice.price × qty. */
export function builderTotal(base: number, picks: readonly PricedPick[]): number {
  return picks.reduce<number>((sum, p) => sum + p.price * (p.qty ?? 1), base)
}

export const countOf = <Id extends string>(picks: readonly Id[], id: Id) => picks.filter((p) => p === id).length

/** Max-items guard. */
export const hasRoom = (current: number, max: number, adding = 1) => current + adding <= max

/** Can `id` be added (per-ingredient max + overall max)? */
export function canAdd<Id extends string>(ingredients: readonly BuilderIngredient<Id>[], picks: readonly Id[], id: Id, maxTotal: number): boolean {
  const ing = ingredients.find((i) => i.id === id)
  return Boolean(ing) && hasRoom(picks.length, maxTotal) && countOf(picks, id) < (ing?.max ?? 0)
}

/** Random fun name, different from the current one when possible. */
export function pickFunName(names: readonly string[], current = ''): string {
  const pool = names.filter((n) => n !== current)
  const list = pool.length ? pool : names
  return list[Math.floor(Math.random() * list.length)] ?? current
}

/** Cleaned creation name (trimmed, max 30 chars). */
export const cleanName = (name: string) => name.replace(/\s+/g, ' ').trim().slice(0, 30)

/** "2× Chicken tikka", "Lettuce", … in first-added order. `skip` ids are left out. */
export function builderLabels<Id extends string>(ingredients: readonly { id: Id; label: string }[], picks: readonly Id[], skip: Id[] = []): string[] {
  const order: Id[] = []
  for (const p of picks) if (!skip.includes(p) && !order.includes(p)) order.push(p)
  return order.map((id) => {
    const n = countOf(picks, id)
    return `${n > 1 ? `${n}× ` : ''}${ingredients.find((i) => i.id === id)?.label ?? id}`
  })
}
