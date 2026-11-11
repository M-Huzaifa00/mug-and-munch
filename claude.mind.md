# claude.mind.md: Mug n Munch project brain

> **Read this whole file before every task.** It is the single source of context for a new chat. Never rebuild anything marked ✅.
> After every task: update the status tables, file map, owner TODOs, known issues and changelog here (Asia/Karachi dates).

---

## 0. Start here: current state (2026-11-11)

- **What it is:** frontend-only website for **Mug n Munch**, a real café in **Ghouri Town Phase 5B, Islamabad** (coffee, matcha, mojitos, zinger + beef smash burgers, a steak, triangle wraps, starters). Instagram: **https://www.instagram.com/mugnmunchh/**.
- **Ordering = WhatsApp only, no backend.** Checkout builds a WhatsApp message (wa.me). Never fake an "order placed" / "confirmed".
- **Phases 1–5 ✅, Munch Run ✅, real-menu work ✅. Next: Phase 6 (polish & QA) ⬜**, wait for the owner's "next".
- **Menu = ONLY the owner's list** (section 2). Items without a price show **"Price coming soon"** and can NEVER reach the cart. Nothing invented (no fake items, prices, deals, reviews, bestseller claims).
- **Loading:** the **0→100 preloader runs on every full page load, on any route** (calm variant for reduced motion). There is **no Suspense loading screen** anywhere (PageLoader deleted); page chunks are prefetched after load.
- **Hero = "Golden Hour Stage"** (owner asked for an awwwards-level redesign, 2026-11-11): live info row (open badge + address) → "Bhook lagi? We got you." → picture-typography headline "SIP. (frappe capsule) BITE. (box capsule) REPEAT. (Munch Run burger parked inline)" → hero line + CTAs → golden-hour **cinema panel** that grows to full width on scroll; warm pre-blurred photo wash behind. Text copy is fixed by the owner: never change "Bhook lagi? We got you.", "SIP. BITE. REPEAT.", `site.heroLine`, "Order Now", "See the Menu".
- **Navbar = floating islands** (owner: link names + cart icon are perfect, design revamped): logo island, centre link pill (≥1024px; numbered 01–04, letters roll, one gliding blob), chili "Order Now ↗" + cart; below 1024px a menu button opens a full-screen espresso menu (circle wipe, giant links, open badge, address, Instagram).
- **Craft your own:** all three makers **playable** (`site.craftMakers` = `'play'`), opens on Burger; CTA = disabled **"Add to cart · coming soon"**; burger/wrap placeholder prices hidden (coffee shows real menu prices). **Spin (roulette):** lands on any menu item, add = "coming soon" (`site.spinOrdering: false`) + "See it on the menu".
- **Repo:** https://github.com/M-Huzaifa00/mug-and-munch, branch `main`. Local commit after each completed step; push only when the owner says so / end of a phase, after build + lint + tests pass. **Last pushed: 2026-11-11** (owner asked to push after the deals + hero round).
- **Owner / contacts in chat:** the owner sends menu updates forwarded from **Syed Ahmed** (café side). The repo owner's git user is `M-Huzaifa00`.

### Hard rules (never break)
1. **Colours are LOCKED:** never edit/add/remove tokens in the `@theme` block of `src/styles/index.css`. New shade → opacity (`bg-chili/15`) or `color-mix` of tokens. `--brand-ink` (in `src/styles/brand.css`) is for mascot / illustration lines only. No raw hex in components.
2. **Brand name:** visible text is **"Mug n Munch"** from `site.brandName` (never hardcode). `site.alternateName` = "Mug & Munch" (JSON-LD only).
3. **Honest persuasion only:** no fake timers, stock, viewer counts, reviews, "bestseller"/"everyone orders this" claims, savings or deals. Placeholder reviews render in DEV only, labelled "sample".
4. **Only orderable things reach the cart** (section 4 "Cart integrity"): `PricedItem` types + `useAddToCart` guard + `syncCart()` purge.
5. **Owner data lives in `src/config/site.ts` and `src/data/*`.** Never hardcode prices, hours, numbers, addresses in components.
6. Before any push: `npm run build` (0 TS errors) + `npm run lint` (0 warnings) + `npm test` (all green).
7. Voice: English-first, max **1 Roman Urdu line per section**. Tagline **Sip. Bite. Repeat.** Urdu wordmark **مگ اینڈ منچ**.
8. GSAP inside `useGSAP({ scope })` + `gsap.matchMedia()` with `MQ.motionOk`; GSAP and Motion never on the same element; don't mix Tailwind `translate/rotate/scale-*` with GSAP transforms on one element.

---

## 1. Vision, audience, brand

- **Goal #1:** colour + motion + micro-interactions make visitors tap "Add to cart" within 30 seconds. **Goal #2:** feels local to Pakistani Gen Z (students, young professionals, late-night crowd); fast on mid-range Android (mobile-first, 360px design width).
- **Stack:** Vite 8 + React 19 + TypeScript 7 strict · Tailwind v4 (`@tailwindcss/vite`, tokens in `@theme`, no tailwind.config) · GSAP 3.15 + all plugins (registered once in `src/lib/gsap.ts`) + `@gsap/react` · Lenis 1.3 (driven by gsap.ticker; native touch scroll on phones) · Motion 14 (UI state only) · React Router 8 (lazy pages) · Zustand 5 + persist (`mm-cart`) · RHF 7 + Zod 4 · lucide · sonner · canvas-confetti · Fontsource variable fonts · Vitest 5 · oxlint · sharp (asset scripts).
- **Commands:** `npm run dev` (port 3000, `--host`) · `npm run build` · `npm run preview` · `npm run lint` · `npm test` · `npm run brand` (logo assets) · `npm run photos` (hero photo).

### 1b. Logo (owner file `public/brand/logo.png`, 3242×3948 transparent PNG)
- Stacked lockup: cheeky kid's head (curl-cloud hair, soft white cap with nub, wink, "ↄ" nose, tongue grin, "+" ear) balancing a checkered-paper tray (bean-emblem coffee cup with 3 flame steam wisps, sesame burger, wrap in a cone) over the wordmark "MUG n MUNCH" (heavy geometric caps + tall brush-script "n"). Thick monoline, retro diner-sticker look, one maroon ink ≈ `#901F10`, white fills.
- Token mapping: maroon → `--brand-ink: color-mix(in oklab, var(--color-chili) 53%, var(--color-espresso))` ≈ `#8A311F` (7.6:1 on oat), exposed as `BRAND_INK` in `src/lib/brand.ts`. On dark sections the logo sits on an **oat badge** (`tone="light"`), never recoloured.
- `scripts/brand-assets.mjs` auto-detects the empty band (rows 2782–3028) to crop `icon` and `wordmark`.

