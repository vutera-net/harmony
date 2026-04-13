import { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Tử Vi Theo Năm Sinh - Tra Cứu Tuổi & Mệnh Trọn Đời',
  description: 'Tra cứu tử vi trọn đời cho tất cả các năm sinh từ 1940 đến 2010. Xem chi tiết tuổi con gì, mệnh gì, màu sắc và hướng hợp mệnh.',
}

export default function AgeHubPage() {
  const years = []
  for (let y = 2010; y >= 1940; y--) {
    years.push(y)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs 
        items={[
          { label: 'Tử vi theo tuổi', href: '/tu-vi-tuoi' }
        ]} 
      />

      <div className="mt-8 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Tra Cứu Tử Vi Theo Năm Sinh
        </h1>
        <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
          Khám phá chi tiết tử vi trọn đời, nạp âm, và các yếu tố phong thủy dành riêng cho năm sinh của bạn.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
        {years.map((year) => (
          <Link
            key={year}
            href={`/tu-vi-tuoi/${year}`}
            className="flex items-center justify-center p-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-purple-200 transition-all font-bold text-gray-800"
          >
            {year}
          </Link>
        ))}
      </div>

      <div className="mt-16 bg-gradient-to-br from-gray-900 to-black rounded-[40px] p-8 md:p-16 text-white text-center shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Bạn đang tìm kiếm sự chính xác tuyệt đối?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Năm sinh chỉ là khởi đầu. Để thực sự thấu hiểu vận mệnh, bạn cần phân tích Lá Số Tử Vi cá nhân dựa trên Ngày, Giờ, Tháng, Năm sinh.
          </p>
          <a 
            href="https://anmenh.vutera.net/bridge?source=age_hub"
            className="inline-block bg-white text-black font-bold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            Lập lá số ngay tại AnMệnh →
          </a>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          {/* Subtle star field effect can be added here with CSS */}
        </div>
      </div>
    </div>
  )
}
