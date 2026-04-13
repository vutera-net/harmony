import { VALID_CAN_CHI_SLUGS } from './can-chi-slug'

export enum ContentType {
  DAILY = 'daily',
  ANNUAL = 'annual',
  AGE = 'age',
  ZODIAC = 'zodiac',
  STAR = 'star',
  PHONGTHUY = 'phongthuy',
  CALENDAR = 'calendar',
  BLOG = 'blog',
}

export interface PageUrlParams {
  slug?: string
  year?: number
  month?: number
  day?: number
  canChi?: string
  sign?: string
  star?: string
  palace?: string
  element?: string
}

/**
 * Centrailzed URL builder for all SEO-driven pages
 */
export function buildPageUrl(type: ContentType, params: PageUrlParams): string {
  switch (type) {
    case ContentType.DAILY:
      return `/tu-vi-hom-nay/${params.slug}`
    case ContentType.ANNUAL:
      return `/tu-vi-nam-${params.year}/${params.slug}`
    case ContentType.AGE:
      return `/tu-vi-tuoi/${params.year}`
    case ContentType.ZODIAC:
      return `/cung-hoang-dao/${params.sign}`
    case ContentType.STAR:
      return `/y-nghia-sao/${params.star}-tai-cung-${params.palace}`
    case ContentType.PHONGTHUY:
      if (params.element) return `/phong-thuy/menh-${params.element.toLowerCase()}`
      if (params.slug) return `/phong-thuy/huong-hop-${params.slug}`
      return '/phong-thuy'
    case ContentType.CALENDAR:
      if (params.year && params.month && params.day) {
        return `/lich/${params.year}/${params.month}/${params.day}`
      }
      if (params.year && params.month) {
        return `/lich/${params.year}/${params.month}`
      }
      return '/lich'
    case ContentType.BLOG:
      return `/blog/${params.slug}`
    default:
      return '/'
  }
}

/**
 * Returns a list of all URLs that should be indexable
 * Used for sitemap generation and ISR pre-rendering
 */
export function getAllGeneratableUrls(): string[] {
  const urls: string[] = []

  // 1. Daily Horoscope (60 slugs)
  VALID_CAN_CHI_SLUGS.forEach((slug) => {
    urls.push(buildPageUrl(ContentType.DAILY, { slug }))
  })

  // 2. Annual Forecasts (60 slugs x 3 primary years: 2024, 2025, 2026)
  const annualYears = [2024, 2025, 2026]
  annualYears.forEach((year) => {
    VALID_CAN_CHI_SLUGS.forEach((slug) => {
      urls.push(buildPageUrl(ContentType.ANNUAL, { year, slug }))
    })
  })

  // 3. Birth Year / Age (1940 - 2010 covers most active users)
  for (let y = 1940; y <= 2010; y++) {
    urls.push(buildPageUrl(ContentType.AGE, { year: y }))
  }

  // 4. Zodiac Sign Hubs (12)
  const zodiacs = [
    'bach-duong', 'kim-nguu', 'song-tu', 'cu-giai', 
    'su-tu', 'xu-nu', 'thien-binh', 'bo-cap',
    'nhan-ma', 'ma-ket', 'bao-binh', 'song-ngu'
  ]
  zodiacs.forEach((sign) => {
    urls.push(buildPageUrl(ContentType.ZODIAC, { sign }))
  })

  // 5. Star-Palace Matrix (14 stars x 12 palaces)
  const mainStars = [
    'tu-vi', 'thien-phu', 'thai-duong', 'thai-am', 
    'tham-lang', 'cu-mon', 'thien-co', 'thien-luong',
    'thien-dong', 'thien-tuong', 'vu-khuc', 'liem-trinh',
    'that-sat', 'pha-quan'
  ]
  const palaces = [
    'menh', 'phu-mau', 'phuc-duc', 'dien-trach', 
    'quan-loc', 'no-boc', 'thien-di', 'tat-ach',
    'tai-bach', 'tu-tuc', 'phu-the', 'huynh-de'
  ]
  mainStars.forEach((star) => {
    palaces.forEach((palace) => {
      urls.push(buildPageUrl(ContentType.STAR, { star, palace }))
    })
  })

  return urls
}
