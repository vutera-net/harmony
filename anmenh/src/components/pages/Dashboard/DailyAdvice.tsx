"use client";
import React from "react";
import { motion } from "framer-motion";

interface DailyAdviceProps {
  advice: string;
}

export default function DailyAdvice({ advice }: DailyAdviceProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass p-6 rounded-3xl border-l-4 border-amber-500"
    >
      <h3 className="text-zinc-400 text-sm uppercase tracking-widest mb-3">Lời Khuyên Cho Bạn</h3>
      <p className="text-zinc-200 leading-relaxed italic">
        "{advice}"
      </p>
    </motion.div>
  );
}
