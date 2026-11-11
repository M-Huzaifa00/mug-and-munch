import { useState } from 'react'
import { Search } from 'lucide-react'
import { site } from '@/config/site'
import { getFeatured } from '@/data/menu'
import { useTransitionNavigate } from '@/hooks/useTransitionNavigate'
import { Button, ButtonLink } from '@/components/ui/Button'
import { ProductCard } from '@/components/ui/ProductCard'
import { Logo } from '@/components/brand/Logo'
import { Seo } from '@/components/layout/Seo'
import { Mascot } from '@/components/mascot/Mascot'

const PICKS = getFeatured().slice(0, 3)

/** Fun 404: guilty Munchy, mini menu search (→ /menu?q=), 3 of our picks, Home + Menu buttons. */
export function NotFound() {
  const [q, setQ] = useState('')
  const navigate = useTransitionNavigate()

  return (
    <>
      <Seo title="Page not found" description={`This page got munched. Search the ${site.brandName} menu or grab one of our picks instead.`} path="/404" />
      <section className="grain flex flex-col items-center bg-oat px-4 pt-28 pb-16 text-center">
        <div className="flex items-end gap-4">
          <Mascot mood="guilty" className="h-44" label="Munchy looking guilty with crumbs" />
          <Logo variant="icon" size={88} alt="" className="-rotate-6" />
        </div>
        <p className="mt-6 font-hand text-3xl text-ink">oops… sorry yaar</p>
        <h1 className="text-display mt-2 font-extrabold text-espresso">This page got munched 🍔</h1>

        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            const term = q.trim()
            navigate(term ? `/menu?q=${encodeURIComponent(term)}` : '/menu')
          }}
          className="mt-8 flex w-full max-w-md gap-2"
        >
          <label htmlFor="nf-search" className="sr-only">
            Search the menu
          </label>
          <div className="relative flex-1">
            <Search size={20} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-espresso" />
            <input
              id="nf-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Latte, smash, wrap…"
              enterKeyHint="search"
              className="min-h-12 w-full rounded-full border-[2.5px] border-espresso bg-oat pr-4 pl-11 text-base font-semibold text-espresso shadow-hard-sm placeholder:text-ink/60"
            />
          </div>
          <Button type="submit" size="md">
            Search
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/" size="md" variant="outline">
            Go home
          </ButtonLink>
          <ButtonLink to="/menu" size="md" variant="dark">
            See the menu
          </ButtonLink>
        </div>
      </section>

      <section aria-labelledby="nf-picks" className="grain bg-cheese px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 id="nf-picks" className="font-display text-3xl font-extrabold text-espresso">
            While you're here, a few of our picks
          </h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-3">
            {PICKS.map((item) => (
              <li key={item.id}>
                <ProductCard item={item} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
