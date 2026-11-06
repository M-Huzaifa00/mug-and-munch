# Mug n Munch — CLAUDE.md

**Before starting any task, read claude.mind.md. Never rebuild something marked ✅. After finishing any task, update claude.mind.md (status, file map, changelog).**

Mug n Munch (written "Mug n Munch" everywhere via `site.brandName`; alt "Mug & Munch") is a real café in Islamabad, Pakistan (coffee, smash burgers, wraps). This repo is the frontend-only website: an award-level, Gen Z, mobile-first food site that must also convert ("Add to cart" within 30s). English-first copy with light Roman Urdu, PKR prices, built to run on mid-range Android phones. Built in 6 phases; stop after each phase and wait for "next".

## Stack
Vite 8 + React 19 + TypeScript (strict) · Tailwind v4 (`@tailwindcss/vite`, tokens in `src/styles/index.css` `@theme`, no tailwind.config) · GSAP 3 + all plugins (registered once in `src/lib/gsap.ts`) + `@gsap/react` · Lenis (`lenis/react`, driven by gsap.ticker) · Motion (`motion/react`, UI state only) · React Router (`react-router`, lazy pages) · Zustand + persist (`mm-cart`) · react-hook-form + zod · lucide-react · sonner · canvas-confetti · Fontsource variable fonts.

## Commands
- `npm run dev`: dev server (http://localhost:5173)
- `npm run build`: type-check + production build (must pass with 0 TS errors)
- `npm run preview`: serve the built `dist/`
- `npm run lint`: oxlint

## Top 10 code rules
1. TypeScript strict, no `any`; functional components, **named exports**, one component per file, PascalCase components, camelCase utils.
2. Colours: ONLY theme tokens (`bg-chili`, `text-espresso`…); no raw hex in components. Tokens are **LOCKED**: never edit the `@theme` colours; use opacity (`bg-chili/15`) for new shades.
3. All GSAP inside `useGSAP({ scope })`; import gsap/plugins from `@/lib/gsap` only; no unscoped global selectors.
4. GSAP owns scroll + timelines; Motion owns mount/unmount, layout, whileTap. Never both on one element.
5. Timings/eases come from `src/lib/motion-presets.ts` (EASE, DUR, STAGGER, SPRING); don't invent new ones.
6. Animate only `transform` and `opacity`; wrap motion in `gsap.matchMedia()` and respect `useReducedMotion()`.
7. Owner data lives in `src/config/site.ts` and `src/data/*`; never hardcode prices, numbers, hours in components.
8. Every "Add to cart"/"Order now" CTA is chili (`Button` / `buttonClasses`); oat text only at >= 19px bold, else espresso.
9. Components under ~200 lines; split if bigger. Touch targets >= 44px; focus-visible ring stays visible.
10. Honest persuasion only: no fake timers, fake stock, fake viewer counts, or fake reviews.

## Colour tokens
| Token | Hex | Role |
|---|---|---|
| espresso | #1A0F0A | dark base, text on light |
| oat | #FFF4E6 | light base / main background |
| chili | #FF4D2E | PRIMARY CTA, burgers |
| cheese | #FFC531 | highlights, badges, prices, deals |
| caramel | #C77B3B | coffee category |
| pickle | #B8F34A | wraps, "fresh" signals |
| bubblegum | #FF8FC7 | playful accents, stickers |
| ink | #2B1B14 | body text on oat |

@claude.mind.md
