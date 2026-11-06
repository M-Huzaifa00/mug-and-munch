import { createElement, lazy, type ComponentType } from 'react'
import type { RouteObject } from 'react-router'

/** React.lazy for named exports: lazyNamed(() => import('./X'), 'X'). */
function lazyNamed<M extends Record<string, unknown>, K extends keyof M & string>(loader: () => Promise<M>, name: K) {
  return lazy(async () => ({ default: (await loader())[name] as ComponentType }))
}

const Home = lazyNamed(() => import('@/pages/Home'), 'Home')
const Menu = lazyNamed(() => import('@/pages/Menu'), 'Menu')
const ItemDetail = lazyNamed(() => import('@/pages/ItemDetail'), 'ItemDetail')
const Deals = lazyNamed(() => import('@/pages/Deals'), 'Deals')
const Checkout = lazyNamed(() => import('@/pages/Checkout'), 'Checkout')
const OrderSuccess = lazyNamed(() => import('@/pages/OrderSuccess'), 'OrderSuccess')
const OurStory = lazyNamed(() => import('@/pages/OurStory'), 'OurStory')
const FindUs = lazyNamed(() => import('@/pages/FindUs'), 'FindUs')
const NotFound = lazyNamed(() => import('@/pages/NotFound'), 'NotFound')

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
