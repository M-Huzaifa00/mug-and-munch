import { createContext, useContext } from 'react'

export interface BuilderMode {
  /** The creation can be added to the cart (site.craftMakers = 'order'). Else the CTA is "coming soon". */
  ordering: boolean
  /** Prices are real (menu coffees) or confirmed by the owner. Else every price in the maker is hidden. */
  showPrices: boolean
}

/** Provided per maker by CraftSection; read by IngredientTile + BuilderActions. Default = fully live. */
export const BuilderModeContext = createContext<BuilderMode>({ ordering: true, showPrices: true })
export const useBuilderMode = () => useContext(BuilderModeContext)
