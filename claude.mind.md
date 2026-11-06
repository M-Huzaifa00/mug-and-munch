# claude.mind.md: Mug n Munch project brain

> Read this before every task. Never rebuild anything marked ✅. Update status, file map and changelog after every task.
> Current phase: **Phase 4 ✅ done** → **Phase 5 🟡 in progress** (Craft section, WhatsApp checkout, content pages). See the Phase 5 table for the exact resume point.
> Repo: https://github.com/M-Huzaifa00/mug-and-munch (branch `main`). Git rule: local commit after each completed step; push to `main` only at the end of a phase after build + lint pass. Never push broken builds.
> **Colours are LOCKED:** never edit/add/remove tokens in the `@theme` block of `src/styles/index.css`. Need a new shade? Use opacity (`bg-chili/15`). Brand ink lives in `src/styles/brand.css` as `--brand-ink` (a color-mix of tokens), mascot/illustration lines only.
> **Brand name:** visible text is **"Mug n Munch"** from `site.brandName` (never hardcode); `site.alternateName` = "Mug & Munch" (JSON-LD only).

---

## 1. Vision & audience
- **What:** Website for Mug n Munch (aka "Mug & Munch"), a real café in Islamabad serving coffee, smash burgers and wraps. Frontend only for now.
- **Goal #1:** Colour + motion + micro-interactions make visitors tap "Add to cart" within 30 seconds.
- **Goal #2:** Feels local to Pakistani Gen Z (students, young professionals, late-night crowd); fast on mid-range Android (mobile-first, 360px design width).
- **Voice:** English-first, max 1 Roman Urdu line per section ("Bhook lagi? We got you.", "Yaar, ek aur?", "Order karo, chill karo"). Tagline **Sip. Bite. Repeat.** Urdu wordmark **مگ اینڈ منچ**.
- **Persuasion:** honest only. No fake timers, stock counts, viewer counts or reviews.

## 1b. Logo Analysis (owner logo: `public/brand/logo.png`, 3242×3948, transparent PNG ✅ ≥512px ✅)
- **Composition:** stacked lockup. Top = character illustration; bottom = wordmark "MUG n MUNCH" (empty band at rows 2782–3028; `scripts/brand-assets.mjs` auto-detects it to crop `icon` and `wordmark`).
- **Character:** a cheeky kid's head, tilted ~15° left. Big round face; voluminous **curly hair drawn as a cloud of round solid curls** (heavy mass on the left covering the cheek/ear, scalloped fringe top-right); a **soft white cap** with a brim line and a small nub on top; **wink** (left eye = solid teardrop with a tiny highlight notch, right eye = closed ">" wink with lash); **curly "ↄ" nose**; wide **grin with tongue licking the left corner**; small ear with a "+" mark.
- **Accessory:** balancing a **checkered-paper tray** on the cap: a coffee cup (coffee-bean emblem, handle left, **three flame-shaped steam wisps**), a sesame-bun burger, a wrap in a paper cone. Checkered paper drapes down the right side of the head.
- **Line style:** thick, even monoline (~1.1% of width), fully rounded caps/joins, retro 50s/60s diner-mascot / sticker look; flat; thin white sticker cut-line; solid ink fills for hair, coffee, eye.
- **Typography:** "MUG" + "MUNCH" in heavy geometric sans caps joined by a tall brush-script "n" with a long descender swash.
- **Colours:** one ink, deep brick-maroon ≈ `#901F10`, white fills, one tiny cream patch ≈ `#F0E8E0`.
- **Token mapping (LOCKED tokens):** maroon isn't a token → `--brand-ink: color-mix(in oklab, var(--color-chili) 53%, var(--color-espresso))` ≈ `#8A311F` (ΔOKLab 0.028; 7.6:1 on oat), defined once in `src/styles/brand.css`, exposed as `BRAND_INK` in `src/lib/brand.ts` (owner chose option A). White → `oat`. Maroon on espresso = 2.1:1 ✗ → on dark sections the logo sits on an **oat badge** (`tone="light"`), never recoloured.

