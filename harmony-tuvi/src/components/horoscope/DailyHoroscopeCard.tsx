'use client'

import { DailyHoroscopeContent } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ScoreGrid } from './ScoreGrid'
import { LuckyTraits } from './LuckyTraits'

interface DailyHoroscopeCardProps {
  content: DailyHoroscopeContent
}

export function DailyHoroscopeCard({ content }: DailyHoroscopeCardProps) {
  return (
    <Card className="overflow-hidden border-none bg-white/50 backdrop-blur-md shadow-xl">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold capitalize">Tử Vi Tuổi {content.zodiac}</h2>
          <Badge variant="outline" className="text-white border-white/30 bg-white/10">
            {content.date}
          </Badge>
        </div>
        <ScoreGrid scores={content.scores} />
      </div>

      <div className="p-6 space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tổng quan</h3>
          <p className="text-gray-600 leading-relaxed">{content.tongQuan}</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tình cảm</h3>
            <p className="text-gray-600 leading-relaxed">{content.tinhCam}</p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sự nghiệp</h3>
            <p className="text-gray-600 leading-relaxed">{content.suNghiep}</p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tài chính</h3>
            <p className="text-gray-600 leading-relaxed">{content.taiChinh}</p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sức khỏe</h3>
            <p className="text-gray-600 leading-relaxed">{content.sucKhoe}</p>
          </section>
        </div>

        <LuckyTraits 
          color={content.luckyColor}
          direction={content.luckyDirection}
          hour={content.luckyHour}
          number={content.luckyNumber}
        />
      </div>
    </Card>
  )
}