### 1c. Mascot: **Munchy**
- **Kawaii chibi redesign (2026-11-11, owner: "mascots look dangerous, make them as cute as possible")**: big round face fully visible, curls BEHIND the head framing it (never covering the face), soft cap with a little side brim + scalloped curly bangs, huge glossy eyes with two sparkle highlights, rosy blush, tiny nose curl, filled happy "D" smile with a pink tongue, little chili heart on the chest, café tray centred on the cap. Wink = happy "^"; sad = worried brows + tear (never angry); guilty = cheeky half-lids. Lines `--brand-ink`, fills oat, blush bubblegum. Keep it cute: no frowning brows, no hair over the face, no scar marks. Named `data-part` groups unchanged: rig, body, head, face, eyeL, eyeR, pupilL, pupilR, eyelids, mouth (+ morphable `mouthShape`), armL, armR, legs, steam, blush, accessory, cap, tear, crumbs, zzz, sparkles. Pivots used by GSAP: shoulders 100,242 / 146,240, neck 128,230, feet 122,300.
- Munch Run forms share a kawaii face (`munchRun/forms/MunchFace.tsx`): bigger eyes with two highlights, open smile with a pink tongue, rosier blush.
- Moods (`<Mascot mood>`; static pose = reduced-motion fallback; timelines in `useMascotAnimation`): `idle`, `follow`, `wave`, `excited`, `sleep`, `sad`, `guilty`, `dance`, `peek` (+ `onPeekEnd`). Mouth morphs (MorphSVG). `reactive` → first add of session = wave, every add = excited, 30 s idle = sleep.
- Where: hero behind the Order Now button (`HeroOrderPeek`: peek → follow desktop / idle touch, excited on button hover) + mini Munchy in the hero pills (`MiniMunchy`), preloader (wave), deals page, Find Us card, empty cart (sleep), empty search + item-not-found (sad), 404 (guilty), order success (dance). DEV playground `/mascot-lab`.

---

## 2. Owner facts, decisions and the real menu

