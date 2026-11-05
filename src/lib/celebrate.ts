/** Small confetti burst in brand colours (read from the CSS tokens at runtime). Lazy-loads the lib. */

const TOKENS = ['--color-chili', '--color-cheese', '--color-pickle', '--color-bubblegum', '--color-caramel']

/** Normalise any CSS colour to #rrggbb (canvas-confetti only understands hex). */
function toHex(value: string, ctx: CanvasRenderingContext2D): string | null {
  ctx.fillStyle = '#000000'
  ctx.fillStyle = value
  const out = ctx.fillStyle
  return /^#[0-9a-f]{6}$/i.test(out) ? out : null
}

function brandColors(): string[] | undefined {
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) return undefined
  const styles = getComputedStyle(document.documentElement)
  const colors = TOKENS.map((t) => styles.getPropertyValue(t).trim())
    .filter(Boolean)
    .map((c) => toHex(c, ctx))
    .filter((c): c is string => c !== null)
  return colors.length ? colors : undefined
}

/** Burst from a viewport point (px). */
export async function confettiBurst(x: number, y: number): Promise<void> {
  const { default: confetti } = await import('canvas-confetti')
  void confetti({
    particleCount: 70,
    spread: 75,
    startVelocity: 32,
    scalar: 0.9,
    ticks: 140,
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
    colors: brandColors(),
    zIndex: 95,
    disableForReducedMotion: true,
  })
}
