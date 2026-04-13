import { HoroscopeScores } from '@/types'

interface ScoreGridProps {
  scores: HoroscopeScores
}

export function ScoreGrid({ scores }: ScoreGridProps) {
  const categories = [
    { label: 'Tổng quan', value: scores.tongQuan, color: 'bg-yellow-400' },
    { label: 'Tình cảm', value: scores.tinhCam, color: 'bg-pink-400' },
    { label: 'Sự nghiệp', value: scores.suNghiep, color: 'bg-blue-400' },
    { label: 'Tài chính', value: scores.taiChinh, color: 'bg-green-400' },
    { label: 'Sức khỏe', value: scores.sucKhoe, color: 'bg-red-400' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {categories.map((cat) => (
        <div key={cat.label} className="text-center">
          <div className="text-xs uppercase tracking-wider text-white/70 mb-1">{cat.label}</div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-white/20">
                  {cat.value}/10
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded bg-white/20">
              <div 
                style={{ width: `${cat.value * 10}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${cat.color}`}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
