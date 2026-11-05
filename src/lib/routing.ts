import { matchPath, type Location } from 'react-router'

/** History state used for the "item modal over the current page" pattern. */
export interface ModalLocationState {
  backgroundLocation?: Location
}

export const ITEM_PATH = '/menu/:slug'

export function getBackgroundLocation(location: Location): Location | undefined {
  const state = location.state as ModalLocationState | null
  return state?.backgroundLocation
}

/** State to pass when linking to an item from inside the site → opens as a modal. */
export function modalStateFrom(location: Location): ModalLocationState {
  return { backgroundLocation: getBackgroundLocation(location) ?? location }
}

/** Slug of the item modal to show, if the current entry is an in-site item link. */
export function getModalSlug(location: Location): string | undefined {
  if (!getBackgroundLocation(location)) return undefined
  return matchPath(ITEM_PATH, location.pathname)?.params.slug
}
