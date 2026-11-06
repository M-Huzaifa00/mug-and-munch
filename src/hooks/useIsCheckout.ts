import { useLocation } from 'react-router'

/** True on /checkout (the page has its own sticky CTA, so the cart pill + WhatsApp FAB hide). */
export function useIsCheckout(): boolean {
  return useLocation().pathname === '/checkout'
}
