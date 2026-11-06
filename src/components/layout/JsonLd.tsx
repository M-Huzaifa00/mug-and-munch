import { instagramUrl, site, tiktokUrl } from '@/config/site'

/**
 * schema.org CafeOrCoffeeShop structured data, built from site.ts (placeholders until the owner fills it).
 * TODO (Phase 6): openingHoursSpecification + menu URL.
 */
const data = {
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  name: site.brandName,
  alternateName: site.alternateName,
  url: site.url,
  logo: site.url + site.logoUrl,
  image: site.url + site.ogImage,
  telephone: site.contact.phoneHref.replace('tel:', ''),
  servesCuisine: ['Coffee', 'Burgers', 'Wraps'],
  priceRange: 'Rs 300 – Rs 3,500',
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.line1,
    addressLocality: `${site.address.area}, ${site.address.city}`,
    addressCountry: 'PK',
  },
  geo: { '@type': 'GeoCoordinates', latitude: site.address.lat, longitude: site.address.lng },
  sameAs: [instagramUrl, tiktokUrl],
}

export function JsonLd() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
