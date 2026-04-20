import type { Metadata } from 'next'
import PhongThuyClientPage from './PhongThuyClientPage'

export const metadata: Metadata = {
  title: 'Phong Thủy Nhà Ở - Bát Trạch & Cửu Cung',
  description:
    'Tính Cung Mệnh Bát Trạch, xem hướng nhà tốt xấu, Cửu Cung Phi Tinh hàng năm. Bố trí phòng ngủ, bếp, phòng làm việc theo phong thủy.',
}

export default function PhongThuyPage() {
  return <PhongThuyClientPage />
}
