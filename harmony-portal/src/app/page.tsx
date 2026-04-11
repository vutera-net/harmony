"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Compass, Sparkles, Smartphone, ArrowRight, ExternalLink } from "lucide-react";
import WaitlistModal from "@/components/common/WaitlistModal";

export default function PortalPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <main className="min-h-screen bg-stone-950 text-white overflow-hidden selection:bg-primary selection:text-white">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <nav className="p-6 md:p-10 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Compass className="text-stone-950" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tighter">HARMONY</span>
        </div>
        <button 
          onClick={() => setIsWaitlistOpen(true)}
          className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <Smartphone size={16} /> MOBILE APP
        </button>
      </nav>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-160px)]">
        {/* Left Side: TuVi (Public) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 group relative p-12 md:p-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5 hover:bg-white/[0.02] transition-all duration-700"
        >
          <div className="relative z-10 space-y-6">
            <span className="inline-block px-3 py-1 bg-stone-800 rounded-full text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
              Traffic Engine / Public
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">TuVi</h1>
            <p className="text-stone-400 text-lg md:text-xl max-w-sm leading-relaxed">
              Công cụ tra cứu lịch văn niên, phong thủy và tử vi miễn phí cho mọi người.
            </p>
            <ul className="space-y-3 text-sm text-stone-500 mb-8">
              <li className="flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Đổi lịch Âm-Dương</li>
              <li className="flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Xem ngày tốt/xấu cơ bản</li>
              <li className="flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Lập lá số tử vi miễn phí</li>
            </ul>
            <a 
              href="https://tuvi.vutera.net" 
              className="inline-flex items-center gap-3 text-xl font-bold group-hover:text-primary transition-colors"
            >
              KHÁM PHÁ NGAY <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </motion.div>

        {/* Right Side: AnMenh (Premium) */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 group relative p-12 md:p-24 flex flex-col justify-center hover:bg-white/[0.02] transition-all duration-700"
        >
          <div className="relative z-10 space-y-6">
            <span className="inline-block px-3 py-1 bg-amber-900/20 text-amber-500 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">
              Core Product / Premium
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-amber-500">AnMenh</h1>
            <p className="text-stone-400 text-lg md:text-xl max-w-sm leading-relaxed">
              Nền tảng quản lý mệnh cách cá nhân sâu sắc. Bí ẩn, hiện đại và siêu cá nhân hóa.
            </p>
            <ul className="space-y-3 text-sm text-stone-500 mb-8">
              <li className="flex items-center gap-2"><Sparkles size={14} className="text-amber-500" /> Bát Tự & Radar đồ ngũ hành</li>
              <li className="flex items-center gap-2"><Sparkles size={14} className="text-amber-500" /> Cân Xương Đoán Số chuyên sâu</li>
              <li className="flex items-center gap-2"><Sparkles size={14} className="text-amber-500" /> Daily Luck Dashboard riêng biệt</li>
            </ul>
            <a 
              href="https://anmenh.vutera.net" 
              className="inline-flex items-center gap-3 text-xl font-bold text-amber-500 group-hover:brightness-125 transition-all"
            >
              TRẢI NGHIỆM ĐỈNH CAO <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>

      <footer className="p-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-stone-600 text-xs gap-6">
        <p>© 2026 Vutera Harmony Ecosystem. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Privacy</a>
          <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Terms</a>
          <a href="#" className="hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">VUTERA.NET <ExternalLink size={10} /></a>
        </div>
      </footer>

      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </main>
  );
}