## 1c. Mascot: **Munchy**
- The logo kid as a full chibi figure (owner approved): curl-cloud hair, cap + nub, scalloped fringe, teardrop eyes, "ↄ" nose, tongue grin, tiny arms/legs, checkered tray with bean cup, burger, wrap and flame steam. Lines = `--brand-ink`, fills = oat, blush = bubblegum. ~5 KB rendered SVG.
- Named groups (`data-part`): rig, body, head, face, eyeL, eyeR, pupilL, pupilR, eyelids, mouth (+ morphable `mouthShape`), armL, armR, legs, steam, blush, accessory, cap, tear, crumbs, zzz, sparkles.
- **Moods** (`<Mascot mood>`; static pose = reduced-motion fallback; GSAP timelines in `useMascotAnimation`):
  `idle` (bob + steam + random blinks 3–6s) · `follow` (pupils track cursor, or device tilt where no permission prompt) · `wave` (arm wave) · `excited` (jump + sparkle burst) · `sleep` (closed eyes, floating zZz, breathing) · `sad` (droopy brows, frown, falling tear) · `guilty` (side-eye look-around, wobbly mouth, crumbs) · `dance` (sway, bounce, arms) · `peek` (slides up from the edge, waves, looks around, then hides, or calls `onPeekEnd`).
- Mouth morphs between moods (MorphSVG). `reactive` prop → `useMascotReactions`: first add of session → wave, every add → excited, 30s no interaction → sleep.
- Where: hero (peek → follow on desktop / idle on touch), preloader (wave), deals (reactive), Find Us card, empty cart (sleep), empty search + item-not-found (sad), 404 (guilty), order success (dance). DEV-only playground: `/mascot-lab`.

## 2. Feature status
✅ done · 🟡 in progress / partial · ⬜ todo

### Phase 1: Foundation ✅
| Feature | Status | Files |
|---|---|---|
| Vite + React + TS strict scaffold, `@/` alias | ✅ | `vite.config.ts`, `tsconfig.app.json` |
| Tailwind v4 tokens (colours, fonts, shadows, eases, type scale), grain/sticker/glass utilities, keyframes | ✅ | `src/styles/index.css` |
| Self-hosted fonts (Bricolage, Plus Jakarta, Caveat, Noto Nastaliq Urdu) | ✅ | `src/main.tsx` |
| GSAP + 10 plugins registered once (+ `refreshScrollTriggersSoon`) | ✅ | `src/lib/gsap.ts` |
| Animation presets (CustomEase bouncy/squish/snappy, DUR, STAGGER, SPRING, MASCOT, SCENE) | ✅ | `src/lib/motion-presets.ts` |
| Lenis smooth scroll on gsap.ticker + ScrollTrigger sync; off for reduced motion; refresh after load/fonts | ✅ | `src/app/providers/SmoothScroll.tsx` |
| Router, all routes lazy-loaded + Suspense loader | ✅ | `src/app/router.tsx`, `src/app/routes.tsx`, `src/app/RootLayout.tsx`, `PageLoader.tsx` |
| Scroll-to-top on page change (Lenis aware, modal-aware) | ✅ | `src/components/layout/ScrollToTop.tsx` |
| Per-page title/description/OG/canonical | ✅ | `src/components/layout/Seo.tsx` |
| Sticky glassy navbar (shrink, hide on scroll down, show on up) | ✅ | `Navbar.tsx`, `NavLogo.tsx`, `src/hooks/useScrollState.ts` |
| Cart button with live count (aria-live) → opens drawer | ✅ | `src/components/layout/CartButton.tsx` |
| Mobile bottom tab bar + floating "View cart · Rs X" pill | ✅ | `src/components/layout/MobileBottomBar.tsx` |
| Floating WhatsApp button | ✅ | `src/components/layout/WhatsAppFab.tsx` |
| Footer | ✅ | `src/components/layout/Footer.tsx`, `FooterWordmark.tsx` |
| Live Open/Closed badge ("Open now 🟢 · till 2 AM", Asia/Karachi, overnight hours) | ✅ | `src/lib/hours.ts`, `src/components/ui/OpenBadge.tsx` |
| Config + data | ✅ | `src/config/site.ts`, `src/data/*.ts` |
| Button / ButtonLink / buttonClasses | ✅ | `src/components/ui/Button.tsx`, `buttonClasses.ts` |
| Vendor chunk splitting (react / gsap / motion / vendor) | ✅ | `vite.config.ts` |

