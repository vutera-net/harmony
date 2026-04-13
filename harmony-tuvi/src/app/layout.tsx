import type { Metadata } from 'next'
import { Geist, Geist_Mono, Noto_Serif } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { StickyCTA } from '@/components/funnel/StickyCTA'
import { EcosystemBanner } from '@/components/funnel/EcosystemBanner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const notoSerif = Noto_Serif({
  variable: '--font-noto-serif',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700'],
  display: 'swap',
})

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tuvi.vutera.net'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'VUTERA Harmony - Phong Thủy, Tử Vi & Xem Ngày',
    template: '%s | VUTERA Harmony',
  },
  description:
    'Nền tảng phong thủy, tử vi và xem ngày tốt xấu toàn diện nhất cho người Việt. Luận mệnh Ngũ Hành, lá số Tử Vi, chọn ngày đẹp, cung hoàng đạo và phong thủy.',
  keywords: ['phong thủy', 'tử vi', 'xem ngày tốt xấu', 'lịch vạn niên', 'luận mệnh', 'ngũ hành', 'cung hoàng đạo'],
  authors: [{ name: 'VUTERA Harmony Team' }],
  alternates: {
    canonical: '/',
    languages: {
      'vi-VN': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'VUTERA Harmony',
    url: BASE_URL,
    title: 'VUTERA Harmony - Hệ sinh thái Tử Vi & Phong Thủy',
    description: 'Nền tảng tra cứu tử vi và phong thủy hiện đại dành cho người Việt.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VUTERA Harmony',
    description: 'Nền tảng tra cứu tử vi và phong thủy hiện đại dành cho người Việt.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { 
      index: true, 
      follow: true, 
      'max-image-preview': 'large', 
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable} ${notoSerif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
          <SiteHeader />
          <EcosystemBanner />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <StickyCTA />
      </body>
    </html>
  )
}
