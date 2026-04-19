'use client'

import { SharedHeader, NavLink } from '@shared/components/layout'

const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Trang chủ' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/calendar', label: 'Xem ngày' },
  { href: '/tu-vi', label: 'Tử Vi' },
  { href: '/bat-trach', label: 'Hướng nhà' },
]

export function Header() {
  return (
    <SharedHeader
      appName="An Mệnh"
      appTagline="Gìn giữ nét đẹp văn hóa tâm linh Việt"
      navLinks={NAV_LINKS}
      logo={
        <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-serif font-bold text-xl">
          A
        </div>
      }
      primaryColor="#D97706" // amber-600
      cta={{
        label: 'Tải App',
        href: '#',
        className: 'bg-amber-600 hover:bg-amber-700'
      }}
    />
  )
}