### Phase 2: Cart, core commerce + Home menu section ✅
| Feature | Status | Files |
|---|---|---|
| Cart store (items, addItem → `{lineId, isFirstAdd}`, removeItem, updateQty, restoreItem, clear, undoLastAdd, isOpen/openCart/closeCart, hasAddedThisSession; option-hash line merging; selectors) | ✅ | `src/store/cart.ts` |
| Option pricing/labels/defaults | ✅ | `src/lib/itemOptions.ts` |
| ProductCard (default + compact) | ✅ | `src/components/ui/ProductCard.tsx` |
| Image-with-fallback (`virtual:photos`, logo watermark, refreshes ScrollTrigger on load) | ✅ | `src/components/ui/ProductImage.tsx`, `vite.config.ts` |
| Home "Kya khaoge aaj?" menu preview (id `menu-preview`) | ✅ | `src/sections/home/MenuPreview.tsx`, `MenuPreviewTabs.tsx` |
| Menu page (sticky scroll-spy chips, search, filters, layout grid, empty state) | ✅ | `src/pages/Menu.tsx`, `src/components/menu/*`, `src/lib/menuFilter.ts` |
| Item detail modal / full page + options + sticky add bar | ✅ | `src/components/item/*`, `src/pages/ItemDetail.tsx`, `src/lib/routing.ts` |
| CartDrawer (swipe-to-remove, free-delivery bar, upsell, summary, empty state) | ✅ | `src/components/layout/CartDrawer.tsx`, `src/components/layout/cart/*` |
| Upsell rules | ✅ | `src/lib/recommendations.ts` |
| Fly-to-cart, jelly bounce, odometer, first-add confetti, toasts + Undo | ✅ | `src/hooks/useFlyToCart.ts`, `useAddToCart.ts`, `src/lib/celebrate.ts`, `src/lib/notify.tsx` |
| UI kit | ✅ | `src/components/ui/*` |

