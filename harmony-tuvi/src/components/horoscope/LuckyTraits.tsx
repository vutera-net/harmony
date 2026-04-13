interface LuckyTraitsProps {
  color: string
  direction: string
  hour: string
  number: number
}

export function LuckyTraits({ color, direction, hour, number }: LuckyTraitsProps) {
  const traits = [
    { label: 'Màu sắc may mắn', value: color, icon: '🎨' },
    { label: 'Hướng tốt', value: direction, icon: '🧭' },
    { label: 'Giờ hoàng đạo', value: hour, icon: '⏰' },
    { label: 'Con số may mắn', value: number, icon: '🔢' },
  ]

  return (
    <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {traits.map((trait) => (
        <div key={trait.label} className="flex flex-col items-center p-2">
          <span className="text-2xl mb-1">{trait.icon}</span>
          <span className="text-xs text-gray-500 mb-1">{trait.label}</span>
          <span className="text-sm font-medium text-gray-900">{trait.value}</span>
        </div>
      ))}
    </div>
  )
}
