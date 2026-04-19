import { SharedFooter } from '@shared/components/layout'

export function SiteFooter() {
  return (
    <SharedFooter
      appName="Harmony Tử Vi"
      appDescription="Nền tảng phong thủy, tử vi và xem ngày tốt xấu toàn diện cho người Việt."
      currentAppId="tuvi"
      sections={[
        {
          title: 'Tính năng',
          links: [
            { label: 'Lịch Vạn Niên', href: '/lich' },
            { label: 'Xem Mệnh', href: '/xem-menh' },
            { label: 'Lá Số Tử Vi', href: '/tu-vi' },
            { label: 'So Sánh Lá Số', href: '/so-sanh-la-so' },
            { label: 'Xem Ngày Tốt', href: '/xem-ngay' },
            { label: 'Phong Thủy', href: '/phong-thuy' },
          ]
        },
        {
          title: 'Kiến thức',
          links: [
            { label: 'Blog Tử Vi', href: '/blog' },
            { label: 'Ngũ Hành', href: '/blog?category=ngu-hanh' },
            { label: 'Tử Vi Đẩu Số', href: '/blog?category=tu-vi' },
            { label: 'Phong Thủy', href: '/blog?category=phong-thuy' },
          ]
        },
        {
          title: 'Tra cứu Tử Vi',
          links: [
            { label: 'Sao Tử Vi tại cung Mệnh', href: '/y-nghia-sao/tu-vi-tai-cung-menh' },
            { label: 'Sao Thái Dương tại Quan Lộc', href: '/y-nghia-sao/thai-duong-tai-cung-quan-loc' },
            { label: 'Sao Thiên Phủ tại Tài Bạch', href: '/y-nghia-sao/thien-phu-tai-cung-tai-bach' },
            { label: 'Giải mã bộ sao Đào Hoa', href: '/y-nghia-sao/tham-lang-tai-cung-dao-hoa' },
          ]
        },
        {
          title: 'Hỗ trợ',
          links: [
            { label: '🔮 AnMenh — Cá nhân hóa', href: 'https://anmenh.vutera.net' },
            { label: 'Liên hệ', href: '/lien-he' },
            { label: 'Chính sách', href: '/chinh-sach' },
          ]
        }
      ]}
    />
  )
}
