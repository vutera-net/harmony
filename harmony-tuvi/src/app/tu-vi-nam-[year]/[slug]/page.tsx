import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { deslugifyCanChi, VALID_CAN_CHI_SLUGS } from '@/lib/can-chi-slug'
import { ContentLock } from '@/components/funnel/ContentLock'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { EcosystemBanner } from '@/components/funnel/EcosystemBanner'
import { SidebarCTA } from '@/components/funnel/SidebarCTA'
import { ExitIntentModal } from '@/components/funnel/ExitIntentModal'
import { PersonalDoubtTrigger } from '@/components/funnel/PersonalDoubtTrigger'
import { generateMetaTitle, generateMetaDescription } from '@/lib/seo/meta-helpers'
import { generateHoroscopeSchema } from '@/lib/seo/structured-data'

interface Props {
  params: Promise<{ year: string; slug: string }>
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tuvi.vutera.net'

export async function generateStaticParams() {
  const years = ['2024', '2025', '2026']
  const params: { year: string; slug: string }[] = []
  
  years.forEach(year => {
    VALID_CAN_CHI_SLUGS.forEach(slug => {
      params.push({ year, slug })
    })
  })
  
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, slug } = await params
  const canChi = deslugifyCanChi(slug)
  if (!canChi) return {}

  const title = generateMetaTitle(`Tử Vi Nam ${year} Tuổi ${canChi.full}`)
  const description = generateMetaDescription(`Xem bói tử vi năm ${year} cho người tuổi ${canChi.full}. Luận giải chi tiết sự nghiệp, tài lộc, tình duyên và sức khỏe trong cả năm.`)

  return {
    title,
    description,
    alternates: {
      canonical: `/tu-vi-nam-${year}/${slug}`,
    },
  }
}

export default async function AnnualHoroscopePage({ params }: Props) {
  const { year, slug } = await params
  const canChi = deslugifyCanChi(slug)

  if (!canChi || !['2024', '2025', '2026'].includes(year)) {
    notFound()
  }

  const schema = generateHoroscopeSchema(
    `Tử Vi Năm ${year} Tuổi ${canChi.full}`,
    `Dự báo chi tiết tử vi cho người tuổi ${canChi.full} trong năm ${year}.`,
    new Date().toISOString(),
    canChi.full,
    BASE_URL,
    `/tu-vi-nam-${year}/${slug}`
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Breadcrumbs 
        items={[
          { label: 'Tử vi trọn đời', href: '/tu-vi-tuoi' },
          { label: `Tử vi năm ${year}`, href: `/tu-vi-nam-${year}` },
          { label: `Tuổi ${canChi.full}`, href: `/tu-vi-nam-${year}/${slug}` }
        ]} 
      />

      <div className="mt-10 flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-12">
          <header className="">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Luận Giải Tử Vi Năm {year} <br/>
              <span className="text-purple-600 font-serif italic">Tuổi {canChi.full}</span>
            </h1>
            <p className="mt-4 text-gray-500 text-xl max-w-2xl">
              Khám phá vận trình chi tiết về công danh, tiền bạc và bình an trong năm mới.
            </p>
          </header>

          <EcosystemBanner />

          {/* Placeholder for Annual Content - Will be replaced by ContentEngine later */}
          <div className="prose prose-purple prose-lg max-w-none text-gray-600">
            <p>
              Năm {year} hứa hẹn là một năm đầy biến động đối với tuổi {canChi.full}. 
              Dưới sự tác động của các chòm sao chiếu mệnh, bạn sẽ cần chuẩn bị tinh thần để đón nhận cả những cơ hội rực rỡ và những thử thách đòi hỏi sự kiên trì.
            </p>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                💼 <span className="border-b-2 border-purple-200">Sự nghiệp & Công danh</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Vận trình sự nghiệp của tuổi {canChi.full} trong năm {year} có chiều hướng ổn định. 
                Giai đoạn giữa năm là lúc bạn nên tập trung đầu tư cho các kỹ năng mới.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                💰 <span className="border-b-2 border-yellow-200">Tài chính & Tiền bạc</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Tài lộc năm nay hanh thông, đặc biệt là các nguồn thu từ công việc tay trái. 
                Tuy nhiên cần đề phòng việc tiêu xài hoang phí vào cuối năm.
              </p>
            </div>
          </section>

          <PersonalDoubtTrigger context="tuvi" variant="prominent" />

          <ContentLock 
            context="annual_horoscope"
            buttonText="Xem tử vi chi tiết cả năm"
            items={[
              `Bảng sao chiếu mệnh và vận hạn tuổi ${canChi.full} năm ${year}`,
              'Luận giải chi tiết 12 tháng trong năm',
              'Cách hóa giải vận hạn và chiêu tài lộc',
              'Các tuổi hợp xông nhà & làm ăn trong năm mới'
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
