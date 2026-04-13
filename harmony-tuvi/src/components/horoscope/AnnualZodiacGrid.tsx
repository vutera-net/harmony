import Link from 'next/link'
import { VALID_CAN_CHI_SLUGS, deslugifyCanChi } from '@/lib/can-chi-slug'

export function AnnualZodiacGrid({ year }: { year: string }) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Luận Giải Chi Tiết Cho Từng Năm Sinh - Năm {year}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {VALID_CAN_CHI_SLUGS.map((slug) => {
          const info = deslugifyCanChi(slug)
          return (
            <Link
              key={slug}
              href={`/tu-vi-nam-${year}/${slug}`}
              className="group flex flex-col items-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all text-center"
            >
              <span className="text-sm font-semibold text-gray-900 group-hover:text-purple-600">
                Tuổi {info?.full}
              </span>
              <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
                Tử vi năm {year}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