### 2a. Business facts (from the owner)
| Fact | Value | Where |
|---|---|---|
| Address | **Ghouri Town Phase 5B, Islamabad** (shop # / street unknown) | `site.address` (`line1: ''`, `area`, `city`); `addressLine` helper skips empty parts |
| Map | no exact pin yet → map embed + directions **search the address** | `site.address.lat/lng = null`, `mapsUrl` = Google Maps search link |
| Instagram | `mugnmunchh` → https://www.instagram.com/mugnmunchh/ | `site.socials.instagram`, `instagramUrl` |
| TikTok | none given → **hidden** (never link a handle we don't own) | `site.socials.tiktok = ''`, `tiktokUrl = null` |
| Phone + WhatsApp (ALL orders go here) | **0347 5253550** → `whatsappNumber: '923475253550'`, `phoneHref: tel:+923475253550` (owner, 2026-11-12). Online WhatsApp ordering is now LIVE in production | `site.contact` |
| Footer credit | "Designed & developed by M-Huzaifa00" → https://github.com/M-Huzaifa00 | `site.credit`, `Footer.tsx` |
| Email / hours / delivery areas / fees | **still placeholders** (see section 6) | `site.ts` |

### 2b. Owner decisions log (respect these)
- 2026-11-11: Items without a price → **"Price coming soon"**, not orderable (no placeholder prices on real items).
- 2026-11-11: Remove everything not on the list (old sides / desserts / soft drinks / invented deals). Deals pages say "coming soon" until real deals arrive.
- 2026-11-11: Coffees match the list: one price; flavoured lattes Hot / Cold / Blended **at the same price**; no sizes / milks / sweetness / add-ons.
- 2026-11-11: "Bestsellers" renamed **"Our picks"** (no sales data → no popularity claims); picks = `featured: true` in `data/menu.ts`.
- 2026-11-11: Hero photo tried as postcard → soft banner (rejected: "doesn't look good, repels") → photo window → owner asked to **totally redesign hero + navbar "like an awwwards-winning website"** → current "Golden Hour Stage" + islands navbar. Keep hero texts and nav link names + cart icon exactly.
- 2026-11-11: Only the 0→100 loader; remove the Suspense loading screen ("looks bad").
- 2026-11-11: Craft makers: briefly switched off, then owner: **keep burger + coffee (+ wrap) makers as they were, playable, with "Add to cart · coming soon"** so the start feels simple; same for the Spin ("add to cart coming soon").
- 2026-11-11: **"What's your vibe?" replaced by a Deals section** ("make it sexy"); **Spin (Snack Roulette) hidden from Home** (code kept). Hero: only light polish allowed now ("don't add over-complications").

### 2c. The real menu (`src/data/menu.ts`; owner list from Syed Ahmed, 2026-11-07 + Starters 2026-11-11)
Categories (`CATEGORY_ORDER`): Coffee → Starters → Burgers → Wraps → Steaks → Matcha → Teas & Mojitos. `null` = "Price coming soon".
| Category | Items (PKR) |
|---|---|
| Coffee: espresso speciality | Espresso 499 · Americano 499 · Cappuccino 650 · Latte 650 · Flat White 699 · Mocha 699 |
| Coffee: flavoured speciality (**Hot / Cold / Blended**, same price) | Caramel Latte 750 · Hazelnut Latte 750 · Spanish Latte 750 ⭐ · French Vanilla Latte 799 · Tiramisu Latte 799 ⭐ |
| Starters | Simple Fries null · Loaded Fries null · Munch Club (club sandwich) null ⭐ · Golden Munch Wings null · Nuggets null |
| Burgers: zinger | Munch Zinger Burger null (single) · Munch Special Burger null (single) · Munch Overload null (double) ⭐ · Munch Hellfire null (double, 🌶️ spicy) ⭐ |
| Burgers: beef smash | Munch Smash null (single) · Smash Beast null (double) ⭐ · Smash Monster null (triple) |
| Steaks | Munch Signature Steak null ⭐ |
| Wraps (triangle-shaped) | Jalapeño Jolt null (🌶️) ⭐ · BBQ Blaze null · Creamy Crush null |
| Matcha (whisked) | Classic Matcha 800 · Vanilla Matcha 950 · Strawberry Matcha 999 ⭐ |
| Teas & Mojitos | Peach Iced Tea 650 · Raspberry Iced Tea 650 (list said "650 -", confirm) · Tea / Chai 300 · Green Tea null · Green Apple Mojito 750 · Blue Mint Mojito 750 ⭐ · Passion Fruit Mojito null |
⭐ = `featured` ("Our picks"). Totals: **37 items, 19 orderable, 18 "Price coming soon"**. Descriptions only restate the list (patties, shape, flavour), no invented ingredients. Spelling fixes from the list: "Jalepino" → Jalapeño, "singal" → single, "tipple" → triple.

---

## 3. Feature status
✅ done · 🟡 partial · ⬜ todo

### Phase 1: Foundation ✅
| Feature | Status | Files |
|---|---|---|
| Vite + React + TS strict, `@/` alias | ✅ | `vite.config.ts`, `tsconfig.app.json` |
| Tailwind v4 tokens, grain / sticker / glass utilities, keyframes, reduced-motion CSS | ✅ | `src/styles/index.css` |
| Self-hosted fonts (Bricolage, Plus Jakarta, Caveat, Noto Nastaliq Urdu) | ✅ | `src/main.tsx` |
| GSAP + plugins registered once, `MQ`, `refreshScrollTriggersSoon` | ✅ | `src/lib/gsap.ts` |
| Animation presets (EASE incl. CustomEase bouncy/squish/snappy, DUR, STAGGER, SPRING, MASCOT, SCENE, MUNCH_RUN) | ✅ | `src/lib/motion-presets.ts` |
| Lenis on gsap.ticker + ScrollTrigger sync; off for reduced motion; refresh after load/fonts | ✅ | `src/app/providers/SmoothScroll.tsx` |
| Router, all pages lazy; **no Suspense loader** (blank oat fallback + `PageReady` signal; chunks prefetched on idle) | ✅ | `src/app/router.tsx`, `routes.tsx` (`LOADERS`, `prefetchPages`), `RootLayout.tsx` |
| Scroll-to-top on page change (Lenis + modal aware) | ✅ | `ScrollToTop.tsx` |
| Per-page SEO | ✅ | `Seo.tsx` |
| **Islands navbar** (2026-11-11): logo island (glass sticker + wordmark tucks on scroll), centre link pill ≥1024px (`NavLinksPill`: 01–04 numbers, `RollText` hover roll, Motion `layoutId="nav-blob"`: espresso on hover, cheese on current page), "Order Now ↗" (arrow turns on hover) + cart; <1024px `MenuToggle` → `MenuOverlay` (z-60 dialog, circle wipe from the button, giant numbered links, open badge, address, Instagram, Order Now; focus trap + Esc + scroll lock, closes on navigation; reduced motion = fade). Hides on scroll down. Fixes the old 768px link wrap | ✅ | `layout/Navbar.tsx`, `layout/NavLogo.tsx`, `layout/nav/{NavLinksPill,RollText,MenuToggle,MenuOverlay}.tsx`, `useScrollState.ts` |
| Cart button (aria-live count), mobile bottom tab bar + "View cart · Rs X" pill, WhatsApp FAB, footer | ✅ | `components/layout/*` |
| Live Open/Closed badge (Asia/Karachi, overnight hours) | ✅ | `lib/hours.ts`, `ui/OpenBadge.tsx` |
| Button / ButtonLink / `buttonClasses(variant, size, className)` (positional args!) | ✅ | `ui/Button.tsx`, `ui/buttonClasses.ts` |
| Vendor chunks (react / gsap / motion / forms / vendor) | ✅ | `vite.config.ts` |

### Phase 2: Cart & commerce ✅
| Feature | Status | Files |
|---|---|---|
| Cart store (addItem → `{lineId, isFirstAdd}`, remove/updateQty/restore/clear/undoLastAdd, drawer state, option-hash merging, `reprice()` that **drops** unorderable lines) | ✅ | `src/store/cart.ts` |
| Option pricing / labels / defaults; `priceLine` + `repriceLines` re-price any line from current data | ✅ | `src/lib/itemOptions.ts` |
| ProductCard (default + compact; "Price coming soon" pill, no "+" / Add cursor when unpriced) | ✅ | `ui/ProductCard.tsx`, `ui/PriceComingSoon.tsx` |
| ProductImage (`virtual:photos`, styled emoji fallback + logo watermark) | ✅ | `ui/ProductImage.tsx`, `vite.config.ts` |
| Home "Kya khaoge aaj?" menu preview (coffee / burger / wrap tabs; picks → priced → rest) | ✅ | `sections/home/MenuPreview*.tsx`, `lib/menuFilter.ts` |
| Menu page (sticky scroll-spy chips, search, filters **Order online / Spicy / Our picks**, `?q=`, **`#cat-<category>` deep links**) | ✅ | `pages/Menu.tsx`, `components/menu/*` (`menuIds.ts`: `sectionId`, `JUMP_OFFSET`, `menuCategoryHref`) |
| Item modal / page (`ItemIntro` + orderable view with options & sticky add bar, or coming-soon view with call link; "from" only when options change price) | ✅ | `components/item/*`, `pages/ItemDetail.tsx` |
| CartDrawer (swipe-to-remove, free-delivery bar, upsell (priced only), summary, empty state + craft links) | ✅ | `layout/CartDrawer.tsx`, `layout/cart/*` |
| Fly-to-cart, jelly bounce, odometer, first-add confetti, toasts + Undo | ✅ | `hooks/useFlyToCart.ts`, `hooks/useAddToCart.ts`, `lib/celebrate.ts`, `lib/notify.tsx` |

### Phase 3: Brand, mascot & Home wow ✅
| Feature | Status | Files |
|---|---|---|
| Brand asset pipeline (logo/icon/wordmark WebP, favicons, apple icon, OG image, generated aspect ratios) | ✅ | `scripts/brand-assets.mjs`, `public/brand/*`, `components/brand/brandAssets.ts` |
| `Logo` / `BrandImage` / `LogoStamp` | ✅ | `components/brand/*`, `lib/brand.ts`, `styles/brand.css` |
| index.html build vars (`%BRAND_NAME%`…), icons, OG; **static `#mm-boot` first frame** | ✅ | `index.html`, `vite.config.ts` (`siteHtmlVars`) |
| Logo 5-click coffee-spill easter egg | ✅ | `lib/easterEgg.ts`, `layout/CoffeeSpill.tsx` |
| Munchy mascot (9 moods, mouth morph, reactions) | ✅ | `components/mascot/*` |
| **Preloader (THE loading screen)**: every full load, any route. `index.html` paints the same first frame, React takes over: count 0→88, hold (wave rolling) until the routed page mounted (`PageReady`) + fonts (≤1.2 s) [max 6 s], → 100, Munchy pops, curtain slides up (transform) while the page intro plays. Reduced motion: calm version (logo full, count, fade). Scroll locked meanwhile. | ✅ | `layout/Preloader.tsx`, `lib/preloader.ts` (phase store loading → revealing → done, `markPageReady`/`whenPageReady`, `removeBootScreen`), `RootLayout.tsx`, `index.html` |
| **Hero "Golden Hour Stage"** (2026-11-11): `HeroMeta` (OpenBadge + 📍 address → /find-us) · "Bhook lagi?" · `HeroHeadline` (SplitText elastic chars, DrawSVG underlines, **cartoon pills, no images** inside the type (`HeroPills.tsx` + `MiniMunchy.tsx`, em-sized; GSAP grows each pill scaleX on intro): **SIP pill** (caramel) = mini Munchy, eyes shut in bliss, sipping a kawaii iced coffee through a bendy chili straw (oat dashes flow along it, cheeks puff, hearts float, cup squishes); **BITE pill** (cheese) = mini Munchy leans in and chomps a kawaii burger (bun squish, crumbs, "nom!", chewing bob). Loops pause off-screen, run 2.5× on hover; desktop: letters hop on hover, SIP/BITE units drift apart on scroll (REPEAT. never moves: it holds the Munch anchor); inline Munch Run Stop 1 slot after REPEAT.) · line + magnetic Order Now / See the Menu, with **`HeroOrderPeek`**: Munchy hides behind Order Now (clipped window at the button middle), peeks up, waves, settles (follow on desktop / idle on touch), bubble "psst… order here! 👇"; hover/focus the button → excited jump + "yes, that one! 😋" · `HeroCinema` (full-colour sticker panel; scrubbed scale 0.86→1 desktop / 0.93→1 phone + img zoom 1.25→1.02 + drift, transform only; big Caveat caption, LogoStamp, editorial labels "( 01 ) — Golden hour" + address, cursor bubble "Golden hour ✨", "☕ Coffee from Rs X →" chip = cheapest priced coffee → /menu#cat-coffee) · `HeroBackdrop` (pre-blurred photo wash). No corner mascot, no spin badge (owner: don't clutter) | ✅ | `sections/home/hero/{Hero,HeroMeta,HeroHeadline,HeroCapsule,HeroCinema,HeroBackdrop,heroPhotoSrc,HeroMascot}.tsx`, `scripts/photo-assets.mjs`, `data/heroPhoto.ts` (generated, incl. `blur`) |
| Marquee (2 tilted strips, scroll-velocity speed; item line = "Our picks") | ✅ | `sections/home/Marquee.tsx` |
| **"Our picks"** strip (was Bestsellers; ids/file still `bestsellers`): desktop pin + scrub, mobile snap carousel, Caveat notes | ✅ | `sections/home/Bestsellers.tsx` |
| **Home deals section** (2026-11-11, in the old Vibe Picker slot after Craft): chili stage, giant drifting "DEALS ✦ COMBOS" backdrop type, "paisay bachao, pait bharo 💸". **Deals exist since 2026-11-12** (7 proposed combos) → up to 4 DealCards + "See all deals". **No deals** → "Deals are cooking" + golden-ticket teaser (`DealsTicket`: notched cheese ticket, "??? ✦ ???", "Rs ???", spinning "coming soon" stamp `animate-stamp-spin`, sheen sweep, Munchy waving) + Follow @instagram / Order from the menu. **Deals exist** → same stage with up to 4 `DealCard`s + "See all deals". Loops pause off-screen | ✅ | `sections/home/deals/{DealsStrip,DealsTicket,DealCard}.tsx` |
| Reviews (sticker board + IG grid; placeholders DEV-only) | ✅ | `sections/home/reviews/*`, `data/reviews.ts` |
| Find Us teaser (open/closed, hours, address line, directions + call) | ✅ | `sections/home/FindUsTeaser.tsx` |
| Footer wordmark reveal; page-transition wipe (chili/cheese + logo, ~0.6 s; skipped for item modal links) | ✅ | `layout/FooterWordmark.tsx`, `layout/PageTransition.tsx` |

### Phase 4: Toys ✅
| Feature | Status | Files |
|---|---|---|
| Vibe Picker (**not on Home since 2026-11-11**, code kept; Sleepy / Hangry / Study grind / Thirsty / Midnight munchies; Flip reshuffle; "Add" only the priced picks) | ✅ | `sections/home/vibe/VibePicker.tsx`, `data/toys.ts` |
| Snack Roulette (**hidden from Home since 2026-11-11**, code kept; any menu item can land; "Add · coming soon" while `site.spinOrdering` is false, or for unpriced items; "See it on the menu" opens the item modal) | ✅ | `sections/home/roulette/*`, `data/toys.ts` |
| Custom cursor ("Add +", "Drag", `view` label) | ✅ | `app/providers/Cursor.tsx` |
| Sounds | ⬜ never built | — |

### Phase 5: Craft, WhatsApp checkout, content pages ✅
| Step | Scope | Status | Files |
|---|---|---|---|
| 1–3 | Builder kit + ONE "Craft your own" section (id `craft`, `#craft-<tab>` deep links, state per tab, lazy makers, opens on Burger). Per maker `site.craftMakers`: `'order'` (adds to cart) / `'play'` (CTA "Add to cart · coming soon", disabled) / `'off'` (hidden; deep links fall back). Currently **all `'play'`**. `BuilderModeContext` per maker → `IngredientTile` hides prices + `BuilderActions` shows the coming-soon CTA (+ note); `showPrices` = coffee always, burger/wrap only when `BURGER_PRICES_CONFIRMED` / `WRAP_PRICES_CONFIRMED` | ✅ | `components/builder/*` (`builderMode.ts`), `sections/home/craft/*` |
| Coffee maker: drinks = priced Coffee items; Hot/Cold/Blended on flavoured lattes; size / milk / add-on / sweetness steps only if a drink has them | ✅ | `craft/CoffeeMaker.tsx`, `data/coffeeBuilder.ts` |
| Burger maker (realistic layer art) / Wrap maker | ✅ playable, ordering coming soon | `craft/BurgerMaker.tsx` (+`burgerArt.tsx`), `craft/WrapMaker.tsx`, `data/builder.ts`, `data/wrapBuilder.ts` (PLACEHOLDER prices, hidden) |
| 4 | Order logic (phone, totals, order number, order snapshot, zod schema, WhatsApp message < 2,000 chars, `submitOrder` stub unused) | ✅ | `src/lib/{phone,orderTotals,orderNumber,order,orderApi,checkoutSchema,whatsapp}.ts` |
| 5 | `describeLine` (one formatter everywhere), re-pricing, merge rules, Edit/Tweak, tag chips | ✅ | `lib/lineDescription.ts`, `layout/cart/*`, `craft/useCraftEdit.ts` |
| 6–8 | Checkout (order types, pickup slots, validation, draft, remember-me, cash only, sticky CTA), synchronous wa.me flow, order success (pending → "Yes, I've sent it" → sent) | ✅ | `pages/Checkout.tsx`, `components/checkout/*`, `pages/OrderSuccess.tsx` |
| 9 | Deals page: "Deals are coming soon" card while `deals` is empty (filters/grid when deals exist) | ✅ | `pages/Deals.tsx`, `data/deals.ts`, `lib/dealWindow.ts` |
| 10–12 | Our Story (no invented facts), Find Us (address-search map until a pin exists), 404 (search + 3 picks) | ✅ | `pages/OurStory.tsx`, `data/story.ts`, `pages/FindUs.tsx`, `sections/findus/*`, `pages/NotFound.tsx` |

### Feature: Munch Run ✅ (decorative scroll traveler on Home)
- Burger (hero) → hops the marquee → morphs into a wrap (MenuPreview) → coffee (Our picks). Config `data/munchRun.ts` (Stop 1 anchor perches top-right of the hero visual box), timings `MUNCH_RUN`. Engine `components/munchRun/useMunchRun.ts` (morph timelines **pre-rendered on mount** to avoid mid-scroll hitches). aria-hidden, never focusable. Reduced motion → `MunchStatic`.
- **Stop 1 = inline slot after "REPEAT."** in the hero headline (`anchorClass: 'top-0 left-0'`, note on the right). Parks with 0px delta at 360 / 768 / 1440.
- **Tap:** opens `#craft-<form>` unless that maker is `'off'` (then the menu category, `/menu#cat-…`); cursor label "Make one".

### Real-menu integration ✅ (2026-11-11)
| Part | Files |
|---|---|
| `price: number \| null`, `PricedItem`, `isPriced()`, `featured` / `getFeatured()`, `getPricedItems()`, 7 categories | `data/menu.ts` |
| Tests: `setup.ts` adds test-only items (every option group) + a test deal + all makers on, so those paths stay covered; `menu.test.ts` = data integrity, unpriced, Hot/Cold/Blended, makers-off | `src/lib/__tests__/*`, `vite.config.ts` (`test.setupFiles`) |

### Phase 6: Polish & QA ⬜ (next)
Reduced-motion + low-end audit, a11y pass, JSON-LD openingHours, image optimisation, Lighthouse mobile ≥ 90 ×4 (report scores), 360/768/1440 checks, 768px navbar wrap fix, Nastaliq font subset, consider lazy GSAP plugins / LazyMotion.

---

## 4. How the important systems work

### Cart integrity (only the owner's orderable menu can be ordered)
1. **Types:** `unitPriceFor` / `toCartInput` accept only `PricedItem` → UI must check `isPriced(item)` first.
2. **`useAddToCart` guard** (every UI add goes through it): re-checks the input with `priceLine()` against current data; unavailable → toast "Sorry, X isn't available to order right now", nothing added; otherwise the **data's** price is used.
3. **`priceLine(line)`** says unavailable for: item gone from the menu, item with `price: null`, removed option / ingredient, custom burger/wrap while that maker is off (`site.craftMakers`), deal gone or containing an unpriced item.
4. **`syncCart()`** (`lib/cartSync.ts`) = `cart.reprice()` (drops unavailable lines, updates prices) + ONE notice ("2 items aren't on the menu right now, so we took them out of your cart." / "Some prices were updated."). Runs: once after the preloader on every load (RootLayout), when the drawer opens, on checkout arrival, and right before sending (if anything was removed, sending stops with an error-summary line).
5. Totals never count `unavailable` lines (`orderTotals.ts`).

### Loading
- `index.html` adds `.mm-boot` and paints `#mm-boot` (oat + faint logo) before JS (`<noscript>` hides it). `lib/preloader.ts` starts in phase `loading` on every load. `RootLayout` renders `<Preloader />` until `done`; `<PageReady />` inside the page Suspense boundary calls `markPageReady()` when the routed page has mounted. After `done`: remove boot frame, `syncCart()`, `prefetchPages()` on idle (`requestIdleCallback.bind(window)`).
- Pages wait on the phase: Home `play` (hero intro) = phase !== `loading`; Menu `#cat-` deep link waits for `done` (scroll is locked during the preloader).

### Hero photo
- Master `assets/photos/hero-golden-hour.png` (not shipped) → `npm run photos` → 4:3 crop (`FOCUS_X` 0.6) AVIF + WebP at 480/720/960/1189 + a 160px pre-blurred `-blur.webp` (<1 KB) in `public/images/brand/` + generated `src/data/heroPhoto.ts`.
- Used two ways: the cinema panel (full srcset, lazy) and the backdrop wash (blur file, upscaled, oat gradient on top, `-z-10` under the grain).
- Photo crops: the cinema uses `object-position` per breakpoint in `HeroCinema`; retune if the photo changes. The headline pills are pure SVG (no photo).

### Mobile scroll
- Lenis is off for touch (native scroll). `lenis.css` gives `[data-lenis-prevent-wheel]` `overscroll-behavior: contain` on both axes; an unlayered rule in `index.css` sets y back to `auto` (otherwise vertical swipes starting on the Our-picks carousel / Menu chips never scroll the page).

---

## 5. File map
```
index.html                      build vars, icons, OG, #mm-boot static first frame (every load)
vite.config.ts                  react + tailwind, @ alias, vendor chunks, virtual:photos, siteHtmlVars, test.setupFiles
scripts/brand-assets.mjs        logo crops/sizes, favicons, apple icon, OG image, brandAssets.ts (npm run brand)
scripts/photo-assets.mjs        hero photo → AVIF/WebP + data/heroPhoto.ts (npm run photos)
assets/photos/                  photo masters (not shipped)
public/brand/                   logo.png master + generated logo*/og-image; public/favicon*, apple-touch-icon
public/images/{coffee,burgers,wraps,sides,drinks,desserts,deals,brand}/   photos as <slug>.webp (+ hero-golden-hour-*)
src/main.tsx                    fonts, lenis.css, index.css, brand.css, <App/>
src/styles/index.css            @theme tokens (LOCKED), base, utilities, lenis overscroll fix, keyframes, reduced-motion CSS
src/styles/brand.css            --brand-ink
src/app/App.tsx                 MotionConfig + SmoothScroll + RouterProvider + Toaster
src/app/router.tsx, routes.tsx  data router; LOADERS + lazy pages + prefetchPages(); /mascot-lab DEV only
src/app/RootLayout.tsx          routes (background ?? location), PageReady, Preloader, syncCart + prefetch after load, chrome, CartDrawer, PageTransition, ItemModal
src/app/providers/              SmoothScroll (Lenis), Cursor
src/config/site.ts              owner settings: brand, craftMakers (order|play|off), spinOrdering, contact, address (+addressLine), socials (+instagramUrl, tiktokUrl|null), hours, commerce, orderPrefix, tableCount, etaMinutes, payments, addressNotes, deliveryAreas
src/data/menu.ts                REAL menu (price null = coming soon; featured; categories + meta + order)
src/data/deals.ts               Deal type + helpers; deals = [] (none yet)
src/data/toys.ts                VIBES (5 moods), ROULETTE_ITEMS (priced only)
src/data/coffeeBuilder.ts       coffee maker icons/tints; COFFEE_DRINKS derived from priced Coffee items
src/data/builder.ts, wrapBuilder.ts   burger / wrap maker data (PLACEHOLDER prices, hidden until *_PRICES_CONFIRMED; makers playable)
src/data/story.ts               Our Story copy + owner facts (render only when filled)
src/data/reviews.ts             PLACEHOLDER reviews (DEV only)
src/data/munchRun.ts            Munch Run stops / anchors / thresholds
src/data/heroPhoto.ts           GENERATED by npm run photos
src/lib/gsap.ts, motion-presets.ts, brand.ts, notify.tsx, utils.ts, events.ts (track stub), easterEgg.ts, celebrate.ts, routing.ts
src/lib/preloader.ts            phase store (usePreloaderPhase/getPreloaderPhase/setPreloaderPhase), markPageReady/whenPageReady, removeBootScreen
src/lib/cartSync.ts             syncCart(): purge + re-price + one notice
src/lib/itemOptions.ts          selections, unitPriceFor(PricedItem), optionLabels, toCartInput(PricedItem), priceLine, repriceLines
src/lib/lineDescription.ts      describeLine(): ONE formatter (drawer / checkout / WhatsApp / success)
src/lib/menuFilter.ts           filters (orderable / spicy / picks), getPreviewItems
src/lib/recommendations.ts      upsell rules (priced items only)
src/lib/orderTotals.ts          single source of money (skips unavailable lines)
src/lib/{phone,orderNumber,order,orderApi,checkoutSchema,whatsapp,pickupSlots,dealWindow,hours}.ts
src/lib/builder.ts, burgerBuilder.ts, wrapBuilder.ts   maker pricing + cart inputs
src/lib/__tests__/              setup.ts (test-only items/deal/makers), fixtures, menu, lines, whatsapp (+snapshots), orderTotals, builder, phone, pickupSlots, dealWindow, munchRunMath
src/store/cart.ts               Zustand cart (persist mm-cart v2: items + orderType); reprice() drops unorderable lines
src/hooks/                      useAddToCart (guard), useFlyToCart, useReducedMotion, useIsTouch, useScrollState, useScrollLock, useFocusTrap, useMagnetic, useMediaQuery, useDebouncedValue, useIdleMount, useIsItemPage, useIsCheckout, useTransitionNavigate
src/components/layout/          Navbar (islands), nav/{NavLinksPill, RollText, MenuToggle, MenuOverlay}, NavLogo, CartButton, CartDrawer (+cart/*: CartContents, CartLineItem, CartSummary, CartUpsell, FreeDeliveryBar, LineTag, EditCreationLink, CraftLinks), MobileBottomBar, WhatsAppFab, Footer, FooterWordmark, Preloader, PageTransition, CoffeeSpill, ScrollToTop, Seo, JsonLd, PagePlaceholder, navLinks
src/components/ui/              Button, buttonClasses, PriceComingSoon, DriftType, EditorialLabel, ProductCard, ProductImage, Badge, Chip, OpenBadge, SocialIcons, QuantityStepper, RollingNumber, Sticker, HandArrow, MagneticButton, Modal, Drawer, RevealHeading, LazyMount, StylisedMap
src/components/item/            ItemDetailContent (orderable / coming soon), ItemIntro, ItemOptionsForm, OptionPills, StickyAddBar, ItemModal
src/components/menu/            CategoryNav, MenuSearch, MenuSection, MenuEmpty, menuIds
src/components/builder/         builderMode (context: ordering / showPrices), IngredientTile, IngredientIcon, TileGroup, TileTray, BuilderActions (coming-soon CTA)
src/components/checkout/        CheckoutCard, CheckoutField, fieldStyles, OrderTypeSwitch, OrderTypeFields, DetailsFields, PaymentOptions, OrderReview, CheckoutTotals, SendOrderButton, ErrorSummary, CheckoutBanners, CheckoutEmpty, MessagePreview (DEV), OrderSnapshot, useCheckoutForm, useSendOrder
src/components/brand/           Logo, BrandImage, LogoStamp, brandAssets.ts (generated)
src/components/mascot/          Mascot, MascotFace, mascotPoses, useMascotAnimation, useMascotReactions, mascotFollow, mascotLook
src/components/munchRun/        MunchRun, MunchCharacter, MunchStop, MunchStatic, MunchNote, MunchPuffs, useMunchRun, munchRunMath, munchTimelines, munchActions, munchEffects, readEls, forms/*
src/sections/home/              hero/{Hero, HeroMeta, HeroHeadline, HeroPills (SipPill + BitePill), MiniMunchy, HeroOrderPeek, HeroCinema, HeroBackdrop, heroPhotoSrc}, Marquee, MenuPreview(+Tabs), Bestsellers ("Our picks"), craft/*, vibe/*, roulette/*, deals/*, reviews/*, FindUsTeaser, sectionIds
src/sections/story/, findus/    StoryPanels, StorySteps · HoursTable, MapFacade
src/pages/                      Home, Menu, ItemDetail, Deals, Checkout, OrderSuccess, OurStory, FindUs, NotFound, MascotLab (DEV)
REMOVED                         sections/home/Preloader.tsx (→ layout/Preloader), components/layout/PageLoader.tsx (no Suspense loader), Phase-4 builders
```

## 6. Owner TODOs (data still missing)
1. ~~WhatsApp number~~ DONE 2026-11-12 (0347 5253550). Still placeholder: `site.contact.email`.
2. **Prices for every `price: null`** in `data/menu.ts` (18 items: all burgers, steak, wraps, starters, Green Tea, Passion Fruit Mojito). Confirm Raspberry Iced Tea = 650. Real ingredients/descriptions if wanted.
3. **Address details:** shop # / street (`address.line1`), Google Maps share link (`mapsUrl`), exact pin (`lat`/`lng`, also enables JSON-LD geo), parking/landmark (`addressNotes`).
4. **Real opening hours** (`site.hours`, currently placeholders), **delivery areas** (current list is invented and far from Ghouri Town), delivery fee, free-delivery threshold, tax rate, min delivery order, ETA, table count, order prefix, real domain (`site.url`).
5. **Deals: CONFIRM the 7 proposed combos** in `src/data/deals.ts` (owner rule 2026-11-12: deals use ONLY items with a real menu price, so every card shows an honest "SAVE Rs X · −Y%" stamp): Study Buddy 2× Americano 849 (−149, 15%) · Latte Love Spanish + Caramel 1,249 (−251) · Chai Time 3× Tea/Chai 749 (−151) · Midnight Brew Mocha + Tiramisu 1,199 (−299, 20%, Best value, 11 PM–2 AM) · Matcha Duo 1,649 (−300) · Chill Pack 2 mojitos + Peach Iced Tea 1,799 (−351) · Squad Sips 2× Spanish + 2× Blue Mint 2,499 (−501). Set by the developer, not yet approved by the café. Food combos can follow once burgers/wraps/starters have prices.
6. **Custom burger / wrap orders?** If yes: real ingredient prices in `data/builder.ts` / `wrapBuilder.ts`, set `BURGER_PRICES_CONFIRMED` / `WRAP_PRICES_CONFIRMED = true` and `site.craftMakers.burger/wrap = 'order'`. Same for coffee creations (`craftMakers.coffee = 'order'`) and the Spin (`spinOrdering = true`) when the owner wants them orderable.
7. TikTok handle (optional), real reviews with permission (`data/reviews.ts`, `isPlaceholder: false`), real Instagram posts for `InstaGrid`, Our Story facts + photos (`data/story.ts`, `public/images/brand/{kitchen,team,counter}.webp`), product photos (`public/images/<folder>/<slug>.webp`, ~1200px).
8. Replace logo → `public/brand/logo.png` + `npm run brand`. Replace hero photo → `assets/photos/hero-golden-hour.png` + `npm run photos`.

## 7. Known issues / tech debt
- Not tested on a real Android phone (headless Chrome emulation only): check WhatsApp app hand-off and "back" to /order-success; real-device scroll feel.
- Refreshing while the item modal is open re-opens it over the page (history state survives refresh).
- Pickup slots / closed banner / deal windows are computed on page load (stale if a tab sits open for hours).
- The owner only learns about an order when the customer actually sends it in WhatsApp ("Yes, I've sent it" is the customer's word).
- Vitest prints a Node "localStorage is not available" ExperimentalWarning (Node 26 + zustand persist); tests pass.
- The preloader adds ~1.5–2 s to every full load (owner's choice); in-app navigation never shows it.
- Noto Nastaliq Urdu subset is 239 KB (footer only; Phase 6). GSAP (~86 KB gz) + Motion (~46 KB gz) in the shell.
- Our-picks pin uses ScrollTrigger pin spacing (full-page screenshots show an empty band above it; normal).
- Munch Run: no sounds; notes only ≥768px; low-end (≤4 cores) skips crumbs/sparkles.
- Coffee "Tweak" applies to every coffee in the maker list (maker and menu coffees are the same line by design). Editing a creation into one identical to another line merges them.
- OG image text uses system fonts (librsvg can't load the web fonts).
- Motion logs a DEV-only "Reduced Motion enabled" warning when the OS setting is on.

## 8. QA recipes (how previous sessions verified)
- Build + preview: `npm run build` then `npx vite preview --port 4173` (on Windows a running preview can lock `dist/` → rerun the build if it fails with a binding error).
- Browser checks use **headless Chrome via the DevTools Protocol** from a small Node script in the session scratchpad (Node 26 has a global `WebSocket`): launch `chrome.exe --headless=new --remote-debugging-port=…`, `Emulation.setDeviceMetricsOverride` (360×800 mobile / 1440×900), `Emulation.setEmulatedMedia` for reduced motion, `Page.captureScreenshot`.
- **Touch scrolling:** use `Input.dispatchTouchEvent` (touchStart → touchMoves → touchEnd). `Input.synthesizeScrollGesture` with `gestureSourceType: 'touch'` does NOT scroll in headless Chrome (false "stuck" results).
- Frame timing: rAF loop recording intervals per scroll position; CPU throttle via `Emulation.setCPUThrottlingRate` (headless caps frames near 30 fps under 4× throttle, so compare variants, not absolute fps).
- Munch Run parking check: compare `[data-mr="outer"]` rect with `[data-munch-stop="1"]` rect (delta should be 0).
- Old-cart purge check: seed `localStorage.mm-cart` (persist v2 shape `{state:{items,orderType},version:2}`) with a removed item before load → expect one toast and the line gone.

## 9. Future goals (not built)
Node/Supabase backend + orders DB · JazzCash / Easypaisa / card payments (need backend; `site.payments` + `TODO(payments)`) · admin menu editor · live order tracking · automatic owner notifications (WhatsApp Cloud API / Telegram bot; hook-in `lib/orderApi.ts` `submitOrder()`) · loyalty "Munch Points" · Urdu/English toggle · PWA · table QR ordering · reservations · analytics with consent · Foodpanda link-out · A/B tests.

---

## 10. Changelog (Asia/Karachi dates)
### 2026-11-12 (2): Priced-only deals with save stamps; editorial Deals / Our Story / Find Us
- Deals rebuilt from priced menu items only (7 combos, 15–20% off); `getDealSavingsPercent`, `getBestValueDeal`. DealCard: round chili "SAVE Rs X · −Y%" stamp + "★ Best value" ribbon. Deals page hero: `DriftType` "SAVE ✦ COMBOS ✦ DEALS", `EditorialLabel` "( 01 ) — The combos", stat chips (N combos · Save up to Rs X · Up to Y% off). Tests: every real deal must be fully priced and save money (96 tests).
- New shared UI: `components/ui/DriftType.tsx` (giant drifting background type, paused off-screen) and `components/ui/EditorialLabel.tsx` ("( 01 ) — Label" + hairline). Our Story: drift "SIP ✦ BITE ✦ REPEAT", labels 01 Our story / 02 How we make it / 03 Behind the counter. Find Us: drift "GHOURI TOWN PHASE 5B ✦ ISLAMABAD", big address line, labels 01 Find us / 02 Opening hours / 03 Delivery.
- Tea/Chai + Chai Time emoji → ☕ (🫖 renders as an empty box on Windows / older Android fonts).
- Verified at 360 + 1440: 0 console errors, no horizontal overflow on all three pages.

### 2026-11-12: Deals added, real phone/WhatsApp, footer credit
- Owner asked for deals priced by the developer's research: 7 combos in `data/deals.ts` (TODO(owner) confirm). Rule change: a deal is orderable at its own price even if an item inside has no menu price; "Save Rs X" / strike-through only when every item has a real price (`getDealOriginalPrice` → null otherwise). Tests added (95).
- Phone + WhatsApp = 0347 5253550 (all orders); WhatsApp ordering + FAB now live in production. Footer: "Designed & developed by M-Huzaifa00" (GitHub link).
- Fixed the footer wordmark's script "n" being clipped on the right (reveal mask got side padding with cancelling negative margins).
- Verified: /deals shows 7 cards (only Matcha Duo shows savings), wa.me links → 923475253550, credit link, 0 console errors at 360 + 1440.

### 2026-11-11 (7): Deals section replaces the Vibe Picker; Spin hidden; pushed
- Home order now: Hero → Marquee → Menu preview → Our picks → Craft your own → **Deals** → Reviews → Find Us.
- Deals section: chili stage + drifting backdrop type + golden-ticket "coming soon" teaser (honest: "??? ✦ ???", "Rs ???", no fake items/prices/timers) with Munchy waving; switches to real DealCards when `data/deals.ts` has deals. Follow button stays on one line at 360px.
- Hero light polish: two floating brand stickers (sparkle + star) balance the right side on desktop. Nothing else added.
- Verified: 0 console errors at 360/768/1440, Munch Stop 1 delta 0, no overflow; 92 tests, build, lint green. Colour tokens unchanged (index.css: only a `stamp-spin` keyframe + utility added outside @theme). Pushed to `main`.

### 2026-11-11 (6): Munchy stories in the pills, "order here" peek
- Owner: pills must not use images, make them creative with mascot animations; remove the arrow badge (clutter); add a cute mascot peeking behind Order Now asking to order. Done: SIP pill = mini Munchy sipping coffee through a bendy straw (flow, hearts); BITE pill = mini Munchy chomping a burger (crumbs, "nom!"); `HeroOrderPeek` Munchy behind Order Now with speech bubble + excited on hover; removed `HeroSpinBadge`, `HeroCapsule` (photo pills) and the bottom-right `HeroMascot`.
- Verified: Munch Stop 1 delta 0 at 360/768/1440, 0 console errors, no overflow; 92 tests, build, lint green.

### 2026-11-11 (5): Kawaii mascots, hero pills reel + ticker, spin badge (pills + badge replaced in (6))
- **Mascots made cute** (owner: "they look dangerous lol"): Munchy redrawn as a kawaii chibi (face fully visible, curls framing it, sparkly eyes, rosy cheeks, tongue smile, heart, side-brim cap); every mood checked in /mascot-lab (sad and guilty stay soft). Munch Run burger/wrap/coffee faces: bigger sparkly eyes + tongue smile.
- **Hero pills**: photo reel (frappe → mosque → box) after SIP.; cheese menu ticker after BITE.; loops pause off-screen. Desktop: hover-hop letters, SIP/BITE scroll drift, spinning "scroll to golden hour" badge; cinema editorial labels + cursor bubble.
- Verified: Munch Stop 1 delta 0 at 360/768/1440, 0 console errors, no overflow; 92 tests, build, lint green. Colour tokens unchanged.

### 2026-11-11 (4): Awwwards-style hero + navbar; playable makers; spin coming soon
- **Hero "Golden Hour Stage"**: info row (live badge + address), photo capsules inside "SIP. BITE." and the Munch Run burger parked inline after "REPEAT.", line + CTAs, golden-hour cinema panel that grows to full width on scroll (transform-only scrub), warm pre-blurred photo wash. Same owner copy. Removed the postcard / banner variants and `site.heroPhotoStyle` (files HeroVisuals, HeroPhoto, ScrollHint deleted).
- **Islands navbar**: logo island, numbered rolling links with a gliding blob, "Order Now ↗" + same cart icon; full-screen circle-wipe menu below 1024px (fixes the 768px link wrap).
- **Craft makers back** (Coffee / Burger / Wrap, opens on Burger), playable with "Add to cart · coming soon"; burger/wrap placeholder prices hidden. **Spin** lands on any menu item; "Add · coming soon" + "See it on the menu".
- Verified (prod preview, headless Chrome): Munch Run Stop 1 delta 0 at 360/768/1440; menu overlay opens with focus inside, Esc closes; no horizontal overflow; craft CTA disabled with 0 burger prices shown; spin buttons as above; 0 console errors. 92 Vitest tests, build, lint green. Colour tokens unchanged.

### 2026-11-11 (3): Menu-only cart, loader everywhere, hero banner, café info, Starters
- **Only the owner's menu can be ordered:** `useAddToCart` guard (re-checks every add against current data, uses the data price); `cart.reprice()` now drops unorderable lines; `syncCart()` runs after load / drawer / checkout / before send with one notice. Old saved carts (e.g. Classic Smash, custom burgers) are removed instead of lingering faded in the drawer and counting in the badge/pill.
- **Starters** added from Syed Ahmed's 2026-11-11 list: Simple Fries, Loaded Fries, Munch Club, Golden Munch Wings, Nuggets (all "Price coming soon"); new `starters` category (cheese), upsell / vibe hooks (skipped until priced).
- **Craft makers switch** `site.craftMakers` (coffee on, burger/wrap off): Craft section shows only enabled makers (no switch for one), deep links fall back, empty-cart links filtered, Munch Run tap → `/menu#cat-…` when a maker is off; Menu supports `#cat-<category>` deep links; story copy no longer promises "build your own".
- **Loading:** 0→100 preloader on **every full load, any route** (calm variant for reduced motion); waits for the routed page (`PageReady`) instead of Home only; Suspense loader removed (`PageLoader.tsx` deleted) + page chunks prefetched on idle; `index.html` boot frame on every load.
- **Hero:** banner is now the default: soft multiply photo (60% phone strip / 45% desktop), oat fades, grain on top, settle-in zoom + scroll drift; fixed a hard edge at the top of the phone photo strip.
- **Café info:** address "Ghouri Town Phase 5B, Islamabad" (map + directions search the address until a pin is given; JSON-LD geo/street only when known; priceRange removed), Instagram `mugnmunchh`, TikTok hidden until a handle exists.
- Verified (production preview, headless Chrome): /menu full load = boot frame → 0→100 → page, no pulse loader; stale cart → one toast, 2 lines removed, latte re-priced 600 → 650; 37 cards (19 orderable, 18 coming soon, none with an Add button); in-app navigation shows no loader; reduced motion still gets the 0→100; Craft shows only "Craft your coffee"; hero banner checked at 360 + 1440; 0 console errors. 92 Vitest tests, build, lint green. Colour tokens unchanged.

### 2026-11-11 (2): Real menu from the café's list
- 32 real items; 13 without a price → "Price coming soon", type-enforced (`PricedItem`). Removed invented sides, desserts, soft drinks, coffee sizes/milks/add-ons/sweetness and all deals (pages say "coming soon"). Bestsellers → "Our picks". Menu filters, vibes, roulette, upsells, coffee maker, Our Story, 404, marquee follow the data. Unavailable lines excluded from totals. Tests: `setup.ts` test-only data. Commit `a9afb86`.

### 2026-11-11 (1): Mobile scroll fix, hero photo, single first-visit loader
- Mobile scroll bug: vertical swipes starting on the Bestsellers carousel / Menu chips never scrolled the page (`lenis.css` overscroll contain on both axes) → fixed in `index.css`; 22 touch swipes now reach the bottom (stalled at ~2,445px).
- Smoother Home: Munch Run morph timelines pre-rendered on mount (100–167 ms mid-scroll hitches; frames > 50 ms 15 → ~5). Craft placeholder `svh`.
- Hero photo pipeline + postcard (later switched to banner by the owner). Preloader moved to the app shell with the `index.html` boot frame. Commit `47cf4e1`.

### 2026-11-09: Realistic burger maker
- Shaded toasted sesame bun, seared patty, melting cheese, lettuce, onion rings, jalapeños, drippy sauce (`craft/burgerArt.tsx`), token colour-mix only.

### 2026-11-07: Munch Run
- Burger → wrap → coffee scroll traveler with marquee hop, morphs, crumbs, dust, notes, tap-to-craft, cart hop, Munchy look-at; parks exactly on anchors at 360–1920; reduced motion = static stickers; ~48 fps avg at CPU 4× on 360px (prod). Chunk 7.4 KB gz.

### 2026-11-07: Phase 5 complete (pushed to `main`)
- Craft your own (coffee/burger/wrap makers, deep links), order logic + Vitest, describeLine + re-pricing + Edit/Tweak, Checkout + synchronous WhatsApp flow (prod "call us" while the number is a placeholder), Order success (never claims confirmation), Deals / Our Story / Find Us / 404 pages, `forms` chunk split. Commits `a56bfaa` …

### 2026-11-06: Phases 1–4 (pushed to `main`)
- Phase 1 foundation (Vite 8, React 19, TS strict, Tailwind 4 tokens, GSAP registry, Lenis, lazy router, chrome, cart store, chunk splitting).
- Phase 2 cart & commerce (store, ProductCard, Menu page, item modal/page, CartDrawer, upsell, fly-to-cart, confetti, Undo toasts).
- Phase 3 brand + Munchy + Home wow sections (logo pipeline, mascot moods, preloader, hero, marquee, bestsellers pin, deals, reviews, find us, footer wordmark, page transitions, easter egg). 52 fps avg at CPU 4× on 360px.
- Phase 4 toys (builders → later Craft section, Vibe Picker, Snack Roulette, custom cursor).
