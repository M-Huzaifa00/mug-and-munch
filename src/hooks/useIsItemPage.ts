import { matchPath, useLocation } from 'react-router'
import { getModalSlug, ITEM_PATH } from '@/lib/routing'

/** True on the FULL item page (/menu/:slug via direct link), not when it's open as a modal. */
export function useIsItemPage(): boolean {
  const location = useLocation()
  return !!matchPath(ITEM_PATH, location.pathname) && !getModalSlug(location)
}
