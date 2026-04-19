import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCanChiYear } from '@/data/can-chi'
import { getNapAmByYear } from '@/data/nap-am'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { SidebarCTA } from '@/components/funnel/SidebarCTA'
import { ContentLock } from '@/components/funnel/ContentLock'
import { EcosystemBanner } from '@/components/funnel/EcosystemBanner'
import { ExitIntentModal } from '@/components/funnel/ExitIntentModal'

import { SEOTemplates } from '@/lib/seo/meta-helpers'\n
interface Props {
  params: Promise<{ year: string }>
}

export async function generateStaticParams() {
  const params = []
  for (let y = 1940; y <= 2010; y++) {
    params.push({ year: y.toString() })
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params
  const canChi = getCanChiYear(parseInt(year)) as any
  const napAm = getNapAmByYear(parseInt(year)) as any
  
  return {
    title: SEOTemplates.tuViTuoi.title(parseInt(year)),
    description: SEOTemplates.tuViTuoi.description(parseInt(year)),
    keywords: SEOTemplates.tuViTuoi.keywords(parseInt(year)),
  }
}

export default async function AgeProfilePage({ params }: Props) {
  const { year } = await params
  const y = parseInt(year)
  
  if (isNaN(y) || y < 1920 || y > 2030) {
    notFound()
  }

  const canChi = getCanChiYear(y) as any
  const napAm = getNapAmByYear(y) as any

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs 
        items={[
          { label: 'Tử vi theo tuổi', href: '/tu-vi-tuoi' },
          { label: `Sinh năm ${year}`, href: `/tu-vi-tuoi/${year}` }
        ]} 
      />

      <div className="mt-8 flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-10">
          <header>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Sinh Năm {year} <br/>
              <span className="text-purple-600 font-serif italic">Tuổi {canChi.full} - Mệnh {napAm.name}</span>
            </h1>
          </header>

          <EcosystemBanner />

          <section className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">Thông tin cơ bản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Năm sinh dương lịch:</span>
                <span className="font-bold text-gray-900">{year}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Năm sinh âm lịch:</span>
                <span className="font-bold text-gray-900">{canChi.full}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Mệnh ngũ hành:</span>
                <span className="font-bold text-purple-600">{napAm.napAm}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Cầm tinh:</span>
                <span className="font-bold text-gray-900">{canChi.chi}</span>
              </div>
            </div>
          </section>

          <article className="prose prose-purple prose-lg max-w-none text-gray-600">
            <h3>Tổng quan tử vi trọn đời tuổi {canChi.full}</h3>
            <p>
              Người sinh năm {year} cầm tinh con {canChi.chi}, thuộc mệnh {napAm.napAm}. 
              Trong cuộc sống, bản mệnh thường là người {y % 2 === 0 ? 'kiên trì, quyết đoán' : 'linh hoạt, sáng tạo'}.
            </p>
            <p>
              Về hậu vận, người tuổi {canChi.full} thường có cuộc sống an nhàn, sung túc nếu biết tích đức và làm nhiều việc thiện ngay từ thời trẻ.
            </p>
          </article>

          <ContentLock 
            context="age_profile"
            buttonText="Xem tử vi trọn đời chi tiết"
            items={[
              `Vận trình sự nghiệp qua các năm lẻ 20-40-60 tuổi`,
              `Các tuổi hợp kết hôn và làm ăn với người sinh năm ${year}`,
              `Diễn biến vận hạn từng năm trong đời`,
              `Hướng nhà và màu sắc đại cát đại lợi theo cung phi`
            ]}
          />
        </div>

        <aside className="w-full lg:w-80 shrink-0">
          <SidebarCTA />
        </aside>
      </div>

      <ExitIntentModal />
    </div>
  )
}
