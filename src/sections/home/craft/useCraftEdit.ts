import { useState } from 'react'
import { useCart, type CartItem } from '@/store/cart'

/** Cart line being edited in this maker tab (Edit / Tweak), or null. */
export function useCraftEdit(tab: 'burger' | 'coffee' | 'wrap'): CartItem | null {
  return useCart((s) => (s.editing?.tab === tab ? (s.items.find((i) => i.lineId === s.editing?.lineId) ?? null) : null))
}

/**
 * Preload the maker once per edited line (state adjusted during render, no effect):
 * calls `load(line)` the first render a new line shows up.
 */
export function usePreloadEdit(line: CartItem | null, load: (line: CartItem) => void): void {
  const [seen, setSeen] = useState<string | null>(null)
  const id = line?.lineId ?? null
  if (id !== seen) {
    setSeen(id)
    if (line) load(line)
  }
}

export const UPDATE_LABEL = 'Update my creation'
