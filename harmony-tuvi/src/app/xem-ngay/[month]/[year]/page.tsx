import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMonthDays } from '@/lib/engines/lunar-engine'
import { generateBreadcrumbSchema } from '@/lib/seo/structured-data'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { AnMenhCTA } from '@/components/funnel/AnMenhCTA'
import { PersonalDoubtTrigger } from '@/components/funnel/PersonalDoubtTrigger'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tuvi.vutera.net'

const MONTHS_VI = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
]

export function generateStaticParams() {
  const currentYear = new Date().getFullYear()
  const params = []
  for (let y = currentYear; y <= currentYear + 1; y++) {
    for (let m = 1; m <= 12; m++) {
      params.push({ month: String(m), year: String(y) })
    }
  }
  return params
}

interface Props {
  params: Promise<{ month: string; year: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { month, year } = await params
  const m = parseInt(month)
  const y = parseInt(year)

  if (isNaN(m) || isNaN(y) || m < 1 || m > 12) return {}

  const monthName = MONTHS_VI[m - 1]
  return {
    title: `Ngày Tốt ${monthName} ${y} - Xem Ngày Hoàng Đạo, Hắc Đạo`,
    description: `Tổng hợp các ngày tốt trong ${monthName} năm ${y}. Xem chi tiết ngày Hoàng đạo, Hắc đạo, trực và sao để chọn ngày khởi sự, cưới hỏi, khai trương thuận lợi.`,
    keywords: [`ngày tốt ${monthName} ${y}`, `xem ngày ${monthName} ${y}`, `ngày hoàng đạo ${monthName} ${y}`],
    alternates: {
      canonical: `/xem-ngay/${month}/${year}`,
    },
  }
}

export default async function XemNgayMonthPage({ params }: Props) {
  const { month, year } = await params
  const m = parseInt(month)
  const y = parseInt(year)

  if (isNaN(m) || isNaN(y) || m < 1 || m > 12) notFound()

  const days = getMonthDays(y, m)
  const goodDays = days.filter(d => d.rating === 'tot')

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', item: BASE_URL },
    { name: 'Xem Ngày', item: `${BASE_URL}/xem-ngay` },
    { name: `${MONTHS_VI[m - 1]} ${y}`, item: `${BASE_URL}/xem-ngay/${month}/${year}` },
  ])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="border-b border-red-100 bg-white py-12">
        <div className="mx-auto max-w-4xl px-4">
          <Breadcrumb items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Xem Ngày', href: '/xem-ngay' },
            { label: `${MONTHS_VI[m - 1]} ${y}` },
          ]} />
          
          <div className="mt-6">
            <h1 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl">
              Ngày Tốt {MONTHS_VI[m - 1]} {y}
            </h1>
            <p className="mt-2 text-gray-600">
              Tổng hợp các ngày Hoàng Đạo và ngày tốt nhất trong tháng để khởi sự, cưới hỏi, làm nhà.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
        <section>
          <h2 className="mb-6 font-serif text-2xl font-bold text-gray-900">
            📅 Các ngày tốt nhất trong tháng
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {goodDays.length > 0 ? (
              goodDays.map((day, idx) => (
                <Card key={idx} className="flex gap-4 p-4 border-l-4 border-l-green-500">
                  <div className="flex flex-col items-center justify-center rounded-lg bg-green-50 px-3 py-2 text-center min-w-[60px]">
                    <span className="text-xs font-bold text-green-600 uppercase">Solar</span>
                    <span className="text-xl font-bold text-green-700">{day.solar.day}</span>
                    <span className="text-xs text-green-600">{day.solar.month}/{day.solar.year}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900">
                        Ngày {day.lunar.day} tháng {day.lunar.month} {day.lunar.year}
                      </span>
                      <Badge className="bg-green-100 text-green-700 border-green-200">Đại Cát</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>✨ <strong>Trực:</strong> {day.truc} | <strong>Sao:</strong> {day.sao28}</p>
                      <p>🌙 <strong>Âm lịch:</strong> {day.lunar.canDay === undefined ? 'N/A' : 'Can Chi ngày'}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-gray-500 italic">Tháng này không có ngày đại cát đặc biệt.</p>
            )}
          </div>
        </section>

        <PersonalDoubtTrigger variant="prominent" context="ngaytot" />

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-lg font-bold text-gray-900">Điều hướng thời gian</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">Tháng trước</span>
              <Link 
                href={m === 1 ? `/xem-ngay/12/${y - 1}` : `/xem-ngay/${m - 1}/${y}`}
                className="rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-red-50"
                style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
              >
                ← {MONTHS_VI[m === 1 ? 11 : m - 2]} {m === 1 ? y - 1 : y}
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">Tháng sau</span>
              <Link 
                href={m === 12 ? `/xem-ngay/1/${y + 1}` : `/xem-ngay/${m + 1}/${y}`}
                className="rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-red-50"
                style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
              >
                {MONTHS_VI[m === 12 ? 0 : m]} {m === 12 ? y + 1 : y} →
              </Link>
            </div>
          </div>
        </section>

        <AnMenhCTA variant="banner" context="ngaytot" />
      </div>
    </div>
  )
}
