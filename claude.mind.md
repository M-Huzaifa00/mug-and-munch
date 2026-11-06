# claude.mind.md: Mug & Munch project brain

> Read this before every task. Never rebuild anything marked ✅. Update status, file map and changelog after every task.
> Current phase: **Phase 3 🟡 in progress**: logo system done; mascot static draft waiting for owner approval on `/mascot-lab` (dev only) before animation + home sections.
> Repo: https://github.com/M-Huzaifa00/mug-and-munch (branch `main`).
> **Colours are LOCKED:** never edit/add/remove tokens in the `@theme` block of `src/styles/index.css`. Need a new shade? Use opacity (`bg-chili/15`).

---

## 1. Vision & audience
- **What:** Website for Mug & Munch, a real café in Islamabad serving coffee, smash burgers and wraps. Frontend only for now.
- **Goal #1:** Colour + motion + micro-interactions make visitors tap "Add to cart" within 30 seconds.
- **Goal #2:** Feels local to Pakistani Gen Z (students, young professionals, late-night crowd); fast on mid-range Android (mobile-first, 360px design width).
- **Voice:** English-first, max 1 Roman Urdu line per section ("Bhook lagi? We got you.", "Yaar, ek aur?", "Order karo, chill karo"). Tagline **Sip. Bite. Repeat.** Urdu wordmark **مگ اینڈ منچ**.
- **Persuasion:** honest only. No fake timers, stock counts, viewer counts or reviews.

## 1b. Logo Analysis (owner logo: `public/brand/logo.png`, 3242×3948, transparent PNG ✅ ≥512px ✅)
- **Composition:** stacked lockup. Top = character illustration; bottom = wordmark "MUG n MUNCH" (empty band at rows 2782–3028 separates them; `scripts/brand-assets.mjs` auto-detects it to crop `icon` and `wordmark`).
- **Character:** a cheeky kid's head, tilted ~15° left. Big round face; voluminous **curly hair drawn as a cloud of round solid curls** (heavy mass on the left covering the cheek/ear, scalloped fringe top-right); a **soft white cap** with a brim line and a small nub on top; **wink** (left eye = solid teardrop with a tiny highlight notch, right eye = closed ">" wink with lash); **curly "ↄ" nose**; wide **grin with tongue licking the left corner**; small ear with a "+" mark.
- **Accessory:** balancing a **checkered-paper tray** on the cap: a coffee cup (coffee-bean emblem, handle left, **three flame-shaped steam wisps**), a sesame-bun burger (wavy lettuce, patty), a wrap in a paper cone (wavy top, dots). Checkered paper drapes down the right side of the head.
- **Line style:** thick, even monoline (~1.1% of width), fully rounded caps/joins, retro 50s/60s diner-mascot / sticker look; flat, no gradients; a thin white sticker cut-line around the art; solid ink fills for hair, coffee, eye.
- **Typography:** "MUG" + "MUNCH" in heavy geometric sans caps (slightly rounded corners, tight spacing) joined by a tall brush-script "n" with a long descender swash.
- **Colours:** one ink, deep brick-maroon ≈ `#901F10` (rgb 144,32,16), white fills (opaque `#FFFFFF`), one tiny cream patch ≈ `#F0E8E0`.
- **Token mapping (tokens are LOCKED):** maroon is not a token. Closest expression from tokens = `color-mix(in oklab, chili 53%, espresso)` ≈ `#8A311F` (ΔOKLab 0.028 vs 0.25 for pure chili, 0.28 for pure espresso; 7.6:1 on oat) → exported as `BRAND_INK` in `src/lib/brand.ts`. White → `oat`. Maroon on espresso = 2.1:1 ✗ → on dark sections the logo sits on an **oat badge** (`tone="light"`), never recoloured.
- **Naming note:** the wordmark reads "MUG n MUNCH"; site copy currently says "Mug & Munch" (owner to confirm which to use in text).

## 2. Feature status
✅ done · 🟡 in progress / partial · ⬜ todo

