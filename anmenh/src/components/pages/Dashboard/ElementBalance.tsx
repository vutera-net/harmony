"use client";
import React from "react";
import { motion } from "framer-motion";
import RadarChart, { RadarData } from "../../RadarChart";

interface ElementBalanceProps {
  data: RadarData;
}

export default function ElementBalance({ data }: ElementBalanceProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass p-6 rounded-3xl flex flex-col items-center"
    >
      <h3 className="text-zinc-400 text-sm uppercase tracking-widest mb-6 self-start">Cân Bằng Ngũ Hành</h3>
      <RadarChart data={data} />
      <div className="mt-6 grid grid-cols-2 gap-4 w-full text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
          <span className="text-zinc-300">Kim: {data.Kim}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-zinc-300">Mộc: {data.Mộc}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
          <span className="text-zinc-300">Thủy: {data.Thủy}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-zinc-300">Hỏa: {data.Hỏa}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-600"></div>
          <span className="text-zinc-300">Thổ: {data.Thổ}</span>
        </div>
      </div>
    </motion.div>
  );
}
