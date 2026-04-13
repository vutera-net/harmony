'use client'

import { useState, useEffect } from 'react'
import { buildAnMenhUrl } from '@/lib/urls'
import { trackCTAClick } from '@/lib/analytics'
import { useSessionMemory } from '@/hooks/useSessionMemory'

const STORAGE_KEY = 'tuvi_exit_intent_dismissed'

export function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { memory } = useSessionMemory()

  useEffect(() => {
    // Check if shown/dismissed in this session
    if (sessionStorage.getItem(STORAGE_KEY)) return

    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsOpen(true)
        window.removeEventListener('mouseout', handleMouseOut)
      }
    }

    const timer = setTimeout(() => {
      window.addEventListener('mouseout', handleMouseOut)
    }, 5000) // Show only after 5 seconds

    return () => {
      window.removeEventListener('mouseout', handleMouseOut)
      clearTimeout(timer)
    }
  }, [])

  function close() {
    setIsOpen(false)
    sessionStorage.setItem(STORAGE_KEY, '1')
  }

  if (!isOpen) return null

  const hrefParams = new URLSearchParams()
  hrefParams.set('source', 'tuvi_exit')
  if (memory?.birthYear) hrefParams.set('birthYear', memory.birthYear.toString())

  const href = buildAnMenhUrl('/bridge', Object.fromEntries(hrefParams))

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[40px] bg-white p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={close}
          className="absolute right-6 top-6 h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
        >
          ✕
        </button>
        
        <div className="text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[30px] bg-gradient-to-br from-purple-500 to-rose-500 text-4xl shadow-xl">
            🎁
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Đừng bỏ lỡ vận trình cá nhân!
          </h2>
          
          <p className="mt-4 text-gray-500 text-base leading-relaxed">
            Chúng tôi đã chuẩn bị sẵn bảng luận giải lá số Tử Vi trọn đời dành riêng cho tuổi của bạn. Hoàn toàn miễn phí.
          </p>
          
          <div className="mt-10 space-y-4">
            <a
              href={href}
              onClick={() => trackCTAClick('exit_intent', 'gift')}
              className="block w-full rounded-2xl bg-gray-900 px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-black hover:scale-[1.02] active:scale-95"
            >
              Nhận ngay vận trình của tôi
            </a>
            <button 
              onClick={close}
              className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              Để sau, tôi muốn đọc nốt
            </button>
          </div>
        </div>
        
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-purple-50 blur-3xl" />
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-rose-50 blur-3xl" />
      </div>
    </div>
  )
}
