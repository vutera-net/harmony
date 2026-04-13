/**
 * Multi-device stable bucketing for A/B testing
 * Uses hash of userId or sessionId to assign a variant
 */

export function hashCode(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h
}

export type ABVariant = 'A' | 'B' | 'C'

export function getABVariant(id: string, experimentId: string, count: number = 2): string {
  if (!id) return 'A'
  
  const hash = Math.abs(simpleHash(`${id}:${experimentId}`))
  const index = hash % count
  
  return String.fromCharCode(65 + index) // A, B, C...
}

function simpleHash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h
}
