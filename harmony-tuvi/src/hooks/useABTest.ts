"use client";
import { useState, useEffect } from 'react'

export function useABTest<T extends string>(testId: string, variants: T[]) {
  const [variant, setVariant] = useState<T | null>(null)

  useEffect(() => {
    const storageKey = `ab_test_${testId}`
    const storedVariant = localStorage.getItem(storageKey)

    if (storedVariant && variants.includes(storedVariant as T)) {
      setVariant(storedVariant as T)
    } else {
      // Randomly assign a variant
      const randomVariant = variants[Math.floor(Math.random() * variants.length)]
      localStorage.setItem(storageKey, randomVariant)
      setVariant(randomVariant)
    }
  }, [testId])

  return variant
}
