import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Zap, ShieldCheck } from 'lucide-react';
import { APP_URLS } from '@/lib/urls';

export default function EcosystemSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight mb-4">Hệ Sinh Thái Harmony</h2>
        <p className="text-stone-400 max-w-2xl mx-auto">Một hành trình đi từ sự tò mò đến sự thấu hiểu sâu sắc về bản thân.</p>
      </div>
      
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* TuVi App */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
        >
          <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-stone-950 transition-colors">
            <Zap size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-3">TuVi App</h3>
          <p className="text-stone-400 mb-6 leading-relaxed">
            <span className="text-stone-200 font-medium">Traffic Engine:</span> Cổng mở miễn phí, tối ưu tra cứu nhanh. Nơi bạn bắt đầu khám phá những chỉ dẫn cơ bản về vận mệnh và phong thủy.
          </p>
          <ul className="space-y-3 text-sm text-stone-500 mb-8">
            <li className="flex items-center gap-2">• Lịch vạn niên & Giờ hoàng đạo</li>
            <li className="flex items-center gap-2">• Lá số tử vi cơ bản</li>
            <li className="flex items-center gap-2">• Xem ngày tốt xấu</li>
          </ul>
          <a href={APP_URLS.tuvi} className="flex items-center gap-2 text-sm font-bold group-hover:text-white transition-colors">
            TRẢI NGHIỆM MIỄN PHÍ <ExternalLink size={14} />
          </a>
        </motion.div>
        
        {/* AnMenh App */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="group p-8 rounded-3xl bg-amber-900/10 border border-amber-500/20 hover:border-amber-500/40 transition-all"
        >
          <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <ShieldCheck size={24} className="text-amber-500 group-hover:text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-amber-500">AnMenh App</h3>
          <p className="text-stone-400 mb-6 leading-relaxed">
            <span className="text-amber-200 font-medium">Core Sanctuary:</span> Không gian siêu cá nhân hóa. Dành cho những ai muốn đi sâu vào cốt lõi vận mệnh với những phân tích độc bản.
          </p>
          <ul className="space-y-3 text-sm text-stone-500 mb-8">
            <li className="flex items-center gap-2">• Phân tích Bát Tự & Radar Ngũ Hành</li>
            <li className="flex items-center gap-2">• Cân Xương Đoán Số chuyên sâu</li>
            <li className="flex items-center gap-2">• Daily Luck Dashboard riêng biệt</li>
          </ul>
          <a href={APP_URLS.anmenh} className="flex items-center gap-2 text-sm font-bold text-amber-500 group-hover:text-amber-400 transition-colors">
            KHÁM PHÁ SANCTUARY <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
