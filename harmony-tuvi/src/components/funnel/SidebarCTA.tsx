'use client'

import { buildAnMenhUrl } from '@/lib/urls'
import { trackCTAClick } from '@/lib/analytics'
import { useSessionMemory } from '@/hooks/useSessionMemory'
import { getCanChiYear } from '@/data/can-chi'

export function SidebarCTA({ className = '' }: { className?: string }) {
  const { memory } = useSessionMemory()
  const canChi = memory?.birthYear ? getCanChiYear(memory.birthYear).full : null

  const hrefParams = new URLSearchParams()
  hrefParams.set('source', 'tuvi_sidebar')
  if (memory?.birthYear) hrefParams.set('birthYear', memory.birthYear.toString())
  if (memory?.gender) hrefParams.set('gender', memory.gender)

  const href = buildAnMenhUrl('/bridge', Object.fromEntries(hrefParams))

  return (
    <div className={`rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sticky top-24 ${className}`}>
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-3xl text-white shadow-lg">
        ☯
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 leading-tight">
        {canChi ? `Luận giải lá số tuổi ${canChi}` : 'Lập lá số Tử Vi trọn đời'}
      </h3>
      
      <p className="mt-3 text-sm text-gray-500 leading-relaxed">
        Nhận bảng luận giải chi tiết 12 cung, sao chiếu mệnh và hạn hằng năm dành riêng cho bạn.
      </p>
      
      <ul className="mt-6 space-y-3">
        {['Lá số chi tiết 12 cung', 'Vận hạn 2024 - 2026', 'Hỗ trợ từ chuyên gia'].map((item) => (
          <li key={item} className="flex items-center gap-2 text-xs font-medium text-gray-700">
            <span className="text-purple-500 font-bold">✓</span>
            {item}
          </li>
        ))}
      </ul>
      
      <a
        href={href}
        onClick={() => trackCTAClick('sidebar_cta', 'general')}
        className="mt-8 block w-full rounded-2xl bg-gray-900 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-black"
      >
        Khám phá ngay →
      </a>
      
      <p className="mt-4 text-center text-[10px] text-gray-400">
        Phát triển bởi đội ngũ VUTERA
      </p>
    </div>
  )
}
