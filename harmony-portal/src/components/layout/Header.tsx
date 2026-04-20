'use client'

import { SharedHeader, NavLink } from '../shared/SharedHeader'

const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Trang chủ' },
  { href: 'https://tuvi.vutera.net', label: 'Tử Vi' },
  { href: 'https://anmenh.vutera.net', label: 'An Mệnh' },
]

export function Header() {
  return (
    <SharedHeader
      appName="Harmony Portal"
      appTagline="Cổng kết nối hệ sinh thái phong thủy"
      navLinks={NAV_LINKS}
      primaryColor="#7C3AED" // violet-600
    />
  )
}
