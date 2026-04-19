"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ShieldCheck, Cpu, Database, Zap } from "lucide-react";

interface BridgeTransitionProps {
  show: boolean;
  onComplete?: () => void;
  targetApp?: "TuVi" | "AnMenh" | "Auth" | "Harmony";
}

export default function BridgeTransition({ show, onComplete, targetApp = "AnMenh" }: BridgeTransitionProps) {
  const [step, setStep] = useState(0);

  const messages = [
    "Truy xuất bản đồ sao cá nhân...",
    "Tính toán Can Chi & Ngũ Hành...",
    "Phân tích tương tác vận hạn...",
    \`Đang thiết lập không gian \${targetApp}...\`,
    "Đồng bộ hoàn tất. Mời bạn bước vào.",
  ];

  const icons = [
    <Database className="text-blue-400" size={18} />,
    <Cpu className="text-amber-400" size={18} />,
    <Zap className="text-yellow-400" size={18} />,
    <Sparkles className="text-primary" size={18} />,
    <ShieldCheck className="text-green-500" size={18} />,
  ];

  useEffect(() => {
    if (show) {
      const interval = setInterval(() => {
        setStep((s) => (s < messages.length - 1 ? s + 1 : s));
      }, 700);

      const timeout = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setStep(0);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-stone-950 text-white overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <motion.div 
              initial={{ top: "-10%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-10"
            />
            <div className="absolute inset-0 opacity-20">
               {[...Array(20)].map((_, i) => (
                 <motion.div
                   key={i}
                   initial={{ 
                     x: Math.random() * 100 + "vw", 
                     y: Math.random() * 100 + "vh", 
                     opacity: 0 
                   }}
                   animate={{ 
                     y: [null, Math.random() * 100 + "vh"], 
                     opacity: [0, 1, 0] 
                   }}
                   transition={{ 
                     duration: Math.random() * 3 + 2, 
                     repeat: Infinity, 
                     delay: Math.random() * 5 
                   }}
                   className="absolute w-1 h-1 bg-white rounded-full"
                 />
               ))}
            </div>
          </div>

          <div className="relative text-center space-y-10 px-6 z-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-auto w-28 h-28 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-2xl relative"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full"
              />
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="text-amber-400" size={56} />
              </motion.div>
            </motion.div>

            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center gap-4 min-h-[80px]">
                <motion.div 
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  {icons[step]}
                  <p className="text-2xl font-light tracking-wide italic">
                    {messages[step]}
                  </p>
                </motion.div>
                <div className="flex gap-2">
                  {messages.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 w-4 rounded-full transition-all duration-500 ${
                        i <= step ? "bg-primary w-6" : "bg-white/10"
                      }`} 
                    />
                  ))}
                </div>
              </div>

              <div className="w-64 h-1.5 bg-white/5 rounded-full mx-auto overflow-hidden relative border border-white/5">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${((step + 1) / messages.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-500 via-primary to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center gap-2"
            >
              <p className="text-stone-500 text-xs uppercase tracking-[0.3em] font-medium">
                Quantum Analysis Engine
              </p>
              <p className="text-stone-600 text-[10px] uppercase tracking-widest">
                Vutera Harmony Ecosystem
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
