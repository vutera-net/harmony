import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tuvi.vutera.net'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/static/',
          '/dang-nhap',
          '/dang-ky',
          '/tai-khoan',
          '/profile',
          '/bridge'
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
