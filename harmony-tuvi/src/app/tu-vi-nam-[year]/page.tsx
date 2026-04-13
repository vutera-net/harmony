import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { AnnualZodiacGrid } from '@/components/horoscope/AnnualZodiacGrid'

interface Props {
  params: Promise<{ year: string }>
}

export async function generateStaticParams() {
  return [{ year: '2024' }, { year: '2025' }, { year: '2026' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params
  return {
    title: `Tử Vi Năm ${year} - Luận Giải Chi Tiết Cho 60 Năm Can Chi`,
    description: `Khám phá vận trình tử vi năm ${year} cho tất cả các tuổi. Xem chi tiết sự nghiệp, tài lộc, tình duyên cho người tuổi Tý, Sửu, Dần, Mão...`,
  }
}

export default async function AnnualHubPage({ params }: Props) {
  const { year } = await params

  if (!['2024', '2025', '2026'].includes(year)) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs 
        items={[
          { label: 'Tử vi trọn đời', href: '/tu-vi-tuoi' },
          { label: `Tử vi năm ${year}`, href: `/tu-vi-nam-${year}` }
        ]} 
      />

      <div className="mt-8 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Tử Vi Năm {year} - 60 Tuổi Can Chi
        </h1>
        <p className="mt-4 text-gray-500 text-lg max-w-3xl mx-auto">
          Chọn năm sinh của bạn để xem vận hạn, sao chiếu mệnh và lời khuyên chi tiết cho cả năm {year}.
        </p>
      </div>

      <AnnualZodiacGrid year={year} />

      <div className="mt-16 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-[40px] p-8 md:p-16 text-white text-center shadow-2xl overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Bạn muốn xem lá số cá nhân chi tiết?</h2>
          <p className="text-purple-200 mb-8 max-w-xl mx-auto">
            Hệ thống VUTERA Harmony cung cấp bản luận giải tinh vi hơn dựa trên chính xác Ngày, Giờ, Tháng, Năm sinh của bạn.
          </p>
          <a 
            href="https://anmenh.vutera.net/bridge?source=annual_hub"
            className="inline-block bg-white text-purple-900 font-bold px-8 py-4 rounded-2xl hover:bg-purple-50 transition-colors shadow-lg"
          >
            Lập lá số Tử Vi ngay →
          </a>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}
