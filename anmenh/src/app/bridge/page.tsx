import { Suspense } from 'react'
import BridgeContent from './bridge-content'

export default function BridgePage() {
  return (
    <Suspense fallback={<div className="hidden">Loading bridge...</div>}>
      <BridgeContent />
    </Suspense>
  )
}
