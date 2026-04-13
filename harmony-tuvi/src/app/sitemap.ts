import type { MetadataRoute } from 'next'
import { getAllPostsMeta } from '@/lib/blog'
import { ContentType, buildPageUrl } from '@/lib/url-taxonomy'
import { VALID_CAN_CHI_SLUGS } from '@/lib/can-chi-slug'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tuvi.vutera.net'

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date()

  // 1. Static & Core Pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: today, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/lich`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/phong-thuy`, lastModified: today, changeFrequency: 'weekly', priority: 0.7 },
  ]

  // 2. Daily Horoscope Pages (60 slugs)
  const dailyPages: MetadataRoute.Sitemap = VALID_CAN_CHI_SLUGS.map((slug) => ({
    url: `${BASE_URL}${buildPageUrl(ContentType.DAILY, { slug })}`,
    lastModified: today,
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  // 3. Annual Forecasts (60 slugs x 3 primary years: 2024, 2025, 2026)
  const annualYears = [2024, 2025, 2026]
  const annualForecastPages: MetadataRoute.Sitemap = annualYears.flatMap((year) =>
    VALID_CAN_CHI_SLUGS.map((slug) => ({
      url: `${BASE_URL}${buildPageUrl(ContentType.ANNUAL, { year, slug })}`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    }))
  )

  // 4. Age Pages (1940-2010)
  const agePages: MetadataRoute.Sitemap = []
  for (let y = 1940; y <= 2010; y++) {
    agePages.push({
      url: `${BASE_URL}${buildPageUrl(ContentType.AGE, { year: y })}`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.7,
    })
  }

  // 5. Zodiac Hubs (12)
  const zodiacs = [
    'bach-duong', 'kim-nguu', 'song-tu', 'cu-giai', 
    'su-tu', 'xu-nu', 'thien-binh', 'bo-cap',
    'nhan-ma', 'ma-ket', 'bao-binh', 'song-ngu'
  ]
  const zodiacPagesX: MetadataRoute.Sitemap = zodiacs.map((sign) => ({
    url: `${BASE_URL}${buildPageUrl(ContentType.ZODIAC, { sign })}`,
    lastModified: today,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // 6. Star-Palace Matrix (14x12)
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
  const starPalacePages: MetadataRoute.Sitemap = mainStars.flatMap((star) =>
    palaces.map((palace) => ({
      url: `${BASE_URL}${buildPageUrl(ContentType.STAR, { star, palace })}`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.5,
    }))
  )

  // 7. Blog Posts
  const blogPosts: MetadataRoute.Sitemap = getAllPostsMeta().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...dailyPages,
    ...annualForecastPages,
    ...agePages,
    ...zodiacPagesX,
    ...starPalacePages,
    ...blogPosts,
  ]
}

