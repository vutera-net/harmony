import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-600/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <div className="text-xl font-bold tracking-widest uppercase">Harmony</div>
        <div className="space-x-6 text-sm text-gray-400">
          <Link href="#philosophy" className="hover:text-white transition-colors">Triết Lý</Link>
          <a href="https://anmenh.vutera.net" className="hover:text-white transition-colors">An Mệnh</a>
          <a href="https://tuvi.vutera.net" className="hover:text-white transition-colors">Tử Vi</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center pb-20 pt-32">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-yellow-900/10 rounded-full blur-[100px] pointer-events-none" />

        <h1 className="text-5xl md:text-7xl font-light tracking-tight max-w-4xl mb-6 leading-tight">
          Nơi triết lý phương Đông <br/>
          <span className="font-serif italic text-yellow-500/90">gặp gỡ AI hiện đại.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-light">
          Khám phá bản đồ vận mệnh của bạn thông qua sự kết hợp của Bát tự, Ngũ hành và trí tuệ nhân tạo.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <a href="https://anmenh.vutera.net" className="px-8 py-4 bg-white text-black font-medium rounded-full hover:scale-105 transition-transform duration-300">
            Mở Khóa Vận Mệnh
          </a>
          <a href="https://tuvi.vutera.net" className="px-8 py-4 border border-zinc-800 text-white font-medium rounded-full hover:bg-zinc-900 transition-colors">
            Đọc Thông Điệp Ngày Mới
          </a>
        </div>
      </main>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-32 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-8">Không phải ma thuật. Là dữ liệu và triết học.</h2>
          <p className="text-gray-400 leading-relaxed text-lg mb-16">
            Chúng tôi không tin vào những lời phán truyền sáo rỗng. Harmony sử dụng thuật toán AI để giải mã các học thuyết Tử Vi và Bát Tự cổ đại, mang đến góc nhìn hiện đại, trực diện và có tính ứng dụng cao cho cuộc sống của bạn.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-8 border border-zinc-800 rounded-2xl bg-zinc-900/30">
              <h3 className="text-xl font-bold mb-3 text-yellow-500/80">Hyper-Personalized</h3>
              <p className="text-sm text-gray-500">Bản đồ sao chính xác từng phút. Không có hai người nào nhận cùng một thông điệp.</p>
            </div>
            <div className="p-8 border border-zinc-800 rounded-2xl bg-zinc-900/30">
              <h3 className="text-xl font-bold mb-3 text-yellow-500/80">Straight-Talk</h3>
              <p className="text-sm text-gray-500">Không dùng từ ngữ sáo rỗng. Nhận thông điệp trực diện về Tình yêu, Công việc và Cuộc sống.</p>
            </div>
            <div className="p-8 border border-zinc-800 rounded-2xl bg-zinc-900/30">
              <h3 className="text-xl font-bold mb-3 text-yellow-500/80">Social Compatibility</h3>
              <p className="text-sm text-gray-500">So sánh mức độ tương hợp ngũ hành với bạn bè và người thương.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-zinc-600 text-sm border-t border-zinc-900">
        <p>© 2026 VUTERA Harmony. All rights reserved.</p>
      </footer>
    </div>
  );
}
