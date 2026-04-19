'use client'

import { useEffect } from 'react'
import { useSessionMemory } from '@/hooks/useSessionMemory'
import { useABTest } from '@/hooks/useABTest'

const ANMENH_URL = 'https://anmenh.vutera.net'

type CTAContext = 'tuvi' | 'phongthuy' | 'ngaytot' | 'horoscope' | 'xemmenh' | 'default'
type CTAVariant = 'banner' | 'inline' | 'card'

interface AnMenhCTAProps {
  variant?: CTAVariant
  context?: CTAContext
  className?: string
}

interface CTAContent {
  headline: string
  sub: string
  button: string
}

const CONTEXT_CONTENT_A: Record<CTAContext, CTAContent> = {
  tuvi: {
    headline: 'Lá số này dựa trên ngày sinh — chưa tính giờ sinh của bạn',
    sub: 'Thêm giờ sinh để xem chính xác Cục, Mệnh chủ và Đại Vận riêng của bạn tại AnMenh.',
    button: 'Xem lá số cá nhân hóa →',
  },
  phongthuy: {
    headline: 'Bố trí nội thất cụ thể theo từng phòng, từng hướng của bạn',
    sub: 'Cửu Cung Phi Tinh + gợi ý bố trí chi tiết dựa trên mệnh và căn nhà thực tế của bạn.',
    button: 'Xem phong thủy cá nhân →',
  },
  ngaytot: {
    headline: 'Lọc ngày tốt theo tuổi và sự kiện cụ thể của bạn',
    sub: 'Tránh Tam Nương, Sát Chủ theo tuổi cụ thể — kết quả chính xác hơn tại AnMenh.',
    button: 'Lọc ngày theo tuổi của bạn →',
  },
  horoscope: {
    headline: 'Xem đầy đủ 5 lĩnh vực + điểm số cá nhân của bạn',
    sub: 'Dự báo tình cảm, sự nghiệp, tài chính, sức khỏe theo mệnh và chu kỳ riêng của bạn.',
    button: 'Xem tử vi cá nhân hôm nay →',
  },
  xemmenh: {
    headline: 'Phân tích sâu hơn về mệnh và vận của bạn',
    sub: 'Tương sinh tương khắc với người thân, hướng nhà, màu sắc nội thất chi tiết hơn tại AnMenh.',
    button: 'Phân tích mệnh cá nhân →',
  },
  default: {
    headline: 'Bạn muốn kết quả chính xác hơn với riêng bạn?',
    sub: 'Tạo hồ sơ tại AnMenh để xem phân tích cá nhân hóa theo ngày, giờ và mệnh của bạn.',
    button: 'Tạo hồ sơ miễn phí →',
  },
}

const CONTEXT_CONTENT_B: Record<CTAContext, CTAContent> = {
  tuvi: {
    headline: 'Bạn đang xem kết quả chung. Hãy thêm giờ sinh để thấy vận mệnh thực sự của riêng bạn.',
    sub: 'Kết quả chính xác hơn 90% khi có giờ sinh chính xác. Khám phá ngay tại AnMenh.',
    button: 'Xem vận mệnh thực sự →',
  },
  phongthuy: {
    headline: 'Đừng để hướng nhà sai làm giảm tài lộc. Xem bố trí chuẩn theo mệnh của bạn.',
    sub: 'Tối ưu hóa dòng khí và năng lượng cho từng phòng theo tuổi của bạn.',
    button: 'Tối ưu phong thủy ngay →',
  },
  ngaytot: {
    headline: 'Ngày tốt với người này có thể là ngày xấu với bạn. Lọc chuẩn theo tuổi tại AnMenh.',
    sub: 'Tránh rủi ro không đáng có bằng cách chọn ngày giờ chính xác tuyệt đối.',
    button: 'Chọn ngày chuẩn theo tuổi →',
  },
  horoscope: {
    headline: 'Dự báo chi tiết cho RIÊNG bạn: Tình cảm, Sự nghiệp, Tài chính hôm nay.',
    sub: 'Điểm số may mắn và lời khuyên cụ thể cho ngày hôm nay của bạn.',
    button: 'Xem dự báo cá nhân →',
  },
  xemmenh: {
    headline: 'Khám phá bí mật về Mệnh của bạn: Tương sinh, Tương khắc và Cách hóa giải.',
    sub: 'Hiểu rõ vận mệnh để làm chủ cuộc đời. Phân tích sâu tại AnMenh.',
    button: 'Khám phá bí mật Mệnh →',
  },
  default: {
    headline: 'Nhận phân tích vận mệnh cá nhân hóa 100% chính xác theo giờ sinh.',
    sub: 'Đừng hài lòng với những dự báo chung chung. Hãy tạo hồ sơ AnMenh ngay.',
    button: 'Nhận phân tích miễn phí →',
  },
}

