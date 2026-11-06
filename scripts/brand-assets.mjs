/**
 * Generates every brand asset from the master logo.
 *   node scripts/brand-assets.mjs        (also: npm run brand)
 *
 * Input : public/brand/logo.svg (preferred, if present) or public/brand/logo.png
 * Output: public/brand/logo-{64,128,256,512}.webp           full stacked logo (height px)
 *         public/brand/logo-icon-{64,128,256,512}.webp      illustration only
 *         public/brand/logo-wordmark-{64,128,256,512}.webp  "MUG n MUNCH" only
 *         public/favicon.ico (16/32/48), public/favicon-32.png, public/apple-touch-icon.png (180, oat bg)
 *         public/brand/og-image.png (1200×630)
 *         src/components/brand/brandAssets.ts (generated sizes/aspect ratios → no layout shift)
 *
 * Colours are read from the @theme tokens in src/styles/index.css (single source of truth).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = join(root, 'public')
const brandDir = join(pub, 'brand')
const HEIGHTS = [64, 128, 256, 512]

// ---------- tokens ----------
const css = readFileSync(join(root, 'src/styles/index.css'), 'utf8')
const token = (name) => {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`))
  if (!m) throw new Error(`token --color-${name} not found`)
  return m[1]
}
const T = { espresso: token('espresso'), oat: token('oat'), chili: token('chili'), cheese: token('cheese') }

// Brand copy comes from src/config/site.ts (single source of truth).
const siteTs = readFileSync(join(root, 'src/config/site.ts'), 'utf8')
const siteValue = (key) => siteTs.match(new RegExp(`${key}:\\s*'([^']+)'`))?.[1] ?? ''
const BRAND_NAME = siteValue('brandName')
const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const rgb = (hex) => ({ r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16), alpha: 1 })

// ---------- master ----------
const svgPath = join(brandDir, 'logo.svg')
const pngPath = join(brandDir, 'logo.png')
const masterPath = existsSync(svgPath) ? svgPath : pngPath
const master = await sharp(masterPath, { density: 300 }).ensureAlpha().png().toBuffer()
const { width: W, height: H } = await sharp(master).metadata()
console.log(`master: ${masterPath.replace(root, '.')} ${W}×${H}`)

// Split illustration / wordmark at the widest empty horizontal band in the lower half.
const { data } = await sharp(master).raw().toBuffer({ resolveWithObject: true })
const rowHasInk = (y) => {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4
    if (data[i + 3] > 128 && !(data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235)) return true
  }
  return false
}
let best = null
let start = -1
for (let y = Math.floor(H / 2); y < H; y++) {
  const empty = !rowHasInk(y)
  if (empty && start < 0) start = y
  if ((!empty || y === H - 1) && start >= 0) {
    if (!best || y - start > best[1] - best[0]) best = [start, y]
    start = -1
  }
}
if (!best) throw new Error('could not find the gap between illustration and wordmark')
const [gapTop, gapBottom] = best
console.log(`split: illustration rows 0–${gapTop}, wordmark rows ${gapBottom}–${H}`)

/** Tight box around clearly visible pixels (alpha > 40) — ignores faint anti-alias noise. */
function visibleBox(y0, y1) {
  let minX = W, maxX = -1, minY = y1, maxY = -1
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * 4 + 3] > 40) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  const pad = Math.round(W * 0.004)
  const left = Math.max(0, minX - pad)
  const top = Math.max(0, minY - pad)
  return { left, top, width: Math.min(W, maxX + pad + 1) - left, height: Math.min(H, maxY + pad + 1) - top }
}
const crop = (box) => sharp(master).extract(box).png().toBuffer()
const full = await crop(visibleBox(0, H))
const icon = await crop(visibleBox(0, gapTop))
const wordmark = await crop(visibleBox(gapBottom, H))

const sizes = {}
for (const [name, buf, prefix] of [['full', full, 'logo'], ['icon', icon, 'logo-icon'], ['wordmark', wordmark, 'logo-wordmark']]) {
  const m = await sharp(buf).metadata()
  sizes[name] = { aspect: +(m.width / m.height).toFixed(4) }
  for (const h of HEIGHTS) {
    await sharp(buf).resize({ height: h }).webp({ quality: 88, alphaQuality: 90, effort: 6 }).toFile(join(brandDir, `${prefix}-${h}.webp`))
  }
  console.log(`${prefix}: aspect ${sizes[name].aspect}`)
}

