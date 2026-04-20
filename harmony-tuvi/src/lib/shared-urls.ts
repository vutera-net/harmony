/**
 * Harmony Ecosystem – Centralized URL Config
 * 
 * All app URLs are sourced from environment variables so they can be
 * overridden per environment (local dev, staging, production).
 */

export const APP_URLS = {
  /** Centralized SSO gateway */
  auth: process.env.NEXT_PUBLIC_AUTH_URL ?? 'https://auth.vutera.net',
  /** TuVi traffic engine */
  tuvi: process.env.NEXT_PUBLIC_TUVI_URL ?? 'https://tuvi.vutera.net',
  /** AnMenh premium core */
  anmenh: process.env.NEXT_PUBLIC_ANMENH_URL ?? 'https://anmenh.vutera.net',
  /** Harmony ecosystem portal */
  portal: process.env.NEXT_PUBLIC_PORTAL_URL ?? 'https://harmony.vutera.net',
} as const

/** Build a login URL that redirects back to the given URL after login */
export function buildLoginUrl(redirectUrl?: string): string {
  const base = `${APP_URLS.auth}/login`
  if (!redirectUrl) return base
  return `${base}?redirect=${encodeURIComponent(redirectUrl)}`
}

/** Build an AnMenh bridge URL with optional source params */
export function buildAnMenhUrl(
  path: string = '/bridge',
  params?: Record<string, string>
): string {
  const url = new URL(path, APP_URLS.anmenh)
  
  // Default UTMs for attribution
  url.searchParams.set('utm_source', 'tuvi_harmony')
  url.searchParams.set('utm_medium', 'referral')
  url.searchParams.set('utm_campaign', 'top_funnel_seo')
  
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      url.searchParams.set(k, v)
    })
  }
  return url.toString()
}

/** Build a TuVi URL with optional source params */
export function buildTuViUrl(
  path: string = '/', 
  params?: Record<string, string>
): string {
  const url = new URL(path, APP_URLS.tuvi)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }
  return url.toString()
}
