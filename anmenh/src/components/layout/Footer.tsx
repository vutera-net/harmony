import { SharedFooter } from '../shared/SharedFooter'

export function Footer() {
  return (
    <SharedFooter
      appName="An Mệnh"
      appDescription="Ứng dụng hỗ trợ cá nhân hóa sâu hơn về phong thủy và tử vi."
      currentAppId="anmenh"
      sections={[
        {
          title: 'Về chúng tôi',
          links: [
            { label: 'Giới thiệu', href: '/about' },
            { label: 'Điều khoản', href: '/terms' },
            { label: 'Bảo mật', href: '/privacy' },
          ]
        },
        {
          title: 'Hệ sinh thái',
          links: [
            { label: 'Harmony Portal', href: 'https://harmony.vutera.net' },
            { label: 'Harmony Tử Vi', href: 'https://tuvi.vutera.net' },
          ]
        }
      ]}
    />
  )
}
