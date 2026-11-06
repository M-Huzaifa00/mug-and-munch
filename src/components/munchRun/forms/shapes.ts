import type { MunchForm } from '@/data/munchRun'

/**
 * One closed silhouette per form, same 0 0 120 120 viewBox, similar point counts so MorphSVG
 * morphs body → body cleanly. Details never morph; the face is shared and only slides.
 */
export const BODY: Record<MunchForm, string> = {
  burger: 'M14 62C14 36 34 22 60 22C86 22 106 36 106 62L106 70C106 74 104 76 100 78L100 86C100 96 90 100 60 100C30 100 20 96 20 86L20 78C16 76 14 74 14 70Z',
  wrap: 'M34 36C34 22 46 16 60 16C74 16 86 22 86 36L87 70C88 74 88 76 88 78L86 88C84 98 76 102 60 102C44 102 36 98 34 88L32 78C32 76 32 74 33 70Z',
  coffee: 'M26 30C26 26 30 24 34 24L86 24C90 24 94 26 94 30L92 40C92 42 90 44 88 44L82 92C81 99 76 102 70 102L50 102C44 102 39 99 38 92L32 44C30 44 28 42 28 40Z',
}

/** Body fill token per form (CSS variable name, resolved at runtime for GSAP colour tweens). */
export const BODY_FILL: Record<MunchForm, string> = {
  burger: '--color-cheese',
  wrap: '--color-oat',
  coffee: '--color-oat',
}

/** Face offset (px in viewBox) per form; the face itself never changes. */
export const FACE_Y: Record<MunchForm, number> = { burger: 0, wrap: 2, coffee: 5 }

/** Line weight: same ratio as Munchy's monoline. */
export const STROKE = 4

export const FORMS: readonly MunchForm[] = ['burger', 'wrap', 'coffee']
