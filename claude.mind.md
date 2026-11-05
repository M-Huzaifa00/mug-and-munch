# claude.mind.md: Mug & Munch project brain

> Read this before every task. Never rebuild anything marked ✅. Update status, file map and changelog after every task.
> Current phase: **Phase 1 ✅ done** → waiting for "next" to start **Phase 2 (Cart & core commerce)**.

---

## 1. Vision & audience
- **What:** Website for Mug & Munch, a real café in Islamabad serving coffee, smash burgers and wraps. Frontend only for now.
- **Goal #1:** Colour + motion + micro-interactions make visitors tap "Add to cart" within 30 seconds.
- **Goal #2:** Feels local to Pakistani Gen Z (students, young professionals, late-night crowd); fast on mid-range Android (mobile-first, 360px design width).
- **Voice:** English-first, max 1 Roman Urdu line per section ("Bhook lagi? We got you.", "Yaar, ek aur?", "Order karo, chill karo"). Tagline **Sip. Bite. Repeat.** Urdu wordmark **مگ اینڈ منچ**.
- **Persuasion:** honest only. No fake timers, stock counts, viewer counts or reviews.

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
| Cart button with live count (aria-live) | ✅ | `src/components/layout/CartButton.tsx` (links to /checkout until drawer exists) |
| Mobile bottom tab bar + floating "View cart · Rs X" pill | ✅ | `src/components/layout/MobileBottomBar.tsx` |
| Floating WhatsApp button | ✅ | `src/components/layout/WhatsAppFab.tsx` |
| Footer (tagline, Urdu wordmark, hours, live open badge, socials, giant wordmark static) | ✅ | `src/components/layout/Footer.tsx` |
| Live Open/Closed badge (Asia/Karachi, overnight hours) | ✅ | `src/lib/hours.ts`, `src/components/ui/OpenBadge.tsx` |
| Config + data (site, menu 33 items, deals w/ computed savings, placeholder reviews) | ✅ | `src/config/site.ts`, `src/data/*.ts` |
| Cart store (Zustand persist `mm-cart`, merge by options, undo restore) | ✅ | `src/store/cart.ts` |
| Button / ButtonLink / buttonClasses | ✅ | `src/components/ui/Button.tsx`, `buttonClasses.ts` |
| Vendor chunk splitting (react / gsap / motion / vendor) | ✅ | `vite.config.ts` |

### Phase 2: Cart & core commerce ⬜
| Feature | Status | Files |
|---|---|---|
| ProductCard + image-with-fallback (category gradient + emoji + name) | ⬜ | |
| Menu page: category chips (Motion layout), search | ⬜ | `src/pages/Menu.tsx` (placeholder) |
| Item detail: modal over /menu from inside, full page on direct link; size/temp/milk/spice/extras with live price | ⬜ | `src/pages/ItemDetail.tsx` (placeholder) |
| Sticky add-to-cart bar on item page | ⬜ | |
| CartDrawer (focus trap, Esc, data-lenis-prevent), steppers, swipe-to-remove | ⬜ | |
| Fly-to-cart (MotionPath arc → `[data-cart-target]`), jelly bounce, odometer count | ⬜ | |
| First-add confetti + "Nice pick! 🔥" toast with Undo | ⬜ | |
| Free-delivery progress bar, upsell "Goes great with…" | ⬜ | `src/lib/recommendations.ts` |
| Remaining ui: Badge, Chip, QuantityStepper, Sticker, Modal, Drawer, MagneticButton | ⬜ | |

### Phase 3: Home wow sections ⬜
Preloader (mug fill, 0→100, once per session) · Hero (SplitText, 3-layer parallax, magnetic CTAs, Munchy peeking) · Marquee (2 tilted, scroll-velocity) · Bestsellers (pinned horizontal) · Deals strip · Reviews (Draggable + Inertia stickers, IG grid) · Find Us teaser · Footer wordmark letter reveal · Munchy mascot (blink, eye tracking, wave, sleep zZz). All ⬜. Home currently shows a static hero + placeholder bands (`src/pages/Home.tsx`).

