import type { BuilderIngredient } from '@/data/toys'

/** Shared maths for the burger + wrap builders. */
export const countOf = <Id extends string>(picks: readonly Id[], id: Id) => picks.filter((p) => p === id).length

export function builderPrice<Id extends string>(base: number, ingredients: readonly BuilderIngredient<Id>[], picks: readonly Id[]): number {
  return picks.reduce<number>((sum, id) => sum + (ingredients.find((i) => i.id === id)?.price ?? 0), base)
}

/** "2× Chicken tikka", "Lettuce", … in the order first added. `skip` ids are left out (e.g. the bun). */
export function builderLabels<Id extends string>(ingredients: readonly BuilderIngredient<Id>[], picks: readonly Id[], skip: Id[] = []): string[] {
  const order: Id[] = []
  for (const p of picks) if (!skip.includes(p) && !order.includes(p)) order.push(p)
  return order.map((id) => {
    const n = countOf(picks, id)
    return `${n > 1 ? `${n}× ` : ''}${ingredients.find((i) => i.id === id)?.label ?? id}`
  })
}

/** Can `id` be added right now? */
export function canAdd<Id extends string>(ingredients: readonly BuilderIngredient<Id>[], picks: readonly Id[], id: Id, maxTotal: number): boolean {
  const ing = ingredients.find((i) => i.id === id)
  return Boolean(ing) && picks.length < maxTotal && countOf(picks, id) < (ing?.max ?? 0)
}
