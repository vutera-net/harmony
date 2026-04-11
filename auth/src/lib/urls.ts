/**
 * Harmony Ecosystem – Centralized URL Config (auth app)
 */

export const APP_URLS = {
  auth: process.env.NEXT_PUBLIC_AUTH_URL ?? 'https://auth.vutera.net',
  tuvi: process.env.NEXT_PUBLIC_TUVI_URL ?? 'https://tuvi.vutera.net',
  anmenh: process.env.NEXT_PUBLIC_ANMENH_URL ?? 'https://anmenh.vutera.net',
  portal: process.env.NEXT_PUBLIC_PORTAL_URL ?? 'https://harmony.vutera.net',
} as const
