import type { Metadata } from 'next'
import TuViClientPage from './TuViClientPage'

export const metadata: Metadata = {
  title: 'Lập Lá Số Tử Vi Đẩu Số',
  description:
    'Lập lá số Tử Vi Đẩu Số đầy đủ với 14 chính tinh, 12 cung và Đại Vận. Giải nghĩa chi tiết từng cung, từng sao.',
}

export default function TuViPage() {
  return <TuViClientPage />
}
