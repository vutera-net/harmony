'use client'

import { SharedHeader, NavLink } from '@shared/components/layout'

const NAV_LINKS: NavLink[] = [
  { href: '/lich', label: 'Lịch Vạn Niên' },
  { href: '/xem-menh', label: 'Xem Mệnh' },
  { href: '/tu-vi', label: 'Tử Vi' },
  { href: '/xem-ngay', label: 'Xem Ngày' },
  { href: '/phong-thuy', label: 'Phong Thủy' },
  { href: '/tu-vi-hang-ngay', label: 'TV Hàng Ngày' },
  { href: '/blog', label: 'Blog' },
]

export function SiteHeader() {
  return (
    <SharedHeader
      appName="Harmony Tử Vi"
      appTagline="Luận mệnh - Chọn ngày - An tâm"
      navLinks={NAV_LINKS}
      cta={{
        label: 'AnMenh →',
        href: 'https://anmenh.vutera.net'
      }}
    />
  )
}
