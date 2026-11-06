import type { Order } from '@/lib/order'

/**
 * NOT USED. There is no backend yet: orders reach the owner as a WhatsApp message the customer sends.
 * Nothing imports or calls this; it marks where the backend hooks in later.
 */
export async function submitOrder(order: Order): Promise<never> {
  // TODO(backend): POST /orders, then notify owner (WhatsApp Cloud API template / Telegram bot / email).
  void order
  throw new Error('submitOrder: no backend yet. Orders are sent via WhatsApp.')
}
