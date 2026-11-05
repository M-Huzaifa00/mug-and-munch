import { site } from '@/config/site'

/** Build a wa.me deep link to the café's WhatsApp with a prefilled message. */
export function whatsappLink(message = ''): string {
  const base = `https://wa.me/${site.contact.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const WHATSAPP_GREETING = 'Assalam o Alaikum Mug & Munch! 👋 I want to place an order.'

// TODO (Phase 5): buildOrderMessage(cart, customer) → formatted order text for checkout.
