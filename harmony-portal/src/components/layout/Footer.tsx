import { SharedFooter } from '../shared/SharedFooter'

export function Footer() {
  return (
    <SharedFooter
      appName="Harmony Portal"
      appDescription="Trung tâm điều phối và kết nối các dịch vụ trong hệ sinh thái Harmony."
      currentAppId="portal"
      sections={[
        {
          title: 'Hệ sinh thái',
          links: [
            { label: 'Harmony Tử Vi', href: 'https://tuvi.vutera.net' },
            { label: 'An Mệnh', href: 'https://anmenh.vutera.net' },
          ]
        },
        {
          title: 'Hỗ trợ',
          links: [
            { label: 'Liên hệ', href: '#' },
            { label: 'Điều khoản', href: '#' },
          ]
        }
      ]}
    />
  )
}