### Phase 3: Brand logo, mascot & Home wow sections ✅
| Feature | Status | Files |
|---|---|---|
| Brand asset pipeline (sharp): logo/icon/wordmark WebP ×4 sizes, favicon.ico (16/32/48), favicon-32.png, apple-touch-icon (180, oat), og-image 1200×630 (brand name from site.ts), generated aspect ratios | ✅ | `scripts/brand-assets.mjs` (`npm run brand`), `public/brand/*`, `public/favicon*`, `src/components/brand/brandAssets.ts` (generated) |
| `Logo` (full / icon / wordmark / horizontal / stamp; size; tone) + `BrandImage` + `LogoStamp` (rotating ring text from site.ts) | ✅ | `src/components/brand/*`, `src/lib/brand.ts`, `src/styles/brand.css` |
| index.html: icons, og/twitter image, theme-color = espresso; `%BRAND_NAME%`/`%ALT_NAME%`/`%SITE_URL%` filled from site.ts at build | ✅ | `index.html`, `vite.config.ts` (`siteHtmlVars`) |
| Logo everywhere: navbar (wordmark tucks away on scroll, wiggle), preloader, footer (full + stamp), cart pill, fallback-card watermark, Suspense loader (pulse), page-transition wipe, toasts, 404, empty cart, order success, stamp doodles (hero, bestsellers, reviews, find us), JSON-LD logo + alternateName | ✅ | see file map |
| Logo 5-click easter egg: coffee spills down the screen and mops itself up | ✅ | `src/lib/easterEgg.ts`, `src/components/layout/CoffeeSpill.tsx`, `NavLogo.tsx` |
| Munchy mascot: layered SVG, 9 animated moods, mouth morph, cart reactions, idle sleep; replaced all Phase 2 placeholders | ✅ | `src/components/mascot/*`, `src/pages/MascotLab.tsx` (DEV-only) |
| Preloader (logo coffee-wave fill + counter → Munchy pops & waves → wipe up; ≤1.8s; once per session; skipped with reduced motion; refreshes ScrollTrigger) | ✅ | `src/sections/home/Preloader.tsx`, `src/lib/preloader.ts` |
| Hero (SplitText elastic chars, DrawSVG word underlines, parallax floating items, stamp, Munchy peek → follow, magnetic Order Now → Lenis scroll to menu, See the Menu, scroll hint) | ✅ | `src/sections/home/hero/*` |
| Marquee (2 tilted strips, seamless, scroll-velocity speed/direction, hover pause, logo separators) | ✅ | `src/sections/home/Marquee.tsx` |
| Bestsellers (desktop pin + scrub + progress bar; mobile snap carousel; Caveat notes + arrows) | ✅ | `src/sections/home/Bestsellers.tsx` |
| Deals strip (computed savings, tilt on hover, one-line "Add deal", reactive Munchy) | ✅ | `src/sections/home/deals/*` |
| Reviews (Draggable + Inertia sticker board, drag hint, IG 3×3 grid, follow button; placeholders dev-only) | ✅ | `src/sections/home/reviews/*`, `src/data/reviews.ts` |
| Find Us teaser (open/closed, today's hours, address, directions + call, Munchy on the card, stylised map) | ✅ | `src/sections/home/FindUsTeaser.tsx` |
| Footer giant wordmark revealed letter by letter on scroll (script "n") | ✅ | `src/components/layout/FooterWordmark.tsx` |
| Page transitions: chili/cheese wipe + logo pop (~0.6s), skipped with reduced motion; item links excluded (modal) | ✅ | `src/components/layout/PageTransition.tsx` |

### Phase 4: Interactive toys ✅
| Feature | Status | Files |
|---|---|---|
| Build Studio: ONE section, tabs Burger / Coffee / Wrap (owner request: combine the three builders) | ✅ (Phase 5 Step 1 turns it into the "Craft your own" section) | `src/sections/home/builders/BuildStudio.tsx`, `BuildTabs.tsx`, `IngredientPicker.tsx` |
| Burger builder: layers drop with squash & stretch, live price, auto top bun, reset topples | ✅ | `src/sections/home/burger/BurgerBuilder.tsx`, `BurgerLayer.tsx`, `src/lib/burgerBuilder.ts` |
| Coffee builder (real Classic Latte options): pour to size, milk tint, steam, ice drop + splash + straw | ✅ | `src/sections/home/coffee/CoffeeBuilder.tsx`, `CoffeeCup.tsx` |
| Wrap builder (owner request: pick fillings, not a scroll animation): fillings drop, "Roll it & add" (MorphSVG roll, seams, frills, band) | ✅ | `src/sections/home/wrap/WrapBuilder.tsx`, `WrapStage.tsx`, `WrapFilling.tsx`, `wrapAnimations.ts`, `src/lib/wrapBuilder.ts` |
| Shared builder maths | ✅ | `src/lib/builder.ts`, data in `src/data/toys.ts` |
| Vibe Picker (5 moods, GSAP Flip reshuffle, 3 picks highlighted, one-tap add + "Add all 3") | ✅ | `src/sections/home/vibe/VibePicker.tsx` |
| Snack Roulette (lands exactly under the pointer, desktop flick via Draggable + Inertia, normal prices) | ✅ | `src/sections/home/roulette/*` |
| Custom cursor ("Add +" / "Drag" bubbles; fine pointer, motion ok, cores > 4) | ✅ | `src/app/providers/Cursor.tsx` (`data-cursor` attrs on ProductCard, review stickers, wheel) |
| Sounds | ⬜ not built (not in the original Phase 4 list) | — |
| `lib/events.ts` analytics stub | ⬜ → created in Phase 5 Step 1 | — |

### Phase 5: Craft section, WhatsApp checkout & content pages 🟡
Brief: owner's Phase 5 prompt. **WhatsApp is the ordering channel; no backend; never fake an "order placed".** Resume at the first row that isn't ✅.
| Step | Scope | Status | Files |
|---|---|---|---|
| 0 | Phase 4 check + `lib/events.ts` `track()` stub | ✅ | `src/lib/events.ts` |
| 1 | Builder Kit + ONE "Craft your own" section (id `craft`, tabs + hash deep links, state kept per tab, lazy makers) + Burger maker | ✅ | `src/components/builder/*`, `src/sections/home/craft/*`, `src/data/builder.ts` |
| 2 | Coffee maker (drink/size/milk/temp/add-ons/sweetness; merges with menu coffee) | ✅ | `craft/CoffeeMaker.tsx`, `src/data/coffeeBuilder.ts` |
| 3 | Wrap maker (base/protein/cheese/veggies/sauces/spice; roll on add) | ✅ | `craft/WrapMaker.tsx`, `src/data/wrapBuilder.ts` |
| 4 | Order logic: site fields, phone, orderTotals, orderType in store, orderNumber, order, orderApi stub, checkoutSchema, WhatsApp message builder, Vitest (`npm test`) | ✅ | `src/lib/{phone,orderTotals,orderNumber,order,orderApi,checkoutSchema,whatsapp}.ts`, `src/lib/__tests__/*` |
| 5 | describeLine, priceLine re-pricing (notice + unavailable block), merge rules, Edit/Tweak (cart `editing` + `replaceItem`, makers preload), tag chips, empty-cart craft links | ✅ | `src/lib/lineDescription.ts`, `itemOptions.ts`, `components/layout/cart/{LineTag,EditCreationLink,CraftLinks}.tsx`, `craft/{useCraftEdit.ts,EditBanner.tsx}` |
| 6 | Checkout page (order types, pickup slots, validation + error summary + focus, draft, remember-me, payment cards, review, sticky CTA, hides pill/FAB, useTransitionNavigate) | ✅ | `src/pages/Checkout.tsx`, `src/components/checkout/*`, `src/lib/checkoutSchema.ts` |
| 7 | WhatsApp order message + synchronous click flow (dev: message preview while the number is a placeholder; prod: call fallback) | ✅ | `src/lib/whatsapp.ts` |
| 8 | Order success (pending-send / sent / no order) | ✅ | `src/pages/OrderSuccess.tsx` |
| 9 | Deals page | ⬜ | `src/pages/Deals.tsx` |
| 10 | Our Story | ⬜ | `src/pages/OurStory.tsx`, `src/data/story.ts` |
| 11 | Find Us page | ⬜ | `src/pages/FindUs.tsx` |
| 12 | 404 polish, SEO pass, Future Goals, docs | ⬜ | |

### Phase 6: Polish & QA ⬜
Reduced-motion + low-end audit, a11y pass, JSON-LD openingHours, image optimisation, Lighthouse mobile ≥ 90 ×4 (report scores), 360/768/1440 checks.

## 3. File map
```
index.html                      %BRAND_NAME%/%ALT_NAME%/%SITE_URL% placeholders (filled from site.ts), icons, OG
vite.config.ts                  react + tailwind, @ alias, vendor chunks, `virtual:photos`, `siteHtmlVars`
scripts/brand-assets.mjs        sharp: logo crops/sizes, favicons, apple icon, OG image, brandAssets.ts (npm run brand)
public/brand/                   logo.png (master) + generated logo*/og-image; public/favicon.ico, favicon-32.png, apple-touch-icon.png
src/main.tsx                    fonts, lenis.css, index.css, brand.css, mounts <App/>
src/styles/index.css            @theme tokens (LOCKED), base, utilities, keyframes, reduced-motion CSS
src/styles/brand.css            --brand-ink (chili/espresso color-mix)
src/types/virtual.d.ts          types for `virtual:photos`
src/app/App.tsx                 MotionConfig reducedMotion="user" + SmoothScroll + RouterProvider + Toaster
src/app/router.tsx, routes.tsx  data router → RootLayout; PAGE_ROUTES (lazy; /mascot-lab DEV only)
src/app/RootLayout.tsx          useRoutes(background ?? location), JsonLd, ScrollToTop, Navbar, Footer, bars, CartDrawer, PageTransition, CoffeeSpill, ItemModal
src/app/providers/SmoothScroll.tsx  Lenis + gsap.ticker + ScrollTrigger sync + refresh on load/fonts
src/lib/gsap.ts                 plugin registry, MQ, refreshScrollTriggersSoon()
src/lib/motion-presets.ts       EASE, DUR, STAGGER, MASCOT, SCENE (GSAP); SPRING, TAP_SQUISH, FADE_UP (Motion)
src/lib/brand.ts                BRAND_INK, brandSrc(kind, height)
src/lib/notify.tsx              branded sonner toast (logo icon + Undo)
src/lib/preloader.ts            shouldShowPreloader(), markPreloaderSeen() (sessionStorage mm-preloaded)
src/lib/easterEgg.ts            registerLogoClick() → SPILL_EVENT on 5 clicks / 2s
src/lib/hours.ts                getOpenStatus() {isOpen, detail, label}, getTodayKey(), formatDayHours, DAY_LABELS, WEEK_ORDER
src/lib/utils.ts, itemOptions.ts, menuFilter.ts, recommendations.ts, routing.ts, celebrate.ts, whatsapp.ts
src/hooks/*                     useReducedMotion, useIsTouch (+isLowEndDevice), useScrollState, useAddToCart, useFlyToCart, useFocusTrap, useScrollLock, useMagnetic, useMediaQuery, useDebouncedValue, useIsItemPage
src/store/cart.ts               Zustand cart (persist mm-cart)
src/config/site.ts              owner settings incl. brandName, alternateName, logoUrl, ogImage
src/data/menu.ts, deals.ts, reviews.ts (PLACEHOLDER reviews + visibleReviews())
src/components/brand/           Logo, BrandImage, LogoStamp, brandAssets.ts (generated)
src/components/mascot/          Mascot, MascotFace, mascotPoses, useMascotAnimation, useMascotReactions, mascotFollow
src/components/ui/              Button, buttonClasses, OpenBadge, SocialIcons, ProductCard, ProductImage, Badge, Chip, QuantityStepper, RollingNumber, Sticker, HandArrow, MagneticButton, Modal, Drawer, RevealHeading
src/components/item/*           ItemDetailContent, ItemOptionsForm, OptionPills, StickyAddBar, ItemModal
src/components/menu/*           CategoryNav, MenuSearch, MenuSection, MenuEmpty, menuIds
src/components/layout/          Navbar, NavLogo, CartButton, CartDrawer (+cart/*), MobileBottomBar, WhatsAppFab, Footer, FooterWordmark, PageLoader, PageTransition, CoffeeSpill, ScrollToTop, Seo, JsonLd, PagePlaceholder, navLinks
src/sections/home/              Preloader, hero/{Hero, HeroHeadline, HeroVisuals, HeroMascot, ScrollHint}, Marquee, MenuPreview, MenuPreviewTabs, Bestsellers, deals/{DealsStrip, DealCard}, reviews/{Reviews, ReviewsBoard, InstaGrid}, FindUsTeaser, sectionIds
src/pages/*                     Home, Menu, ItemDetail, Deals, Checkout, OrderSuccess, OurStory, FindUs, NotFound, MascotLab (DEV)
public/images/{coffee,burgers,wraps,sides,drinks,desserts,deals,brand}/  photos as <slug>.webp
```

## 4. Design system
- **Tokens** (Tailwind classes): espresso, oat, chili, cheese, caramel, pickle, bubblegum, ink (+ transparent, current). Default palette wiped, so non-brand colours fail at build time. `--brand-ink` (brand.css) only for mascot/illustration lines.
- **60/30/10:** 60% oat or espresso, 30% category colour, 10% chili CTAs. Home rhythm: hero oat → marquee espresso → menu cheese → bestsellers oat → deals cheese → reviews espresso → find us oat → footer espresso. Add `grain` to sections.
- **Category colours:** coffee = caramel, burger = chili, wrap = pickle, sides = cheese, drinks/desserts = bubblegum.
- **Contrast rules:** oat on chili = 3.0:1 → large bold text only (≥ 19px bold); small text on chili → espresso. Pickle/cheese/bubblegum → espresso text. Caramel text only large on oat. Light token strokes on oat (pickle) get an espresso outline underneath.
- **Fonts / type / shapes / focus / eases:** as Phase 1–2 (display = Bricolage, sans = Plus Jakarta, hand = Caveat, urdu = Nastaliq; `text-mega`, `text-display`; `sticker`, `rounded-blob`, `shadow-hard*`).
- **Logo:** always `<Logo variant size tone>` / `<BrandImage>` / `<LogoStamp>`; never `<img src="/brand/...">` by hand. `tone="light"` on dark backgrounds.
- **Mascot:** `<Mascot mood reactive? onPeekEnd? label?>`; pick the mood that fits the context (see 1c). Don't animate mascot parts from outside; extend `useMascotAnimation` instead.
- **Toasts:** `notify(message, { id, undo })`, never sonner directly.
- **Adding to cart:** `useAddToCart()(input, { qty, source })` (deals: one line, `category: 'deal'`).
- **Linking to an item:** `<Link to state={modalStateFrom(location)}>` → modal. Page transitions intercept other internal `<a>` clicks automatically.
- **Dialogs:** `<AnimatePresence>{open && <Modal|Drawer …/>}</AnimatePresence>`; inner scroll areas `data-lenis-prevent`.
- **GSAP rules:** inside `useGSAP({ scope })`; wrap motion in `gsap.matchMedia()` with `MQ.motionOk`; scoped selectors only; GSAP and Motion never on the same element. Tailwind v4 `translate/rotate/scale-*` are standalone CSS properties: transition them with `transition-[translate,scale,rotate]`, and don't mix with GSAP transforms on the same element.
- **tailwind-merge:** custom tokens registered in `lib/utils.ts`.

## 5. Config & data the owner must fill
- `src/config/site.ts`: WhatsApp number, phone, email, address, Google Maps link, lat/lng, Instagram + TikTok handles, real opening hours, free-delivery threshold, delivery fee, **tax rate (currently 0)**, delivery areas, real domain (`url`, also used for OG/JSON-LD absolute URLs). `brandName` / `alternateName` already set.
- `src/data/menu.ts`: **PLACEHOLDER PRICES**.
- `src/data/deals.ts`: deal prices + rules. Optional deal photos: `public/images/deals/<slug>.webp`.
- **TODO (reviews):** `src/data/reviews.ts` holds PLACEHOLDER reviews. They render only in development (labelled "sample"); production shows "Reviews coming soon" until real reviews (with permission) are added with `isPlaceholder: false`. Never present placeholder reviews as real.
- **TODO (Instagram):** `InstaGrid` shows menu tiles as placeholders; swap for real posts/embed later.
- Photos: `public/images/<folder>/<slug>.webp`, ~1200px.
- Logo: replace `public/brand/logo.png` (or add `logo.svg`) then run `npm run brand` to regenerate everything.

## 6. Known issues / tech debt
- Refreshing while the item modal is open re-opens it over the page (history state survives refresh). Direct links always get the full page.
- Quick-add: items with >1 size open the modal (coffees); others add instantly (spice = Medium).
- Delivery fee shows in the drawer for every cart; order-type logic comes with checkout (Phase 5).
- Page transitions intercept `<a>` clicks only; programmatic `navigate()` calls (e.g. after checkout) change pages without the wipe.
- Bestsellers pin uses ScrollTrigger pin spacing, so full-page screenshots show an empty band above it (normal).
- Motion logs a dev-only "Reduced Motion enabled" warning when the OS setting is on (not in production).
- GSAP (~86 KB gz) + Motion (~46 KB gz) in the shell; Phase 6: consider lazy plugins / LazyMotion. Home chunk is larger now (all sections); fine at 52 fps avg under CPU 4×.
- Noto Nastaliq Urdu Arabic subset is 239 KB (footer only). Phase 6: subset.
- OG image text uses system fonts (Arial Black / Segoe UI) because librsvg can't load the web fonts.
- Headless Chrome on Windows has a ~500px minimum window; QA uses CDP device emulation.

## 7. Future goals (not built yet)
Node/Supabase backend + real orders DB · real JazzCash / Easypaisa / card gateway integration · admin dashboard to edit menu & prices · live order tracking · "Munch Points" loyalty & referral · Urdu/English language toggle · PWA + "Add to home screen" · table QR ordering for dine-in · reservations · push/WhatsApp order-status notifications · analytics (GA4 / Meta Pixel) with consent · Foodpanda link-out · A/B testing CTA copy.

## 8. Changelog (Asia/Karachi dates)
### 2026-11-06: Phase 4 complete: interactive toys
- Build Your Burger, Coffee Lab and a build-your-wrap builder, combined into ONE tabbed Build Studio section (owner request); shared builder maths + IngredientPicker.
- Wrap It Up reworked on owner feedback from a scroll animation into a pick-your-fillings builder with a roll-up on "Roll it & add".
- Vibe Picker (GSAP Flip), Snack Roulette (accurate landing, flick to spin), custom cursor.
- Verified each toy in the browser (prices, cart lines, animations, 360/1440, keyboard tabs); 0 console errors.
- Commits `571ffbf` … `e1e4d9a`; pushed to `main`.

### 2026-11-06: Phase 3 complete: brand, Munchy, home wow sections
- Owner decisions applied: mascot approved; ink option A as `--brand-ink` in `styles/brand.css`; name "Munchy"; visible brand "Mug n Munch" via `site.brandName` everywhere (titles, meta, index.html via build-time vars, footer wordmark, stamp ring, WhatsApp greeting, JSON-LD with `alternateName: "Mug & Munch"`, OG image regenerated).
- Munchy animated: 9 GSAP moods, mouth morphing, cart reactions (wave / excited), idle sleep; replaced Phase 2 placeholders; old `Munchy.tsx` removed.
- Home rebuilt in final order: Preloader → Hero → Marquee → MenuPreview → Bestsellers → Deals → Reviews → Find Us → Footer.
- Page transitions (chili/cheese wipe + logo), logo 5-click coffee-spill easter egg, order-success page with dancing Munchy, ScrollTrigger refresh after preloader / load / fonts / image loads.
- Hours badge now "Open now 🟢 · till 2 AM" / "Closed 🔴 · opens 2 PM".
- Verified (production build): transitions + modal exclusion, easter egg, preloader once per session, desktop pin vs mobile carousel, reduced motion (no preloader, no loops, all content visible), no horizontal overflow at 360px, **52 fps average / 17 ms p95 scrolling the whole home at 360px with CPU 4× throttle**, mascot SVG 5.1 KB, Phase 2 commerce regression suite green, 0 console errors/warnings. Colour tokens unchanged (index.css byte-identical).
- Commits: `3945981` logo system · `a88c716` mascot · `cac7073` home sections · Step 4 + docs; pushed to `main`.

### 2026-11-06: Phase 3 (part 1): logo system + mascot draft
- Owner logo added and analysed; `sharp` + `scripts/brand-assets.mjs`; Logo/BrandImage/LogoStamp; logo wired in; mascot static draft on DEV-only `/mascot-lab`.

### 2026-11-06: Phase 2 Cart, core commerce + Home menu section
- Cart store (Phase 2 API), ProductCard + ProductImage (`virtual:photos`), Home MenuPreview, Menu page, item modal/full page, CartDrawer, upsell, fly-to-cart, confetti, Undo toasts.
- Fixed Tailwind v4 `transition-[transform]` bug; tailwind-merge taught custom tokens.
- Verified at 360/768/1440 in dev and production; pushed to GitHub `main`.

### 2026-11-06: Phase 1 Foundation
- Vite 8 + React 19 + TS 7 strict; Tailwind 4.3, GSAP 3.15, Lenis 1.3, Motion 14, React Router 8, Zustand 5, RHF 7 + Zod 4, lucide 1.x, sonner 2.
- Tokens, fonts, GSAP registry + presets, Lenis, lazy router, layout chrome, config/data, cart store, vendor chunk splitting.
