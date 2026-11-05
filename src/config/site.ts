/**
 * Owner-editable site config. Components read from here, never hardcode.
 * Every value marked TODO must be filled by the owner before launch.
 */

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

/** 24h "HH:MM". If close <= open the café closes after midnight (e.g. 12:00 → 02:00). */
export type DayHours = { open: string; close: string } | null

export const site = {
  name: 'Mug & Munch',
  nameUrdu: 'مگ اینڈ منچ',
  tagline: 'Sip. Bite. Repeat.',
  heroLine: "Islamabad's late-night coffee & smash spot", // editable
  url: 'https://mugandmunch.pk', // TODO: owner fills (real domain)

  contact: {
    whatsappNumber: '923000000000', // TODO: owner fills (international format, digits only, no +)
    phoneDisplay: '0300-0000000', // TODO: owner fills
    phoneHref: 'tel:+923000000000', // TODO: owner fills
    email: 'hello@mugandmunch.pk', // TODO: owner fills
  },

  address: {
    line1: 'Shop #, Street / Markaz', // TODO: owner fills
    area: 'F-7 Markaz', // TODO: owner fills
    city: 'Islamabad',
    country: 'Pakistan',
    mapsUrl: 'https://maps.google.com/?q=Islamabad', // TODO: owner fills (Google Maps share link)
    lat: 33.7215, // TODO: owner fills
    lng: 73.0433, // TODO: owner fills
  },

  socials: {
    instagram: 'mugandmunch', // TODO: owner fills (handle without @)
    tiktok: 'mugandmunch', // TODO: owner fills
  },

  timezone: 'Asia/Karachi',

  // TODO: owner fills real hours. null = closed that day.
  hours: {
    mon: { open: '12:00', close: '02:00' },
    tue: { open: '12:00', close: '02:00' },
    wed: { open: '12:00', close: '02:00' },
    thu: { open: '12:00', close: '02:00' },
    fri: { open: '14:00', close: '03:00' },
    sat: { open: '12:00', close: '03:00' },
    sun: { open: '12:00', close: '02:00' },
  } satisfies Record<DayKey, DayHours>,

  commerce: {
    freeDeliveryThreshold: 2500, // TODO: owner fills (PKR)
    deliveryFee: 199, // TODO: owner fills (PKR)
    taxRate: 0, // TODO: owner confirms GST / ICT sales tax rate (e.g. 0.16). 0 = no tax line charged.
  },

  // TODO: owner edits the delivery coverage list.
  deliveryAreas: [
    'F-6',
    'F-7',
    'F-8',
    'F-10',
    'F-11',
    'G-9',
    'G-10',
    'G-11',
    'E-11',
    'I-8',
    'Blue Area',
    'DHA',
    'Bahria Town',
  ],
} as const

export type DeliveryArea = (typeof site.deliveryAreas)[number]

export const instagramUrl = `https://instagram.com/${site.socials.instagram}`
export const tiktokUrl = `https://www.tiktok.com/@${site.socials.tiktok}`
