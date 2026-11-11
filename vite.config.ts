/// <reference types="vitest/config" />
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const PUBLIC_DIR = fileURLToPath(new URL('./public', import.meta.url))
const IMAGES_DIR = resolve(PUBLIC_DIR, 'images')
const PHOTO_EXT = /\.(webp|avif|jpe?g|png)$/i

/**
 * `virtual:photos` → { "/images/burgers/classic-smash": "/images/burgers/classic-smash.webp", ... }
 * Lists the photos that actually exist in public/images so the UI only requests real files
 * (no 404s) and shows the styled fallback card for the rest. Owner just drops files in.
 */
function menuPhotos(): Plugin {
  const VIRTUAL_ID = 'virtual:photos'
  const RESOLVED_ID = '\0' + VIRTUAL_ID

  const scan = (dir: string): string[] => {
    try {
      return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = join(dir, entry.name)
        if (entry.isDirectory()) return scan(full)
        return PHOTO_EXT.test(entry.name) ? [full] : []
      })
    } catch {
      return []
    }
  }

  const buildMap = (): Record<string, string> => {
    const map: Record<string, string> = {}
    for (const file of scan(IMAGES_DIR)) {
      const url = '/' + relative(PUBLIC_DIR, file).split(sep).join('/')
      const key = url.replace(PHOTO_EXT, '')
      // Prefer AVIF > WebP > others when several formats exist.
      const rank = (u: string) => (u.endsWith('.avif') ? 0 : u.endsWith('.webp') ? 1 : 2)
      if (!map[key] || rank(url) < rank(map[key])) map[key] = url
    }
    return map
  }

  return {
    name: 'mm-menu-photos',
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined
    },
    load(id) {
      return id === RESOLVED_ID ? `export default ${JSON.stringify(buildMap())}` : undefined
    },
    configureServer(server) {
      const onChange = (file: string) => {
        if (!resolve(file).startsWith(IMAGES_DIR) || !PHOTO_EXT.test(file)) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.add(IMAGES_DIR)
      server.watcher.on('add', onChange)
      server.watcher.on('unlink', onChange)
    },
  }
}

/**
 * Fills %BRAND_NAME% / %ALT_NAME% / %SITE_URL% in index.html from src/config/site.ts,
 * so the static fallback tags (title, og:*) never hardcode the brand.
 */
function siteHtmlVars(): Plugin {
  const siteFile = fileURLToPath(new URL('./src/config/site.ts', import.meta.url))
  const read = (key: string) => readFileSync(siteFile, 'utf8').match(new RegExp(`${key}:\\s*'([^']+)'`))?.[1] ?? ''
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  return {
    name: 'mm-site-html-vars',
    transformIndexHtml: (html) =>
      html
        .replaceAll('%BRAND_NAME%', esc(read('brandName')))
        .replaceAll('%ALT_NAME%', esc(read('alternateName')))
        .replaceAll('%SITE_URL%', esc(read('url'))),
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), menuPhotos(), siteHtmlVars()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // Test-only menu items + deal (keeps option / deal code paths covered whatever the owner's data holds).
    setupFiles: ['src/lib/__tests__/setup.ts'],
  },
  build: {
    rolldownOptions: {
      output: {
        // Split big vendors into their own long-cacheable chunks that download in parallel.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/, priority: 30 },
            { name: 'gsap', test: /node_modules[\\/](gsap|@gsap)[\\/]/, priority: 20 },
            { name: 'motion', test: /node_modules[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/, priority: 20 },
            // Checkout-only (zod + RHF): keep out of the shell vendor chunk.
            { name: 'forms', test: /node_modules[\\/](zod|react-hook-form|@hookform)[\\/]/, priority: 25 },
            { name: 'vendor', test: /node_modules[\\/]/, priority: 10 },
          ],
        },
      },
    },
  },
})
