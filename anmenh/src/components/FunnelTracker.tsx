'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function FunnelTracker() {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const source = searchParams.get('source')
    const intent = searchParams.get('intent')
    
    if (source === 'tuvi_lock' && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'funnel_anmenh_reached', {
        source,
        intent,
        page_path: window.location.pathname
      })
    }
  }, [searchParams])

  return null
}
