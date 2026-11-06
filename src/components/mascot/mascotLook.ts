/** Ask "follow"-mood Munchy (hero, desktop) to look at a viewport point for a moment. Handled inside useMascotAnimation. */
export const MASCOT_LOOK_EVENT = 'mm:mascot-look'

export interface MascotLookDetail {
  x: number
  y: number
}

export function mascotLookAt(x: number, y: number) {
  window.dispatchEvent(new CustomEvent<MascotLookDetail>(MASCOT_LOOK_EVENT, { detail: { x, y } }))
}