### Phase 4: Interactive toys ⬜
Build Your Burger · Coffee Lab · Wrap It Up · Vibe Picker (Flip) · Snack Roulette · custom cursor · page transitions (chili/cheese wipe) · logo 5-click coffee-spill easter egg. All ⬜.

### Phase 5: Checkout & Pakistan flow ⬜
Checkout form (rhf + zod), order type (delivery/takeaway/dine-in + table), sector dropdown, PK phone validation + `03XX-XXXXXXX` format, payment cards (COD default; JazzCash/Easypaisa/Card "coming soon"), WhatsApp order message (`src/lib/whatsapp.ts` TODO), order summary (subtotal/delivery/tax/total), success page (Munchy dance), Deals page, Our Story, Find Us, 404 with guilty Munchy. All ⬜ (pages exist as placeholders).

### Phase 6: Polish & QA ⬜
Reduced-motion + low-end paths audit, a11y pass, JSON-LD `CafeOrCoffeeShop`, OG image, image optimisation, Lighthouse mobile ≥ 90 ×4 (report scores), 360/768/1440 checks.

## 3. File map
```
index.html                      lang=en, default title/meta/OG (Seo.tsx updates per page)
vite.config.ts                  react + tailwind plugins, @ alias, vendor chunk groups
src/main.tsx                    fonts, lenis.css, global css, mounts <App/>
src/styles/index.css            @theme tokens, base styles, focus ring, utilities (grain, sticker, glass, pb-safe-bar), keyframes, reduced-motion CSS
src/app/App.tsx                 SmoothScroll + RouterProvider + sonner Toaster
src/app/router.tsx              createBrowserRouter, lazyNamed() helper, all routes
src/app/RootLayout.tsx          skip link, Navbar, <main> + Suspense/Outlet, Footer, MobileBottomBar, WhatsAppFab
src/app/providers/SmoothScroll.tsx  ReactLenis root, gsap.ticker raf, lagSmoothing(0), useLenis(ScrollTrigger.update)
src/lib/gsap.ts                 registers ScrollTrigger, SplitText, Flip, Draggable, Inertia, Observer, CustomEase, MotionPath, DrawSVG, MorphSVG + useGSAP; MQ media queries
src/lib/motion-presets.ts       EASE, DUR, STAGGER (GSAP); SPRING, TAP_SQUISH, FADE_UP (Motion)
src/lib/utils.ts                cn(), formatPKR() → "Rs 1,250", clamp()
src/lib/hours.ts                getOpenStatus() in Asia/Karachi (overnight-aware), formatTime/DayHours, DAY_LABELS, WEEK_ORDER
src/lib/whatsapp.ts             whatsappLink(message), WHATSAPP_GREETING
src/hooks/useReducedMotion.ts   reactive prefers-reduced-motion
src/hooks/useIsTouch.ts         touch detection + isLowEndDevice() (cores <= 4 or touch)
src/hooks/useScrollState.ts     rAF-throttled scrolled/hidden flags for navbar
src/store/cart.ts               useCart (lines, addLine, setQty, increment, decrement, remove, restore, clear), useCartCount, useCartSubtotal
src/config/site.ts              ALL owner settings (contact, address, hours, fees, tax, delivery areas, socials)
src/data/menu.ts                MenuItem types, option sets, 33 items, CATEGORY_META colour-coding, SPICE_LABELS, lookups
src/data/deals.ts               combos + getDealOriginalPrice/getDealSavings (computed, never hardcoded)
src/data/reviews.ts             PLACEHOLDER reviews flagged isPlaceholder
src/components/ui/Button.tsx    Button (button) + ButtonLink (router Link)
src/components/ui/buttonClasses.ts  variant/size class builder (also for external <a>)
src/components/ui/OpenBadge.tsx live open/closed pill
src/components/ui/SocialIcons.tsx   Instagram/TikTok/WhatsApp line glyphs (lucide v1 has no brand icons)
src/components/layout/*         Navbar, CartButton, Logo (+MugMark), navLinks, MobileBottomBar, WhatsAppFab, Footer, PageLoader, ScrollToTop, Seo, PagePlaceholder
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
- **Fly-to-cart target:** any element with `[data-cart-target]` (the navbar CartButton).

## 5. Config & data the owner must fill
- `src/config/site.ts`: WhatsApp number (digits, e.g. 923001234567), phone, email, address line + area, Google Maps link, lat/lng, Instagram + TikTok handles, real opening hours, free-delivery threshold, delivery fee, **tax rate (confirm with accountant, currently 0)**, delivery areas list, real domain (`url`).
- `src/data/menu.ts`: **PLACEHOLDER PRICES**; confirm names, descriptions, prices, option prices.
- `src/data/deals.ts`: deal prices + rules (student card rule, midnight window).
- `src/data/reviews.ts`: replace samples with REAL reviews (with permission) and set `isPlaceholder: false`.
- Photos: `public/images/<folder>/<slug>.webp` (e.g. `public/images/burgers/classic-smash.webp`), ~1200px, WebP/AVIF. Until then fallback cards render.
- OG image: `public/images/brand/og.jpg` (1200×630).

## 6. Known issues / tech debt
- Cart button + mobile pill link to `/checkout` until CartDrawer lands (Phase 2).
- `/menu/:slug` is always a full page; modal-over-menu pattern comes in Phase 2.
- GSAP (~86 KB gz with all 10 plugins) loads in the app shell because every plugin is registered in one file. Phase 6: consider lazy-registering heavy plugins (Draggable, Inertia, MorphSVG) if Lighthouse needs it.
- Motion is ~46 KB gz; Phase 6: consider `LazyMotion` + `m` components.
- Noto Nastaliq Urdu Arabic subset is 239 KB (only downloads when Urdu glyphs render, i.e. the footer). Phase 6: subset to the wordmark glyphs.
- Reviews are placeholders; UI must label them as samples while `isPlaceholder` is true.
- Headless Chrome on Windows has a ~500px minimum window; use CDP device emulation for 360px screenshots.

## 7. Future goals (not built yet)
Node/Supabase backend + real orders DB · real JazzCash / Easypaisa / card gateway integration · admin dashboard to edit menu & prices · live order tracking · "Munch Points" loyalty & referral · Urdu/English language toggle · PWA + "Add to home screen" · table QR ordering for dine-in · reservations · push/WhatsApp order-status notifications · analytics (GA4 / Meta Pixel) with consent · Foodpanda link-out · A/B testing CTA copy.

## 8. Changelog (Asia/Karachi dates)
### 2026-11-06: Phase 1 Foundation
- Scaffolded Vite 8 + React 19 + TS 7 (strict, `noUncheckedIndexedAccess`), installed all deps (Tailwind 4.3, GSAP 3.15, Lenis 1.3, Motion 14, React Router 8, Zustand 5, RHF 7 + Zod 4, lucide 1.x, sonner 2).
- Design tokens, fonts, utilities, keyframes in `src/styles/index.css`.
- GSAP registry + presets; Lenis on gsap.ticker with ScrollTrigger sync (disabled for reduced motion).
- Router with 9 lazy routes; RootLayout with Navbar, Footer, MobileBottomBar, WhatsAppFab, skip link, ScrollToTop, Seo.
- Config (`site.ts`), menu (33 items), deals (savings computed), placeholder reviews, cart store with persistence.
- Vendor chunk splitting removed the >500 KB chunk warning.
- Verified: `npm run build` (0 TS errors, 0 warnings), `npm run lint` clean, all routes 200, no console errors, no horizontal overflow at 360px, screenshots at 360/768/1440.
