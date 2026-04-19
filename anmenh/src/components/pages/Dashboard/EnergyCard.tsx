"use client";
import React from "react";
import { motion } from "framer-motion";

interface EnergyCardProps {
  score: number;
  status: string;
}

export default function EnergyCard({ score, status }: EnergyCardProps) {
  // Determine color based on score
  const getColor = () => {
    if (score > 80) return "text-green-400";
    if (score > 60) return "text-blue-400";
    if (score > 40) return "text-amber-400";
    if (score > 20) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-3xl text-center flex flex-col items-center justify-center"
    >
      <h3 className="text-zinc-400 text-sm uppercase tracking-widest mb-4">Năng Lượng Hôm Nay</h3>
      <div className="relative flex items-center justify-center mb-4">
        <svg className="w-32 h-32">
          <circle
            cx="64" cy="64" r="58"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-zinc-800"
          />
          <motion.circle
            cx="64" cy="64" r="58"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 58}
            initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - score / 100) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={getColor()}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        </svg>
        <span className={`absolute text-4xl font-bold ${getColor()}`}>
          {score}%
        </span>
      </div>
      <p className="text-2xl font-medium text-white">{status}</p>
    </motion.div>
  );
}