### Phase 1: Foundation ✅
| Feature | Status | Files |
|---|---|---|
| Vite + React + TS strict scaffold, `@/` alias | ✅ | `vite.config.ts`, `tsconfig.app.json` |
| Tailwind v4 tokens (colours, fonts, shadows, eases, type scale), grain/sticker/glass utilities, keyframes | ✅ | `src/styles/index.css` |
| Self-hosted fonts (Bricolage, Plus Jakarta, Caveat, Noto Nastaliq Urdu) | ✅ | `src/main.tsx` |
| GSAP + 10 plugins registered once | ✅ | `src/lib/gsap.ts` |
| Animation presets (CustomEase bouncy/squish/snappy, DUR, STAGGER, SPRING) | ✅ | `src/lib/motion-presets.ts` |
| Lenis smooth scroll on gsap.ticker + ScrollTrigger sync; off for reduced motion | ✅ | `src/app/providers/SmoothScroll.tsx` |
| Router, all 9 routes lazy-loaded + Suspense loader | ✅ | `src/app/router.tsx`, `src/app/RootLayout.tsx`, `src/components/layout/PageLoader.tsx` |
| Scroll-to-top on route change (Lenis aware) | ✅ | `src/components/layout/ScrollToTop.tsx` |
| Per-page title/description/OG/canonical | ✅ | `src/components/layout/Seo.tsx` |
| Sticky glassy navbar (shrink, hide on scroll down, show on up) | ✅ | `Navbar.tsx`, `src/hooks/useScrollState.ts` |
| Cart button with live count (aria-live) | ✅ | `src/components/layout/CartButton.tsx` (opens drawer since Phase 2) |
| Mobile bottom tab bar + floating "View cart · Rs X" pill | ✅ | `src/components/layout/MobileBottomBar.tsx` (pill opens drawer; hidden on full item page) |
| Floating WhatsApp button | ✅ | `src/components/layout/WhatsAppFab.tsx` |
| Footer (tagline, Urdu wordmark, hours, live open badge, socials, giant wordmark static) | ✅ | `src/components/layout/Footer.tsx` |
| Live Open/Closed badge (Asia/Karachi, overnight hours) | ✅ | `src/lib/hours.ts`, `src/components/ui/OpenBadge.tsx` |
| Config + data (site, menu 33 items, deals w/ computed savings, placeholder reviews) | ✅ | `src/config/site.ts`, `src/data/*.ts` |
| Cart store (rewritten to Phase 2 API, see below) | ✅ | `src/store/cart.ts` |
| Button / ButtonLink / buttonClasses | ✅ | `src/components/ui/Button.tsx`, `buttonClasses.ts` |
| Vendor chunk splitting (react / gsap / motion / vendor) | ✅ | `vite.config.ts` |

### Phase 2: Cart, core commerce + Home menu section ✅
| Feature | Status | Files |
|---|---|---|
| Cart store: `items`, `addItem` (returns `{lineId, isFirstAdd}`), `removeItem`, `updateQty`, `restoreItem`, `clear`, `undoLastAdd`, `isOpen`/`openCart`/`closeCart` (not persisted), `hasAddedThisSession` (sessionStorage `mm-first-add`); lineId = itemId + djb2 hash of options; selectors count/subtotal/deliveryFee/amountToFreeDelivery | ✅ | `src/store/cart.ts` |
| Option pricing/labels/defaults (`defaultSelection`, `unitPriceFor`, `optionLabels`, `toCartInput`, `hasRequiredOptions` = has >1 size) | ✅ | `src/lib/itemOptions.ts` |
| ProductCard (default + compact), stretched link → item, chili "+" quick-add, category hover glow, Motion wobble/squish | ✅ | `src/components/ui/ProductCard.tsx` |
| Image-with-fallback (only requests photos that exist, via `virtual:photos` Vite plugin) | ✅ | `src/components/ui/ProductImage.tsx`, `vite.config.ts`, `src/types/virtual.d.ts` |
| Home "Kya khaoge aaj?" section: SplitText heading, Caveat note + self-drawing arrow, tabs with sliding `layoutId` fill + arrow keys, popLayout card swap, GSAP scroll reveal, doodle stickers, magnetic "See full menu" | ✅ | `src/sections/home/MenuPreview.tsx`, `MenuPreviewTabs.tsx` |
| Menu page: sticky glass chip bar (All + 6 categories, horizontal scroll, scroll-spy, follows navbar), 300ms debounced search, Veg/Spicy/Bestseller filters, Motion layout grid, Munchy empty state | ✅ | `src/pages/Menu.tsx`, `src/components/menu/*`, `src/lib/menuFilter.ts` |
| Item detail: modal over current page (background location) / full page on direct link; size, hot/iced, milk, spice, extras; rolling live price; qty; sticky "Add to cart · Rs X" bar | ✅ | `src/components/item/*`, `src/pages/ItemDetail.tsx`, `src/lib/routing.ts`, `src/app/RootLayout.tsx`, `src/app/routes.tsx` |
| CartDrawer: right panel (md+) / bottom sheet with drag handle (mobile), focus trap, Esc/backdrop close, option chips, steppers, swipe-to-remove + trash with Undo toast, free-delivery bar, upsell row, summary, Munchy empty state | ✅ | `src/components/layout/CartDrawer.tsx`, `src/components/layout/cart/*` |
| Upsell rules (coffee → dessert, burger → fries + drink, wrap → drink, never in-cart items) | ✅ | `src/lib/recommendations.ts` |
| Fly-to-cart arc (MotionPathPlugin) → jelly bounce (GSAP elastic) → odometer count; first-add confetti in token colours; "Nice pick! 🔥" toast + Undo; reduced motion = toast only | ✅ | `src/hooks/useFlyToCart.ts`, `src/hooks/useAddToCart.ts`, `src/lib/celebrate.ts`, `src/components/ui/RollingNumber.tsx` |
| UI kit: Badge, Chip, QuantityStepper, Sticker, HandArrow, MagneticButton, Modal, Drawer, RevealHeading, RollingNumber | ✅ | `src/components/ui/*` |
| Munchy mascot: static moods happy / sleepy / oops | 🟡 | `src/components/mascot/Munchy.tsx` (Phase 3 adds blink, eye-tracking, wave, idle sleep) |

