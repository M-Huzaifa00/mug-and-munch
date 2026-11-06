import { useEffect } from 'react'
import { site } from '@/config/site'

interface SeoProps {
  /** Page title without the brand suffix. Omit on home to use the full default title. */
  title?: string
  description: string
  path: string
}

export const DEFAULT_TITLE = `${site.brandName} | Coffee, Burgers & Wraps in Islamabad`

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

/**
 * Per-page title/description/OG/canonical. Updates the existing tags from index.html
 * (avoids duplicate <title> tags that React 19 metadata hoisting would create).
 */
export function Seo({ title, description, path }: SeoProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${site.brandName}` : DEFAULT_TITLE
    document.title = fullTitle
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', `${site.url}${path}`)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${site.url}${path}`
  }, [title, description, path])

  return null
}
