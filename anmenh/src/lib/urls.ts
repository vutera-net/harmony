/**
 * Harmony Ecosystem – Centralized URL Config
 * (Same logic as tuvi/src/lib/urls.ts — kept in sync)
 */

export const APP_URLS = {
  auth: process.env.NEXT_PUBLIC_AUTH_URL ?? 'https://auth.vutera.net',
  tuvi: process.env.NEXT_PUBLIC_TUVI_URL ?? 'https://tuvi.vutera.net',
  anmenh: process.env.NEXT_PUBLIC_ANMENH_URL ?? 'https://anmenh.vutera.net',
  portal: process.env.NEXT_PUBLIC_PORTAL_URL ?? 'https://harmony.vutera.net',
} as const

export function buildLoginUrl(redirectUrl?: string): string {
  const base = `${APP_URLS.auth}/login`
  if (!redirectUrl) return base
  return `${base}?redirect=${encodeURIComponent(redirectUrl)}`
}

export function buildTuViUrl(path: string = '/', params?: Record<string, string>): string {
  const url = new URL(path, APP_URLS.tuvi)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }
  return url.toString()
}
