'use client'

import { useState, useEffect } from 'react'

const HARMONY_URL = 'https://vutera.net'
const STORAGE_KEY = 'tuvi_ecosystem_banner_dismissed'

export function EcosystemBanner({ className = '' }: { className?: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  function dismiss() {
    setVisible(false)
    sessionStorage.setItem(STORAGE_KEY, '1')
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-blue-100 bg-blue-50/50 p-4 shadow-sm backdrop-blur-sm ${className}`}>
      <button 
        onClick={dismiss}
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
      >
        ✕
      </button>
      
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl text-white shadow-lg">
          V
        </div>
        <div>
          <h3 className="font-bold text-blue-900 leading-tight">VUTERA Harmony</h3>
          <p className="mt-0.5 text-[11px] text-blue-700 leading-normal max-w-[280px]">
            Hệ sinh thái phong thủy tự động tiên phong. Khám phá toàn bộ giải pháp tại <a href={HARMONY_URL} target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-blue-900">vutera.net</a>
          </p>
        </div>
      </div>
    </div>
  )
}