### Phase 3: Brand logo, mascot & Home wow sections 🟡
| Feature | Status | Files |
|---|---|---|
| Brand asset pipeline (sharp): logo/icon/wordmark WebP ×4 sizes, favicon.ico (16/32/48), favicon-32.png, apple-touch-icon (180, oat), og-image (1200×630), generated aspect ratios | ✅ | `scripts/brand-assets.mjs` (`npm run brand`), `public/brand/*`, `public/favicon*`, `src/components/brand/brandAssets.ts` (generated) |
| `Logo` (full / icon / wordmark / horizontal / stamp; size; tone dark/light → oat badge) + `BrandImage` (srcset, exact w/h) + `LogoStamp` (rotating text ring, GSAP, reduced-motion static) | ✅ | `src/components/brand/*`, `src/lib/brand.ts` |
| index.html icons, og:image, twitter:image, theme-color = espresso | ✅ | `index.html` |
| Logo placements: navbar (icon+wordmark, wordmark tucks away on scroll, wiggle on hover), Suspense loader (pulsing), footer (full on oat badge + stamp), mobile cart pill (tiny icon), fallback-card watermark, toasts (`notify()`), 404 + empty cart | ✅ | `NavLogo.tsx`, `PageLoader.tsx`, `Footer.tsx`, `MobileBottomBar.tsx`, `ProductImage.tsx`, `src/lib/notify.tsx`, `NotFound.tsx`, `cart/CartContents.tsx` |
| JSON-LD CafeOrCoffeeShop (logo from `site.logoUrl`) | ✅ | `src/components/layout/JsonLd.tsx`, `site.ts` (`logoUrl`, `ogImage`) |
| Logo placements still to do: preloader, page-transition wipe, order-success page, stamp doodles in sections, logo 5-click coffee-spill easter egg | ⬜ | |
| Mascot (name: **Munchy**, default; owner may rename): layered SVG with data-part groups, 9 moods as static poses, ink options | 🟡 awaiting approval | `src/components/mascot/Mascot.tsx`, `MascotFace.tsx`, `mascotPoses.ts`, `src/pages/MascotLab.tsx` (DEV-only route `/mascot-lab`) |
| Mascot GSAP animation per mood + cart-event reactions + replace Phase 2 `Munchy` placeholders | ⬜ | (old placeholder: `src/components/mascot/Munchy.tsx`) |
| Preloader · Hero · Marquee · Bestsellers (pin desktop / snap mobile) · Deals strip · Reviews (Draggable+Inertia) · Find Us teaser · Footer wordmark reveal · page transitions | ⬜ | |

