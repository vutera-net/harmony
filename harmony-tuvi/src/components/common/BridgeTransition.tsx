"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ShieldCheck } from "lucide-react";

interface BridgeTransitionProps {
  show: boolean;
  onComplete?: () => void;
  targetApp?: "TuVi" | "AnMenh" | "Auth" | "Harmony";
}

export default function BridgeTransition({ show, onComplete, targetApp = "AnMenh" }: BridgeTransitionProps) {
  const [step, setStep] = useState(0);

  const messages = [
    "Đang kết nối dữ liệu...",
    `Đang khởi tạo module ${targetApp}...`,
    "Đang phân tích thiên bàn cá nhân...",
    "Đồng bộ hoàn tất. Chào mừng bạn!",
  ];

  useEffect(() => {
    if (show) {
      const interval = setInterval(() => {
        setStep((s) => (s < messages.length - 1 ? s + 1 : s));
      }, 600);
      
      const timeout = setTimeout(() => {
        if (onComplete) onComplete();
      }, 2500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setStep(0);
    }
  }, [show, onComplete, messages.length]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-stone-950 text-white"
        >
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          </div>

          <div className="relative text-center space-y-8 px-6">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="mx-auto w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="text-amber-400" size={48} />
              </motion.div>
            </motion.div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 h-8">
                {step < messages.length - 1 ? (
                  <Loader2 className="animate-spin text-stone-400" size={18} />
                ) : (
                  <ShieldCheck className="text-green-500" size={18} />
                )}
                <p className="text-xl font-medium tracking-wide">
                  {messages[step]}
                </p>
              </div>
              
              <div className="w-48 h-1 bg-white/5 rounded-full mx-auto overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="h-full bg-primary"
                />
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-stone-500 text-sm uppercase tracking-[0.2em]"
            >
              Vutera Harmony Ecosystem
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
