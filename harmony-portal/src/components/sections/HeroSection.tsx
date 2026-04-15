import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { APP_URLS } from '@/lib/urls';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="text-center max-w-4xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-stone-400 text-xs font-medium tracking-wider uppercase"
        >
          <Sparkles size={12} className="text-amber-500" /> Hệ sinh thái tâm linh & công nghệ
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight"
        >
          Harmony <br />
          <span className="text-stone-500">Cõi Riêng Của Sự Bình An</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Hệ sinh thái Tử Vi & Phong Thủy AI tiên phong, kết hợp tri thức cổ truyền với công nghệ hiện đại vì một cuộc sống ý nghĩa hơn.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <a 
            href={APP_URLS.tuvi} 
            className="w-full sm:w-auto px-8 py-4 bg-white text-stone-950 rounded-full font-bold hover:bg-stone-200 transition-all flex items-center justify-center gap-2 group"
          >
            Khám phá miễn phí ngay <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a 
            href={APP_URLS.anmenh} 
            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            Tìm hiểu AnMenh Sanctuary
          </a>
        </motion.div>
      </div>
    </section>
  );
}
