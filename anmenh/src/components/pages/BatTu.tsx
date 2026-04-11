"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateBatTu, BatTuResult } from "@/lib/battu-logic";
import RadarChart from "../RadarChart";
import { Sparkles, Calendar, Clock, RefreshCw } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function BatTu() {
  const { profile } = useUser();
  const [dateStr, setDateStr] = useState("1995-05-15");
  const [timeStr, setTimeStr] = useState("08:30");
  const [result, setResult] = useState<BatTuResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (profile?.birthYear) {
      setDateStr(`${profile.birthYear}-01-01`);
    }
  }, [profile]);

  const handleCalculate = () => {
    if (!dateStr || !timeStr) return;
    setIsCalculating(true);
    const [y, m, d] = dateStr.split("-").map(Number);
    const [hr, min] = timeStr.split(":").map(Number);
    const dateObj = new Date(y, m - 1, d, hr, min);
    setResult(calculateBatTu(dateObj));
    setIsCalculating(false);
  };

  const hanhColors: Record<string, string> = {
    Kim: "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700",
    Mộc: "bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-green-300 border-green-300 dark:border-green-800",
    Thủy: "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-800",
    Hỏa: "bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-300 border-red-300 dark:border-red-800",
    Thổ: "bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800",
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20"
        >
          <Sparkles className="text-amber-500" size={32} />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-stone-900 dark:text-white">Bát Tự Tứ Trụ</h1>
        <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto px-4 text-sm md:text-base">
          Phân tích lá số Tử Bình qua 4 trụ (Năm, Tháng, Ngày, Giờ) để tìm ra sự mất cân bằng trong Ngũ Hành, từ đó có phương pháp cải vận phù hợp.
        </p>
      </div>

      <div className="bg-white/90 dark:bg-stone-800/80 backdrop-blur-md p-6 md:p-8 rounded-[2rem] border-2 border-stone-100 dark:border-stone-700 shadow-xl shadow-stone-900/5 mb-10 mx-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="battu-date" className="block text-sm font-bold text-stone-500 dark:text-stone-400 mb-2 flex items-center gap-2">
              <Calendar size={16} /> Ngày sinh (Dương lịch)
            </label>
            <input
              id="battu-date"
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-stone-900 dark:text-white focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="battu-time" className="block text-sm font-bold text-stone-500 dark:text-stone-400 mb-2 flex items-center gap-2">
              <Clock size={16} /> Giờ sinh
            </label>
            <input
              id="battu-time"
              type="time"
              value={timeStr}
              onChange={(e) => setTimeStr(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-stone-900 dark:text-white focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="w-full btn-zen py-4 text-sm font-bold tracking-widest flex items-center justify-center gap-2"
        >
          {isCalculating ? (
            <RefreshCw className="animate-spin" size={18} />
          ) : (
            <Sparkles size={18} />
          )}
          {isCalculating ? "ĐANG LẬP LÁ SỐ..." : "AN LÁ SỐ BÁT TỰ"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {result && !isCalculating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8 px-4"
          >
            {/* Tứ Trụ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "TRỤ GIỜ", data: result.hour },
                { label: "TRỤ NGÀY", data: result.day },
                { label: "TRỤ THÁNG", data: result.month },
                { label: "TRỤ NĂM", data: result.year },
              ].map((tru, idx) => (
                <motion.div
                  key={tru.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-2xl border border-stone-100 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 shadow-sm text-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-50 dark:to-stone-950/20 pointer-events-none" />
                  <div className="text-[10px] font-black tracking-widest text-stone-400 dark:text-stone-500 mb-4 uppercase">{tru.label}</div>
                  
                  <div className="space-y-4 relative z-10">
                    <div>
                      <div className="text-3xl font-serif font-bold text-amber-600 dark:text-amber-500 mb-2">{tru.data.can}</div>
                      <div className={`text-[10px] uppercase font-black px-3 py-1 rounded-full inline-block border ${hanhColors[tru.data.canHanh]}`}>
                        {tru.data.canHanh}
                      </div>
                    </div>
                    
                    <div className="w-12 h-px bg-stone-200 dark:bg-stone-700 mx-auto" />
                    
                    <div>
                      <div className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-200 mb-2">{tru.data.chi}</div>
                      <div className={`text-[10px] uppercase font-black px-3 py-1 rounded-full inline-block border ${hanhColors[tru.data.chiHanh]}`}>
                        {tru.data.chiHanh}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Radar & Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl border border-stone-100 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                <h3 className="text-lg font-serif font-bold mb-6 text-amber-600 dark:text-amber-500">Bản Đồ Ngũ Hành</h3>
                <RadarChart data={result.nguHanhCount} />
              </div>
              
              <div className="space-y-6">
                <div className="p-8 rounded-2xl border border-stone-100 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 shadow-sm h-full">
                  <h3 className="text-lg font-serif font-bold mb-8 text-amber-600 dark:text-amber-500 border-b border-stone-100 dark:border-stone-700 pb-4">Phân Tích Vượng Khuyết</h3>
                  
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xs font-black text-stone-400 dark:text-stone-500 mb-4 uppercase tracking-widest">Ngũ Hành Thiếu (Khuyết)</h4>
                      {result.khuyet.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {result.khuyet.map(h => (
                            <span key={`k-${h}`} className={`px-4 py-1.5 rounded-lg text-sm font-bold border ${hanhColors[h]}`}>
                              {h}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-stone-500 dark:text-stone-400 text-sm italic">Bát tự tương đối đầy đủ các hành.</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-black text-stone-400 dark:text-stone-500 mb-4 uppercase tracking-widest">Ngũ Hành Thừa (Vượng)</h4>
                      {result.vuong.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {result.vuong.map(h => (
                            <span key={`v-${h}`} className={`px-4 py-1.5 rounded-lg text-sm font-bold border ${hanhColors[h]}`}>
                              {h}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-stone-500 dark:text-stone-400 text-sm italic">Các khí khá cân bằng.</p>
                      )}
                    </div>

                    <div className="p-5 bg-amber-50/50 dark:bg-stone-900/50 rounded-2xl border border-amber-100 dark:border-stone-800 shadow-inner">
                      <h4 className="text-sm font-bold text-amber-700 dark:text-amber-500 mb-3 flex items-center gap-2">
                        <Sparkles size={16} /> Lời khuyên cải vận (Dụng Thần)
                      </h4>
                      <p className="text-sm text-stone-700 dark:text-stone-400 leading-relaxed font-medium">
                        {result.khuyet.length > 0 
                          ? `Bản mệnh đang khuyết ${result.khuyet.join(", ")}. Trong cuộc sống hàng ngày nên bổ sung các yếu tố thuộc hành này qua màu sắc trang phục, hướng làm việc hoặc nghề nghiệp để cân bằng năng lượng.`
                          : `Lá số khá cân bằng. Tuy nhiên, hành ${result.vuong.join(", ")} đang hơi vượng, nên hạn chế các màu sắc/hoạt động thuộc hành này để tránh năng lượng bị thái quá.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
