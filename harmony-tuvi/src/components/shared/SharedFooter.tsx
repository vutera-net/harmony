import Link from 'next/link'
import { APP_URLS } from '../../lib/shared-urls'

interface FooterSection {
  title: string
  links: { label: string; href: string }[]
}

interface SharedFooterProps {
  appName: string
  appDescription?: string
  sections: FooterSection[]
  currentAppId: 'tuvi' | 'anmenh' | 'portal'
  copyrightText?: string
}

export function SharedFooter({
  appName,
  appDescription,
  sections,
  currentAppId,
  copyrightText = `© ${new Date().getFullYear()} Harmony. Bảo lưu mọi quyền.`
}: SharedFooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Ecosystem section */}
        <div className="mb-10 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-red-50 p-6">
          <p className="mb-4 text-center text-sm font-semibold text-gray-700">
            Hệ sinh thái Harmony — Nền tảng phong thủy & tử vi toàn diện cho người Việt
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={APP_URLS.portal}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:shadow"
            >
              <span>🌐</span>
              <span>Harmony</span>
              <span className="text-xs text-gray-400">vutera.net/harmony</span>
            </a>
            <span className="hidden text-gray-300 sm:block">·</span>
            <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm transition ${
              currentAppId === 'tuvi' 
                ? 'border-red-200 bg-white text-red-600' 
                : 'border-gray-200 bg-white text-gray-700'
            }`}>
              <span>⭐</span>
              <span>TuVi</span>
              <span className="text-xs text-gray-400">tuvi.vutera.net</span>
              {currentAppId === 'tuvi' && (
                <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-xs text-red-600">Bạn đang ở đây</span>
              )}
            </div>
            <span className="hidden text-gray-300 sm:block">·</span>
            <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm transition ${
              currentAppId === 'anmenh' 
                ? 'border-purple-200 bg-white text-purple-600' 
                : 'border-gray-200 bg-white text-gray-700'
            }`}>
              <span>🔮</span>
              <span>AnMenh</span>
              <span className="text-xs text-gray-400">anmenh.vutera.net</span>
              {currentAppId === 'anmenh' && (
                <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-xs text-purple-600">Bạn đang ở đây</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">☯</span>
              <span className="font-bold text-red-600">
                {appName}
              </span>
            </div>
            {appDescription && (
              <p className="mt-2 text-sm text-gray-600">
                {appDescription}
              </p>
            )}
          </div>

          {/* Dynamic Sections */}
          {sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">{section.title}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link href={link.href} className="hover:text-red-700 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t pt-8 text-sm text-gray-500 md:flex-row">
          <p>{copyrightText}</p>
          <div className="mt-4 flex gap-4 md:mt-0">
            <span className="rounded px-2 py-0.5 text-xs bg-gray-100">Kim</span>
            <span className="rounded px-2 py-0.5 text-xs bg-gray-100">Mộc</span>
            <span className="rounded px-2 py-0.5 text-xs bg-gray-100">Thủy</span>
            <span className="rounded px-2 py-0.5 text-xs bg-gray-100">Hỏa</span>
            <span className="rounded px-2 py-0.5 text-xs bg-gray-100">Thổ</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