function trackCTAClick(variant: CTAVariant, context: CTAContext, contentVariant: 'A' | 'B') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'tuvi_cta_click', {
      cta_variant: variant,
      context,
      content_variant: contentVariant,
      destination: 'anmenh',
    })
  }
}

export function AnMenhCTA({ variant = 'banner', context = 'default', className = '' }: AnMenhCTAProps) {
  const contentVariant = useABTest<'A' | 'B'>('anmenh_cta_content', ['A', 'B']) || 'A'
  const content = contentVariant === 'A' ? CONTEXT_CONTENT_A[context] : CONTEXT_CONTENT_B[context]
  
  const { memory } = useSessionMemory()
  
  const hrefParams = new URLSearchParams()
  hrefParams.set('source', 'tuvi')
  hrefParams.set('intent', context)
  if (memory?.birthYear) hrefParams.set('birthYear', memory.birthYear.toString())
  if (memory?.gender) hrefParams.set('gender', memory.gender)

  const href = \`${ANMENH_URL}/bridge?\${hrefParams.toString()}\`

  if (variant === 'inline') {
    return (
      <div className={\`my-4 rounded-xl border border-purple-100 bg-purple-50 p-4 \${className}\`}>
        <p className='text-sm font-semibold text-purple-900'>{content.headline}</p>
        <p className='mt-1 text-xs text-purple-700'>{content.sub}</p>
        <a
          href={href}
          onClick={() => trackCTAClick('inline', context, contentVariant)}
          className='mt-3 inline-block rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-md'
          style={{ background: 'linear-gradient(135deg, #7C3AED, #C41E3A)' }}
        >
          {content.button}
        </a>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div
        className={\`rounded-2xl p-6 text-white \${className}\`}
        style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #C41E3A 100%)' }}
      >
        <div className='mb-1 text-xs font-medium uppercase tracking-wide opacity-75'>
          AnMenh — Cá nhân hóa sâu hơn
        </div>
        <h3 className='text-lg font-bold'>{content.headline}</h3>
        <p className='mt-2 text-sm opacity-80'>{content.sub}</p>
        <ul className='mt-4 space-y-1.5 text-sm opacity-90'>
          <li>✓ Phân tích theo giờ sinh</li>
          <li>✓ Chu kỳ Đại Vận cá nhân</li>
          <li>✓ Cảnh báo và gợi ý riêng</li>
        </ul>
        <a
          href={href}
          onClick={() => trackCTAClick('card', context, contentVariant)}
          className='mt-5 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-yellow-50'
          style={{ color: '#7C3AED' }}
        >
          {content.button}
        </a>
      </div>
    )
  }

  // banner (default)
  return (
    <div
      className={\`rounded-2xl p-6 text-white \${className}\`}
      style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #C41E3A 100%)' }}
    >
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <p className='text-xs font-medium uppercase tracking-wide opacity-75'>
            AnMenh — Cá nhân hóa sâu hơn
          </p>
          <p className='mt-0.5 text-base font-bold sm:text-lg'>{content.headline}</p>
          <p className='mt-1 text-sm opacity-75'>{content.sub}</p>
        </div>
        <a
          href={href}
          onClick={() => trackCTAClick('banner', context, contentVariant)}
          className='shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-yellow-50'
          style={{ color: '#7C3AED' }}
        >
          {content.button}
        </a>
      </div>
    </div>
  )
}

// Typed window for GA4
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}
