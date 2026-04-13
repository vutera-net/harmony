import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentEngine } from '@/lib/engines/content-engine'
import { deslugifyCanChi, VALID_CAN_CHI_SLUGS } from '@/lib/can-chi-slug'
import { ZodiacSign } from '@/types'
import { DailyHoroscopeCard } from '@/components/horoscope/DailyHoroscopeCard'
import { ContentLock } from '@/components/funnel/ContentLock'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { EcosystemBanner } from '@/components/funnel/EcosystemBanner'
import { SidebarCTA } from '@/components/funnel/SidebarCTA'
import { ExitIntentModal } from '@/components/funnel/ExitIntentModal'
import { PersonalDoubtTrigger } from '@/components/funnel/PersonalDoubtTrigger'
import { generateHoroscopeSchema } from '@/lib/seo/structured-data'
import { generateMetaTitle, generateMetaDescription } from '@/lib/seo/meta-helpers'

interface Props {
  params: Promise<{ slug: string }>
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tuvi.vutera.net'

export async function generateStaticParams() {
  return VALID_CAN_CHI_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const canChi = deslugifyCanChi(slug)
  if (!canChi) return {}

  const title = generateMetaTitle(`Tử Vi Hôm Nay Tuổi ${canChi.full}`)
  const description = generateMetaDescription(`Xem bói tử vi hôm nay cho người tuổi ${canChi.full}. Dự đoán chi tiết về tình duyên, sự nghiệp, tài lộc và sức khỏe trong ngày.`)

  return {
    title,
    description,
    alternates: {
      canonical: `/tu-vi-hom-nay/${slug}`,
    },
  }
}

export default async function DailyHoroscopePage({ params }: Props) {
  const { slug } = await params
  const canChi = deslugifyCanChi(slug)

  if (!canChi) {
    notFound()
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const branches: ZodiacSign[] = ['ty', 'suu', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi']
  const zodiac = branches[canChi.chi.index]

  const content = ContentEngine.generateDailyContent(todayStr, slug, zodiac)
  
  const schema = generateHoroscopeSchema(
    `Tử Vi Hôm Nay Tuổi ${canChi.full}`,
    `Dự báo chi tiết tử vi cho người tuổi ${canChi.full} ngày hôm nay.`,
    todayStr,
    canChi.full,
    BASE_URL,
    `/tu-vi-hom-nay/${slug}`
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      <Breadcrumbs 
        items={[
          { label: 'Tử vi hằng ngày', href: '/tu-vi-hang-ngay' },
          { label: `Tuổi ${canChi.full}`, href: `/tu-vi-hom-nay/${slug}` }
        ]} 
      />

      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <header className="mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Tử Vi Hôm Nay Tuổi {canChi.full}
            </h1>
            <p className="mt-2 text-gray-500 text-lg">
              Dự báo chi tiết ngày {todayStr}
            </p>
          </header>

          <EcosystemBanner />

          <DailyHoroscopeCard content={content} />

          <PersonalDoubtTrigger context="horoscope" variant="prominent" />

          <section className="bg-purple-50 rounded-2xl p-6 border border-purple-100 italic text-purple-800">
            <p>
              <strong>Lưu ý:</strong> Những luận giải trên đây mang tính chất tham khảo cho đại đa số người tuổi {canChi.full}. 
              Để có cái nhìn chính xác nhất về vận mệnh cá hạn, bạn cần cung cấp đầy đủ thông tin Ngày, Giờ, Tháng, Năm sinh 
              để lập lá số Tử Vi chi tiết.
            </p>
          </section>

          <ContentLock 
            context="daily_horoscope"
            items={[
              `Lời khuyên chi tiết cho riêng bản mệnh tuổi ${canChi.full}`,
              'Các giờ đại cát để thực hiện việc quan trọng',
              'Vận hạn cần tránh trong 24 giờ tới',
              'Sự tương hợp với người xung quanh trong ngày'
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
