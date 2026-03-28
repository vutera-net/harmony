import type { Metadata } from "next";
import { Noto_Serif, Inter } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Tạp chí Tử Vi & Bát Tự - Harmony",
  description: "Trang thông tin kiến thức chuyên môn về Tử vi, Bát tự và huyền học phương Đông.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${notoSerif.variable} ${inter.variable} h-full antialiased`}>
      {/* Light Theme: Trắng sữa cho học thuật */}
      <body className="min-h-full flex flex-col bg-[#fafafa] text-[#111111] font-sans">
        
        {/* Simple Header */}
        <header className="border-b bg-white">
          <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-serif font-bold text-tuviPrimary">
              Harmony <span className="font-light text-zinc-500">Tử Vi</span>
            </h1>
            <a href="https://anmenh.vutera.net" className="text-sm border border-tuviPrimary text-tuviPrimary px-4 py-2 rounded-full hover:bg-tuviPrimary hover:text-white transition-colors">
              Mở Khóa Vận Mệnh Bản Thân
            </a>
          </div>
        </header>

        {children}

      </body>
    </html>
  );
}
