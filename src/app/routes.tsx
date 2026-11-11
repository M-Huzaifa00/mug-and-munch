import { createElement, lazy, type ComponentType } from 'react'
import type { RouteObject } from 'react-router'

/** React.lazy for named exports: lazyNamed(() => import('./X'), 'X'). */
function lazyNamed<M extends Record<string, unknown>, K extends keyof M & string>(loader: () => Promise<M>, name: K) {
  return lazy(async () => ({ default: (await loader())[name] as ComponentType }))
}

/** Page chunk loaders (shared by React.lazy and prefetchPages). */
const LOADERS = {
  Home: () => import('@/pages/Home'),
  Menu: () => import('@/pages/Menu'),
  ItemDetail: () => import('@/pages/ItemDetail'),
  Deals: () => import('@/pages/Deals'),
  Checkout: () => import('@/pages/Checkout'),
  OrderSuccess: () => import('@/pages/OrderSuccess'),
  OurStory: () => import('@/pages/OurStory'),
  FindUs: () => import('@/pages/FindUs'),
  NotFound: () => import('@/pages/NotFound'),
}

const Home = lazyNamed(LOADERS.Home, 'Home')
const Menu = lazyNamed(LOADERS.Menu, 'Menu')
const ItemDetail = lazyNamed(LOADERS.ItemDetail, 'ItemDetail')
const Deals = lazyNamed(LOADERS.Deals, 'Deals')
const Checkout = lazyNamed(LOADERS.Checkout, 'Checkout')
const OrderSuccess = lazyNamed(LOADERS.OrderSuccess, 'OrderSuccess')
const OurStory = lazyNamed(LOADERS.OurStory, 'OurStory')
const FindUs = lazyNamed(LOADERS.FindUs, 'FindUs')
const NotFound = lazyNamed(LOADERS.NotFound, 'NotFound')

/**
 * Warm every page chunk in the background (after the preloader, on idle) so in-app navigation never waits on a
 * download: there is no Suspense loading screen any more, only the page wipe.
 */
export function prefetchPages() {
  for (const load of Object.values(LOADERS)) void load().catch(() => {})
}

/**
 * Page routes, rendered by RootLayout via useRoutes(PAGE_ROUTES, backgroundLocation ?? location)
 * so /menu/:slug can be a modal over the previous page (in-site) or a full page (direct link).
 */
export const PAGE_ROUTES: RouteObject[] = [
  { index: true, element: <Home /> },
  { path: 'menu', element: <Menu /> },
  { path: 'menu/:slug', element: <ItemDetail /> },
  { path: 'deals', element: <Deals /> },
  { path: 'checkout', element: <Checkout /> },
  { path: 'order-success', element: <OrderSuccess /> },
  { path: 'our-story', element: <OurStory /> },
  { path: 'find-us', element: <FindUs /> },
  // Dev-only review page; the whole branch (and its chunk) is dropped from production builds.
  ...(import.meta.env.DEV ? [{ path: 'mascot-lab', element: createElement(lazyNamed(() => import('@/pages/MascotLab'), 'MascotLab')) }] : []),
  { path: '*', element: <NotFound /> },
]
