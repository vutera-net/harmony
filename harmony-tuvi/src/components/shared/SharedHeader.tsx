'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { LogIn, Menu, X } from 'lucide-react'
import { APP_URLS, buildLoginUrl } from '../../lib/shared-urls'

export interface NavLink {
  href: string
  label: string
}

interface SharedHeaderProps {
  appName: string
  appTagline?: string
  navLinks: NavLink[]
  logo?: React.ReactNode
  primaryColor?: string // CSS variable or hex
  showEcosystemBar?: boolean
  cta?: {
    label: string
    href: string
    className?: string
  }
}

export function SharedHeader({
  appName,
  appTagline,
  navLinks,
  logo = <span>☯</span>,
  primaryColor = 'var(--color-primary, #C41E3A)',
  showEcosystemBar = true,
  cta
}: SharedHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginUrl, setLoginUrl] = useState(buildLoginUrl())

  useEffect(() => {
    setLoginUrl(buildLoginUrl(window.location.href))
  }, [])

  const anmenhUrl = APP_URLS.anmenh

  return (
    <header className="sticky top-0 z-50 border-b border-card-border bg-card-bg shadow-sm">
      {/* Ecosystem top-bar */}
      {showEcosystemBar && (
         <div className="border-b border-amber-100 bg-amber-50 py-1.5 text-center text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">

          {appName.includes('Tử Vi') ? (
            <>
              TuVi là một phần của hệ{' '}
              <a href={APP_URLS.portal} className="font-semibold underline hover:text-amber-900">
                Harmony
              </a>
              {' '}—{' '}
              <a href={anmenhUrl} className="font-semibold underline hover:text-amber-900">
                Trải nghiệm sâu hơn tại AnMenh →
              </a>
            </>
          ) : appName.includes('An Mệnh') ? (
            <>
              AnMệnh là một phần của hệ{' '}
              <a href={APP_URLS.portal} className="font-semibold underline hover:text-amber-900">
                Harmony
              </a>
              {' '}—{' '}
              <a href={APP_URLS.tuvi} className="font-semibold underline hover:text-amber-900">
                Tra cứu nhanh tại TuVi →
              </a>
            </>
          ) : (
            <>
              Chào mừng bạn đến với hệ sinh thái{' '}
              <a href={APP_URLS.portal} className="font-semibold underline hover:text-amber-900">
                Harmony
              </a>
            </>
          )}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl">{logo}</div>
            <div>
              <div className="text-lg font-bold" style={{ color: primaryColor }}>
                {appName}
              </div>
              {appTagline && (
                <div className="text-xs text-gray-500">{appTagline}</div>
              )}
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-red-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-2 md:flex">
            <a
              href={loginUrl}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-red-300 hover:text-red-700 transition-colors"
            >
              <LogIn size={15} />
              Đăng nhập
            </a>
            {cta && (
              <a
                href={cta.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 ${cta.className || ''}`}
                style={!cta.className ? { background: 'linear-gradient(135deg, #7C3AED, #C41E3A)' } : {}}
              >
                {cta.label}
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
         <div className="border-t border-card-border bg-card-bg md:hidden">

          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 space-y-2 border-t pt-3">
              <a
                href={loginUrl}
                className="flex items-center justify-center gap-2 w-full rounded-full py-2.5 text-center text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <LogIn size={16} /> Đăng nhập / Đăng ký
              </a>
              {cta && (
                <a
                  href={cta.href}
                  className="block w-full rounded-full py-2.5 text-center text-sm font-semibold text-white"
                  style={!cta.className ? { background: 'linear-gradient(135deg, #7C3AED, #C41E3A)' } : {}}
                >
                  {cta.label}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
