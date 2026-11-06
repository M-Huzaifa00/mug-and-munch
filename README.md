# Mug n Munch

Website for Mug n Munch (also written "Mug & Munch"), a café in Islamabad serving coffee, burgers and wraps. **Sip. Bite. Repeat.**

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview  # serve the build
npm run brand    # regenerate logo sizes, favicons and OG image from public/brand/logo.png
```

Owner settings (brand name, contact, hours, fees): `src/config/site.ts`. Menu, prices and deals: `src/data/`. Photos go in `public/images/<category>/<slug>.webp`.
Project status and architecture: see `claude.mind.md`.
