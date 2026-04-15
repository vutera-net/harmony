/**
 * Harmony Ecosystem – Centralized URL Config
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
