import { instagramUrl, site } from '@/config/site'
import { menu } from '@/data/menu'
import { buttonClasses } from '@/components/ui/buttonClasses'
import { ProductImage } from '@/components/ui/ProductImage'
import { InstagramIcon } from '@/components/ui/SocialIcons'

// TODO: owner swaps these for real Instagram posts (or an embed) once the account has content.
const TILES = menu.filter((i) => i.badges.includes('bestseller') || i.badges.includes('new')).slice(0, 9)

/** 3×3 Instagram-style grid placeholder with hover zoom + follow button. */
export function InstaGrid() {
  return (
    <div className="mt-16 text-center">
      <ul className="mx-auto grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
        {TILES.map((item) => (
          <li key={item.id}>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.name} on Instagram (opens in new tab)`}
              className="group block aspect-square overflow-hidden rounded-2xl border-2 border-oat/30"
            >
              <span className="block size-full transition-transform duration-500 ease-snappy group-hover:scale-110">
                <ProductImage name={item.name} emoji={item.emoji} image={item.image} category={item.category} size="sm" showName={false} />
              </span>
            </a>
          </li>
        ))}
      </ul>
      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses('cheese', 'md', 'mt-8')}>
        <InstagramIcon size={22} /> Follow us @{site.socials.instagram}
      </a>
    </div>
  )
}
