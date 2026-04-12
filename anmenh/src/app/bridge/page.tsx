'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import BridgeTransition from '@/components/common/BridgeTransition'

export default function BridgePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showTransition, setShowTransition] = useState(true)

  const source = searchParams.get('source') || 'unknown'
  const intent = searchParams.get('intent') || 'default'
  const birthYear = searchParams.get('birthYear')
  const gender = searchParams.get('gender')

  // Determine target route based on intent
  const getTargetRoute = () => {
    switch (intent) {
      case 'tu-vi':
        return '/tu-vi'
      case 'bat-tu':
        return '/bat-tu'
      case 'bat-trach':
        return '/bat-trach'
      case 'can-xuong':
        return '/can-xuong'
      case 'tuong-hop':
        return '/tuong-hop'
      default:
        return '/'
    }
  }

  const handleBridgeComplete = () => {
    const targetRoute = getTargetRoute()

    // Build redirect URL with preserved params if needed
    const redirectUrl = new URL(targetRoute, window.location.origin)
    if (birthYear) redirectUrl.searchParams.set('birthYear', birthYear)
    if (gender) redirectUrl.searchParams.set('gender', gender)

    router.push(redirectUrl.toString())
  }

  return (
    <>
      <BridgeTransition
        show={showTransition}
        onComplete={handleBridgeComplete}
        targetApp="AnMenh"
      />
      {/* Hidden page content - just in case */}
      <div className="hidden">Bridge route from {source}</div>
    </>
  )
}
