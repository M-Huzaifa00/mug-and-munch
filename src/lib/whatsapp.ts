import { site } from '@/config/site'
import type { LineDescription } from '@/lib/lineDescription'
import type { Order } from '@/lib/order'
import { toWaDigits } from '@/lib/phone'
import { formatPKR } from '@/lib/utils'

/** The number shipped in site.ts before the owner fills it in. */
const PLACEHOLDER_NUMBERS = new Set(['923000000000', '923001234567'])

/**
 * True only when the WhatsApp number is a real-looking Pakistani mobile (→ 923XXXXXXXXX)
 * and not the placeholder. Orders are never sent to wa.me unless this is true.
 */
export function isWhatsappConfigured(number: string = site.contact.whatsappNumber): boolean {
  const digits = toWaDigits(number)
  return digits !== null && !PLACEHOLDER_NUMBERS.has(digits)
}

/** Café WhatsApp digits (923XXXXXXXXX), or null while unconfigured. */
export function cafeWaDigits(): string | null {
  return isWhatsappConfigured() ? toWaDigits(site.contact.whatsappNumber) : null
}

/** Dev-only start-up warning (called once from main.tsx). */
export function warnIfWhatsappUnconfigured(): void {
  if (import.meta.env.DEV && !isWhatsappConfigured()) {
    console.warn('[Mug n Munch] site.contact.whatsappNumber is still a placeholder: WhatsApp orders will not reach anyone. Fill it in src/config/site.ts.')
  }
}

/** Build a wa.me deep link to the café's WhatsApp with a prefilled message. */
export function whatsappLink(message = ''): string {
  const base = `https://wa.me/${toWaDigits(site.contact.whatsappNumber) ?? site.contact.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const WHATSAPP_GREETING = `Assalam o Alaikum ${site.brandName}! 👋 I want to place an order.`

/* ---------- Order message ---------- */
export const WA_MESSAGE_LIMIT = 2000
const SAFE_LIMIT = 1900

const KIND_PREFIX: Record<LineDescription['kind'], string> = { item: '', coffee: '☕ ', burger: '🍔 ', wrap: '🌯 ', deal: '🎁 ' }
const KIND_SUFFIX: Record<LineDescription['kind'], string> = { item: '', coffee: '', burger: ' (custom burger)', wrap: ' (custom wrap)', deal: ' (deal)' }
const TYPE_TITLE: Record<Order['orderType'], string> = { delivery: '🛵 *Delivery*', takeaway: '🥡 *Takeaway*', dineIn: '🍽️ *Dine-in*' }

const stripEmoji = (s: string) => s.replace(/\p{Extended_Pictographic}️?/gu, '').replace(/\s+/g, ' ').trim()

function detailLines(order: Order): string[] {
  const d = order.details
  if (d.orderType === 'delivery') return [`Area: ${d.area}`, `Address: ${d.address}`, ...(d.landmark ? [`Landmark: ${d.landmark}`] : [])]
  if (d.orderType === 'takeaway') return [`Pickup: ${d.pickupTime}`]
  return [`Table: ${d.table}`]
}

/** level 0 = full wording; 1 = no emoji in details; 2 = compact separators. Items / layers / fillings are NEVER dropped. */
function render(order: Order, level: 0 | 1 | 2): string {
  const t = order.totals
  const sep = level >= 2 ? ', ' : ' · '
  const indent = level >= 2 ? ' ' : '   '
  const items = order.lines.flatMap((l) => {
    const d = l.description
    const head = `${l.qty}× ${KIND_PREFIX[d.kind]}*${d.title}*${KIND_SUFFIX[d.kind]} — ${formatPKR(l.lineTotal)}`
    const details = level >= 1 ? d.details.map(stripEmoji).filter(Boolean) : d.details
    return details.length ? [head, `${indent}${details.join(sep)}`] : [head]
  })
  const money = [
    `Subtotal: ${formatPKR(t.subtotal)}`,
    ...(order.orderType === 'delivery' ? [`Delivery: ${t.deliveryFee === 0 ? 'Free' : formatPKR(t.deliveryFee)}`] : []),
    ...(t.tax > 0 ? [`Tax: ${formatPKR(t.tax)}`] : []),
    `*Total: ${formatPKR(t.total)}*`,
  ]
  const who = [
    `Payment: ${order.payment.label}`,
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    ...(order.customer.notes ? [`Notes: ${order.customer.notes}`] : []),
  ]
  const gap = level >= 2 ? [] : ['']
  return [`🧾 *New order ${order.number}* · ${site.brandName}`, ...gap, TYPE_TITLE[order.orderType], ...detailLines(order), ...gap, '*Items*', ...items, ...gap, ...money, ...gap, ...who].join('\n')
}

/** Plain-text order for WhatsApp (*bold*, a few emojis). Shortens option wording only if it would get too long. */
export function buildWhatsAppOrderMessage(order: Order): string {
  let msg = render(order, 0)
  if (msg.length > SAFE_LIMIT) msg = render(order, 1)
  if (msg.length > SAFE_LIMIT) msg = render(order, 2)
  return msg
}

/** wa.me link with the order prefilled, or null while the café number is a placeholder (never open wa.me then). */
export function getWhatsAppOrderUrl(order: Order, digits: string | null = cafeWaDigits()): string | null {
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(buildWhatsAppOrderMessage(order))}` : null
}

/** "Hi, about order MM-…" link for the success page. */
export function whatsappAboutOrderLink(number: string): string | null {
  const digits = cafeWaDigits()
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(`Hi ${site.brandName}, about order ${number}…`)}` : null
}
