import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { APP_URLS } from '@/lib/urls';

export default function JourneySection() {
  return (
    <section className="py-24 px-6 bg-stone-950 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight mb-4">Hành trình cùng Harmony</h2>
        <p className="text-stone-400">Từ những bước khám phá đầu tiên đến sự thấu hiểu trọn vẹn.</p>
      </div>
      
      <div className="max-w-3xl mx-auto relative">
        {/* Connection Line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-amber-500/50 to-white/20 hidden md:block" />
        
        <div className="space-y-12">
          {[
            {
              step: '01',
              title: 'Bắt đầu miễn phí với TuVi',
              desc: 'Tra cứu lịch vạn niên, xem ngày tốt và lập lá số tử vi cơ bản để định hướng sơ bộ.',
              icon: '✨'
            },
            {
              step: '02',
              title: 'Nhận giá trị & Kết nối',
              desc: 'Thấu hiểu các quy luật ngũ hành và nhận ra những điểm cần cải thiện trong cuộc sống.',
              icon: '🌱'
            },
            {
              step: '03',
              title: 'Nâng tầm với AnMenh Sanctuary',
              desc: 'Tiếp cận phân tích siêu chi tiết, cá nhân hóa sâu sắc để làm chủ vận mệnh.',
              icon: '💎'
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative pl-0 md:pl-20 group"
            >
              <div className="absolute left-0 top-0 w-16 h-16 -ml-8 hidden md:flex items-center justify-center z-10">
                <div className="w-12 h-12 rounded-full bg-stone-900 border-2 border-amber-500/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
              </div>
              
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-amber-500 tracking-widest uppercase">{item.step}</span>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </div>
                <p className="text-stone-400 leading-relaxed">{item.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-stone-600">
                  <CheckCircle2 size={14} className="text-amber-500" /> Hoàn toàn tự động & Chính xác
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a 
            href={APP_URLS.tuvi} 
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-stone-950 rounded-full font-bold hover:bg-stone-200 transition-all group"
          >
            Bắt đầu hành trình bình an <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
