import type { MunchEls } from './munchActions'

/** Collect the traveler's DOM handles (scoped to the Munch Run layer). */
export function readEls(root: HTMLElement): MunchEls | null {
  const one = <T extends Element>(sel: string) => root.querySelector<T>(`[data-mr="${sel}"]`)
  const outer = one<HTMLDivElement>('outer')
  const mid = one<HTMLDivElement>('mid')
  const float = one<HTMLDivElement>('float')
  const act = one<HTMLDivElement>('act')
  const button = one<HTMLButtonElement>('button')
  const svg = root.querySelector<SVGSVGElement>('[data-mr="act"] svg')
  const dust = one<HTMLElement>('dust')
  const sparkle = one<HTMLElement>('sparkle')
  if (!outer || !mid || !float || !act || !button || !svg || !dust || !sparkle) return null
  return {
    outer,
    mid,
    float,
    act,
    button,
    svg,
    dust,
    sparkle,
    notes: [1, 2, 3].map((n) => one<HTMLElement>(`note-${n}`)).filter((n): n is HTMLElement => n !== null),
    crumbs: Array.from(root.querySelectorAll<HTMLElement>('[data-mr="crumb"]')),
  }
}