### Phase 4: Interactive toys ⬜
Build Your Burger · Coffee Lab · Wrap It Up · Vibe Picker (Flip) · Snack Roulette · custom cursor · page transitions (chili/cheese wipe) · logo 5-click coffee-spill easter egg. All ⬜.

### Phase 5: Checkout & Pakistan flow ⬜
Checkout form (rhf + zod), order type (delivery/takeaway/dine-in + table), sector dropdown, PK phone validation + `03XX-XXXXXXX` format, payment cards (COD default; JazzCash/Easypaisa/Card "coming soon"), WhatsApp order message (`src/lib/whatsapp.ts` TODO), order summary (subtotal/delivery/tax/total), success page (Munchy dance), Deals page, Our Story, Find Us, 404 with guilty Munchy. All ⬜ (pages exist as placeholders).

### Phase 6: Polish & QA ⬜
Reduced-motion + low-end paths audit, a11y pass, JSON-LD `CafeOrCoffeeShop`, OG image, image optimisation, Lighthouse mobile ≥ 90 ×4 (report scores), 360/768/1440 checks.

## 3. File map
```
index.html                      lang=en, default title/meta/OG (Seo.tsx updates per page)
vite.config.ts                  react + tailwind plugins, @ alias, vendor chunk groups, `virtual:photos` plugin (lists real files in public/images)
src/main.tsx                    fonts, lenis.css, global css, mounts <App/>
src/styles/index.css            @theme tokens (LOCKED), base styles, focus ring, utilities (grain, sticker, glass, pb-safe-bar), keyframes, reduced-motion CSS
src/types/virtual.d.ts          types for `virtual:photos`
src/app/App.tsx                 MotionConfig reducedMotion="user" + SmoothScroll + RouterProvider + sonner Toaster (mobileOffset below navbar)
src/app/router.tsx              createBrowserRouter([{ path: '*', Component: RootLayout }])
src/app/routes.tsx              PAGE_ROUTES (lazy pages via lazyNamed)
src/app/RootLayout.tsx          useRoutes(PAGE_ROUTES, background ?? location) + ItemModal overlay + CartDrawer + layout chrome
src/app/providers/SmoothScroll.tsx  ReactLenis root, gsap.ticker raf, lagSmoothing(0), useLenis(ScrollTrigger.update)
src/lib/gsap.ts                 registers ScrollTrigger, SplitText, Flip, Draggable, Inertia, Observer, CustomEase, MotionPath, DrawSVG, MorphSVG + useGSAP; MQ media queries
src/lib/motion-presets.ts       EASE, DUR, STAGGER (GSAP); SPRING, TAP_SQUISH, FADE_UP (Motion)
src/lib/utils.ts                cn() (tailwind-merge extended with our tokens), formatPKR() → "Rs 1,250", clamp()
src/lib/itemOptions.ts          option selection → unit price, labels, cart input
src/lib/menuFilter.ts           filterMenu(query, filters), getPreviewItems(category), FILTER_LABELS
src/lib/recommendations.ts      getUpsells(cartItems, limit) "Goes great with…"
src/lib/routing.ts              background-location helpers: modalStateFrom, getBackgroundLocation, getModalSlug, ITEM_PATH
src/lib/celebrate.ts            confettiBurst(x, y): lazy canvas-confetti, colours read from CSS tokens
src/lib/hours.ts                getOpenStatus() in Asia/Karachi (overnight-aware), formatTime/DayHours, DAY_LABELS, WEEK_ORDER
src/lib/whatsapp.ts             whatsappLink(message), WHATSAPP_GREETING
src/hooks/useReducedMotion.ts   reactive prefers-reduced-motion
src/hooks/useIsTouch.ts         touch detection + isLowEndDevice() (cores <= 4 or touch)
src/hooks/useScrollState.ts     rAF-throttled scrolled/hidden flags for navbar; SHOW_NAV_EVENT forces navbar back
src/hooks/useAddToCart.ts       THE way to add from UI: store + fly + confetti (first add) + toast w/ Undo
src/hooks/useFlyToCart.ts       MotionPath arc clone → [data-cart-target], jellyBounce()
src/hooks/useFocusTrap.ts       Tab trap + Esc + focus restore (stack-aware)
src/hooks/useScrollLock.ts      ref-counted Lenis stop + overflow hidden
src/hooks/useMagnetic.ts        GSAP quickTo magnetic pull (fine pointer + motion ok)
src/hooks/useMediaQuery.ts, useDebouncedValue.ts, useIsItemPage.ts
src/store/cart.ts               useCart (items, addItem, removeItem, updateQty, restoreItem, clear, undoLastAdd, isOpen, openCart, closeCart, hasAddedThisSession) + selectors/hooks useCartCount, useCartSubtotal, useDeliveryFee, useAmountToFreeDelivery
src/config/site.ts              ALL owner settings (contact, address, hours, fees, tax, delivery areas, socials)
src/data/menu.ts                MenuItem types, option sets, 33 items, CATEGORY_META colour-coding, SPICE_LABELS, lookups
src/data/deals.ts               combos + getDealOriginalPrice/getDealSavings (computed, never hardcoded)
src/data/reviews.ts             PLACEHOLDER reviews flagged isPlaceholder
src/components/ui/Button.tsx    Button (button) + ButtonLink (router Link)
src/components/ui/buttonClasses.ts  variant/size class builder (also for external <a>)
src/components/ui/OpenBadge.tsx live open/closed pill
src/components/ui/SocialIcons.tsx   Instagram/TikTok/WhatsApp line glyphs (lucide v1 has no brand icons)
src/components/ui/ProductCard.tsx, ProductImage.tsx, Badge.tsx, Chip.tsx, QuantityStepper.tsx, RollingNumber.tsx,
  Sticker.tsx, HandArrow.tsx, MagneticButton.tsx, Modal.tsx, Drawer.tsx, RevealHeading.tsx
src/components/mascot/Munchy.tsx    SVG mascot, moods happy|sleepy|oops, pupils tagged data-pupil
src/components/item/*           ItemDetailContent, ItemOptionsForm, OptionPills, StickyAddBar, ItemModal
src/components/menu/*           CategoryNav (sticky + scroll-spy), MenuSearch, MenuSection, MenuEmpty, menuIds
src/components/layout/*         Navbar, CartButton, CartDrawer (+ cart/CartContents, CartLineItem, CartSummary, CartUpsell, FreeDeliveryBar), Logo (+MugMark), navLinks, MobileBottomBar, WhatsAppFab, Footer, PageLoader, ScrollToTop, Seo, PagePlaceholder
src/sections/home/MenuPreview.tsx, MenuPreviewTabs.tsx
src/pages/*                     Home, Menu, ItemDetail, Deals, Checkout, OrderSuccess, OurStory, FindUs, NotFound (named exports)
public/images/{coffee,burgers,wraps,sides,drinks,desserts,brand}/  photos go here as <slug>.webp
```

