'use client'

import { trackCTAClick } from '@/lib/analytics'
import { getCanChiYear } from '@/data/can-chi'
import { getTriggerText } from '@/lib/funnel-constants'

const ANMENH_URL = 'https://anmenh.vutera.net'

type TriggerVariant = 'subtle' | 'prominent'

interface PersonalDoubtTriggerProps {
  variant?: TriggerVariant
  context?: string
  className?: string
}

import { useSessionMemory } from '@/hooks/useSessionMemory'

export function PersonalDoubtTrigger({
  variant = 'subtle',
  context = 'default',
  className = '',
}: PersonalDoubtTriggerProps) {
  const { memory } = useSessionMemory()
  const canChi = memory?.birthYear ? getCanChiYear(memory.birthYear).full : null
  const yearText = canChi ? `Với tuổi \${canChi} (\${memory?.birthYear}), ` : ''
  
  const text = `\${yearText}\${getTriggerText(context)}`
  
  const hrefParams = new URLSearchParams()
  hrefParams.set('source', 'tuvi_doubt')
  hrefParams.set('intent', context)
  if (memory?.birthYear) hrefParams.set('birthYear', memory.birthYear.toString())
  if (memory?.gender) hrefParams.set('gender', memory.gender)

  const href = `\${ANMENH_URL}/bridge?\${hrefParams.toString()}`

  if (variant === 'prominent') {
    return (
      <div className={`flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 \${className}`}>
        <span className="mt-0.5 shrink-0 text-lg">⚠️</span>
        <div>
          <p className="text-sm font-semibold text-amber-900">Lưu ý về độ chính xác</p>
          <p className="mt-1 text-sm text-amber-800">{text}</p>
          <a
            href={href}
            onClick={() => trackCTAClick('doubt_trigger_prominent', context)}
            className="mt-2 inline-block text-xs font-semibold text-amber-700 underline hover:text-amber-900"
          >
            Xem kết quả chính xác hơn tại AnMenh →
          </a>
        </div>
      </div>
    )
  }

  // subtle (default) — inline text callout
  return (
    <p className={`text-xs text-gray-400 italic \${className}`}>
      * {text}{' '}
      <a 
        href={href} 
        onClick={() => trackCTAClick('doubt_trigger_subtle', context)}
        className="font-medium text-purple-500 not-italic hover:text-purple-700"
      >
        Xem tại AnMenh →
      </a>
    </p>
  )
}