// ---------- favicons ----------
const square = (buf, size, pad, background) =>
  sharp(buf)
    .resize(Math.round(size * (1 - pad * 2)), Math.round(size * (1 - pad * 2)), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: Math.round(size * pad), bottom: Math.round(size * pad), left: Math.round(size * pad), right: Math.round(size * pad), background })
    .resize(size, size)
    .png()
    .toBuffer()

const clear = { r: 0, g: 0, b: 0, alpha: 0 }
const icoPngs = await Promise.all([16, 32, 48].map(async (s) => ({ size: s, buf: await square(icon, s, 0.02, clear) })))
writeFileSync(join(pub, 'favicon.ico'), toIco(icoPngs))
writeFileSync(join(pub, 'favicon-32.png'), await square(icon, 32, 0.02, clear))
writeFileSync(join(pub, 'apple-touch-icon.png'), await sharp(await square(icon, 180, 0.1, rgb(T.oat))).flatten({ background: rgb(T.oat) }).png().toBuffer())

/** Minimal ICO container with embedded PNGs (supported by every modern browser). */
function toIco(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  const dir = Buffer.alloc(16 * images.length)
  let offset = 6 + dir.length
  images.forEach(({ size, buf }, i) => {
    const o = i * 16
    dir.writeUInt8(size >= 256 ? 0 : size, o)
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1)
    dir.writeUInt16LE(1, o + 4)
    dir.writeUInt16LE(32, o + 6)
    dir.writeUInt32LE(buf.length, o + 8)
    dir.writeUInt32LE(offset, o + 12)
    offset += buf.length
  })
  return Buffer.concat([header, dir, ...images.map((im) => im.buf)])
}

// ---------- Open Graph image (1200×630) ----------
const OG_W = 1200
const OG_H = 630
const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">
  <defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="70"/></filter></defs>
  <rect width="100%" height="100%" fill="${T.espresso}"/>
  <circle cx="1080" cy="80" r="230" fill="${T.chili}" opacity=".85" filter="url(#b)"/>
  <circle cx="860" cy="640" r="220" fill="${T.cheese}" opacity=".7" filter="url(#b)"/>
  <circle cx="90" cy="600" r="160" fill="${T.chili}" opacity=".45" filter="url(#b)"/>
  <circle cx="300" cy="315" r="250" fill="${T.oat}" stroke="${T.cheese}" stroke-width="10"/>
  <text x="624" y="170" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="34" fill="${T.oat}" letter-spacing="6">${xml(BRAND_NAME.toUpperCase())}</text>
  <text x="620" y="260" font-family="Arial Black, Segoe UI Black, Arial, sans-serif" font-weight="900" font-size="84" fill="${T.cheese}" letter-spacing="-2">SIP. BITE.</text>
  <text x="620" y="350" font-family="Arial Black, Segoe UI Black, Arial, sans-serif" font-weight="900" font-size="84" fill="${T.oat}" letter-spacing="-2">REPEAT.</text>
  <text x="624" y="420" font-family="Segoe UI, Arial, sans-serif" font-weight="600" font-size="34" fill="${T.oat}" opacity=".85">Coffee · Smash burgers · Wraps</text>
  <text x="624" y="470" font-family="Segoe UI, Arial, sans-serif" font-weight="600" font-size="30" fill="${T.cheese}">Islamabad</text>
</svg>`
const ogLogo = await sharp(full).resize({ height: 420 }).toBuffer()
const ogLogoMeta = await sharp(ogLogo).metadata()
await sharp(Buffer.from(bgSvg))
  .composite([{ input: ogLogo, left: Math.round(300 - ogLogoMeta.width / 2), top: Math.round(315 - ogLogoMeta.height / 2) }])
  .png({ compressionLevel: 9 })
  .toFile(join(brandDir, 'og-image.png'))

// ---------- generated TS (sizes for width/height attrs) ----------
const ts = `// GENERATED by scripts/brand-assets.mjs. Do not edit by hand; re-run \`npm run brand\`.
export const BRAND_HEIGHTS = ${JSON.stringify(HEIGHTS)} as const
export const BRAND_ASPECT = ${JSON.stringify({ full: sizes.full.aspect, icon: sizes.icon.aspect, wordmark: sizes.wordmark.aspect })} as const
`
writeFileSync(join(root, 'src/components/brand/brandAssets.ts'), ts)
console.log('done: webp ×12, favicon.ico, favicon-32.png, apple-touch-icon.png, og-image.png, brandAssets.ts')