## 4. Design system
- **Tokens** (Tailwind classes `bg-*`, `text-*`, `border-*`): espresso, oat, chili, cheese, caramel, pickle, bubblegum, ink (+ transparent, current). Default Tailwind palette is wiped (`--color-*: initial`), so non-brand colours fail at build time.
- **60/30/10:** 60% oat or espresso, 30% category colour, 10% chili CTAs. Sections alternate oat → espresso → cheese → oat. Add `grain` to sections.
- **Category colours:** coffee = caramel, burger = chili, wrap = pickle, sides = cheese, drinks/desserts = bubblegum (`CATEGORY_META` in `data/menu.ts`).
- **Contrast rules (computed):** oat on chili = 3.0:1 → **large bold text only (≥ 19px bold)**; small text on chili → espresso (5.7:1). Pickle/cheese/bubblegum backgrounds → espresso text. Caramel on oat = 3.0:1 → large display only; caramel on espresso = 5.7:1 OK. Cheese on espresso = 11.9:1.
- **Fonts:** `font-display` Bricolage Grotesque (headlines, buttons) · `font-sans` Plus Jakarta Sans (body/UI) · `font-hand` Caveat (doodle notes) · `font-urdu` Noto Nastaliq Urdu (Urdu only; set `lang="ur" dir="rtl"`, generous line-height ~2.2).
- **Type scale:** `text-mega` clamp(3.5rem, 14vw, 13rem) for hero/wordmark; `text-display` clamp(2.5rem, 7vw, 6rem) for section heads.
- **Shapes:** `rounded-blob` (2rem) cards; `sticker` = 2.5px espresso border + `shadow-hard`; shadows `shadow-hard-sm | shadow-hard | shadow-hard-lg | shadow-hard-oat`. Hover shifts element up-left and grows shadow; press = translate + shadow none.
- **Focus:** global `:focus-visible` 3px cheese outline; auto-switches to espresso on `.bg-cheese`/`.bg-pickle`.
- **Eases:** CSS `ease-bouncy`, `ease-snappy`; GSAP `EASE.bouncy/squish/snappy/elastic`; Motion `SPRING.soft/bouncy/snappy`.
- **CSS loops:** `animate-float`, `animate-steam`, `animate-wiggle`, `animate-pulse-ring` (all disabled by reduced motion).
- **Components:** use `Button`/`ButtonLink` for every CTA (`variant="primary"` = chili). External links that look like buttons: `<a className={buttonClasses(...)}>`. Pages start with `<Seo title description path />`.
- **Layout offsets:** navbar is fixed → page tops need `pt-28`+; mobile bottom bar is fixed → root uses `pb-safe-bar md:pb-0`.
- **Fly-to-cart target:** `[data-cart-target]` (navbar CartButton); `[data-cart-jelly]` inside it bounces. Navbar has `[data-nav-header]`.
- **Adding to cart:** always `useAddToCart()(toCartInput(item, selection), { qty, source: imageEl })`. Never call `addItem` directly from UI (you'd lose fly/confetti/toast).
- **Linking to an item:** `<Link to={'/menu/' + slug} state={modalStateFrom(location)}>` → opens the modal over the current page. Plain links / direct URLs → full page.
- **Dialogs:** `<AnimatePresence>{open && <Modal|Drawer onClose labelledBy>…</Modal>}</AnimatePresence>`. Both trap focus, close on Esc/backdrop, lock scroll. Mark inner scroll areas `data-lenis-prevent`.
- **ProductCard** for any menu item tile (`variant="compact"` in rows). **Chip** for pills/tabs/toggles (`layoutId` for a sliding fill). **RollingNumber** for any changing price/count. **RevealHeading** for section headings. **Sticker** for doodles. **MagneticButton** wraps big CTAs.
- **Tailwind v4 gotcha:** `translate-*`, `rotate-*`, `scale-*` use the standalone CSS `translate`/`rotate`/`scale` properties, so transition them with `transition-[translate,scale,rotate]`, not `transition-[transform]`. GSAP writes `transform`, so they don't fight.
- **tailwind-merge:** custom tokens are registered in `lib/utils.ts`. Add new custom utilities there too, or `cn()` may drop classes (e.g. `text-display` vs `text-espresso`).
- **Motion vs GSAP on cards:** Motion = presence/layout wrapper + card hover/tap; GSAP scroll reveal = a separate inner wrapper (`[data-reveal-card]`). Never the same element.

## 5. Config & data the owner must fill
- `src/config/site.ts`: WhatsApp number (digits, e.g. 923001234567), phone, email, address line + area, Google Maps link, lat/lng, Instagram + TikTok handles, real opening hours, free-delivery threshold, delivery fee, **tax rate (confirm with accountant, currently 0)**, delivery areas list, real domain (`url`).
- `src/data/menu.ts`: **PLACEHOLDER PRICES**; confirm names, descriptions, prices, option prices.
- `src/data/deals.ts`: deal prices + rules (student card rule, midnight window).
- `src/data/reviews.ts`: replace samples with REAL reviews (with permission) and set `isPlaceholder: false`.
- Photos: `public/images/<folder>/<slug>.webp` (e.g. `public/images/burgers/classic-smash.webp`), ~1200px, WebP/AVIF. Until then fallback cards render.
- OG image: `public/images/brand/og.jpg` (1200×630).

## 6. Known issues / tech debt
- History state survives a page refresh, so refreshing while the item modal is open re-opens it over the page (standard behaviour). A fresh/direct link always gets the full page.
- Quick-add policy: items with >1 size open the modal (coffees); everything else adds instantly with defaults (spice = Medium). Change in `hasRequiredOptions()`.
- Delivery fee shows in the drawer for every cart; order-type logic (takeaway/dine-in = no fee) comes with checkout in Phase 5.
- Motion prints a dev-only "Reduced Motion enabled" console warning when the OS setting is on; it is not in production builds.
- GSAP (~86 KB gz with all 10 plugins) loads in the app shell because every plugin is registered in one file. Phase 6: consider lazy-registering heavy plugins (Draggable, Inertia, MorphSVG) if Lighthouse needs it.
- Motion is ~46 KB gz; Phase 6: consider `LazyMotion` + `m` components.
- Noto Nastaliq Urdu Arabic subset is 239 KB (only downloads when Urdu glyphs render, i.e. the footer). Phase 6: subset to the wordmark glyphs.
- Reviews are placeholders; UI must label them as samples while `isPlaceholder` is true.
- Headless Chrome on Windows has a ~500px minimum window; use CDP device emulation for 360px screenshots.

## 7. Future goals (not built yet)
Node/Supabase backend + real orders DB · real JazzCash / Easypaisa / card gateway integration · admin dashboard to edit menu & prices · live order tracking · "Munch Points" loyalty & referral · Urdu/English language toggle · PWA + "Add to home screen" · table QR ordering for dine-in · reservations · push/WhatsApp order-status notifications · analytics (GA4 / Meta Pixel) with consent · Foodpanda link-out · A/B testing CTA copy.

## 8. Changelog (Asia/Karachi dates)
### 2026-11-06: Phase 3 (part 1): logo system + mascot draft
- Owner logo added (`public/brand/logo.png`), analysed (section 1b). `sharp` + `scripts/brand-assets.mjs` generate all brand assets; old placeholder mug logo + favicon.svg removed.
- `Logo`/`BrandImage`/`LogoStamp` components; logo wired into navbar, loader, footer, cart pill, fallback cards, toasts, 404, empty cart, JSON-LD.
- Mascot drafted from the logo character (static poses for all 9 moods) on DEV-only `/mascot-lab`, with 3 ink options. Waiting for owner approval before animating.
- Colour tokens untouched.

### 2026-11-06: Phase 2 Cart, core commerce + Home menu section
- Cart store rewritten to the Phase 2 API (items/addItem/removeItem/updateQty/undoLastAdd, isOpen, hasAddedThisSession, deliveryFee + amountToFreeDelivery selectors). Persist version 2.
- ProductCard + ProductImage (styled fallback; `virtual:photos` Vite plugin so missing photos are never requested).
- Home MenuPreview ("Kya khaoge aaj?") after the hero; placeholder bands re-coloured to keep alternation.
- Menu page (sticky scroll-spy chips, debounced search, filters, empty state), item modal/full page with options + sticky add bar, CartDrawer with swipe-to-remove, free-delivery bar, upsell.
- Fly-to-cart, jelly bounce, odometer counts, first-add confetti, Undo toasts. Munchy mascot (static moods).
- Fixed Phase 1 bug: `transition-[transform]` didn't animate Tailwind v4 translate utilities (navbar hide + button hover now animate).
- tailwind-merge taught our custom tokens (it was dropping `text-display`).
- Colour tokens untouched (index.css byte-identical to Phase 1).
- Verified with a CDP QA script at 360/768/1440 in dev AND production build: tabs, quick-add, merge, Undo, modal (focus trap, Esc, focus restore), live price, drawer, persistence after reload, direct link, sticky bar, search/filters/scroll-spy, keyboard-only flows, reduced motion (no fly/confetti, toast only). 0 console errors/warnings in production.
- Pushed to GitHub `main`.

### 2026-11-06: Phase 1 Foundation
- Scaffolded Vite 8 + React 19 + TS 7 (strict, `noUncheckedIndexedAccess`), installed all deps (Tailwind 4.3, GSAP 3.15, Lenis 1.3, Motion 14, React Router 8, Zustand 5, RHF 7 + Zod 4, lucide 1.x, sonner 2).
- Design tokens, fonts, utilities, keyframes in `src/styles/index.css`.
- GSAP registry + presets; Lenis on gsap.ticker with ScrollTrigger sync (disabled for reduced motion).
- Router with 9 lazy routes; RootLayout with Navbar, Footer, MobileBottomBar, WhatsAppFab, skip link, ScrollToTop, Seo.
- Config (`site.ts`), menu (33 items), deals (savings computed), placeholder reviews, cart store with persistence.
- Vendor chunk splitting removed the >500 KB chunk warning.
- Verified: `npm run build` (0 TS errors, 0 warnings), `npm run lint` clean, all routes 200, no console errors, no horizontal overflow at 360px, screenshots at 360/768/1440.
