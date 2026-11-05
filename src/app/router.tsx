import { createBrowserRouter } from 'react-router'
import { RootLayout } from './RootLayout'

/**
 * The data router hands every URL to RootLayout, which renders the page tree itself
 * (see routes.tsx) so it can keep the background page mounted under the item modal.
 */
export const router = createBrowserRouter([{ path: '*', Component: RootLayout }])
