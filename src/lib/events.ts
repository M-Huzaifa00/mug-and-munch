/**
 * Analytics stub. Logs to the console in development, no-op in production.
 * TODO(analytics): wire GA4 / Meta Pixel here (with consent) when the owner is ready.
 */
export type TrackPayload = Record<string, string | number | boolean | null | undefined>

export function track(name: string, payload: TrackPayload = {}): void {
  if (import.meta.env.DEV) console.debug(`[track] ${name}`, payload)
}
