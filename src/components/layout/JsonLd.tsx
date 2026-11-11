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
  servesCuisine: ['Coffee', 'Burgers', 'Wraps', 'Steaks', 'Matcha'],
  address: {
    '@type': 'PostalAddress',
    ...(site.address.line1 ? { streetAddress: site.address.line1 } : {}),
    addressLocality: `${site.address.area}, ${site.address.city}`,
    addressCountry: 'PK',
  },
  // Only with a real pin (owner fills lat/lng).
  ...(site.address.lat !== null && site.address.lng !== null ? { geo: { '@type': 'GeoCoordinates', latitude: site.address.lat, longitude: site.address.lng } } : {}),
  sameAs: [instagramUrl, ...(tiktokUrl ? [tiktokUrl] : [])],
}

export function JsonLd() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
