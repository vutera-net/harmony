"use client";
import React, { useState, useEffect } from "react";
import { calculateCanXuong, getYearCanChi } from "@/lib/lunar-logic";
import { Scale, Info, Sparkles, ChevronDown } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";

const HOURS = [
  "Tý (23h – 01h)", "Sửu (01h – 03h)", "Dần (03h – 05h)", "Mão (05h – 07h)",
  "Thìn (07h – 09h)", "Tỵ (09h – 11h)", "Ngọ (11h – 13h)", "Mùi (13h – 15h)",
  "Thân (15h – 17h)", "Dậu (17h – 19h)", "Tuất (19h – 21h)", "Hợi (21h – 23h)",
];

const LEVEL_STYLES = {
  excellent: {
    ring: "border-amber-400",
    bg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
    reading: "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-300",
    total: "text-amber-600",
    glow: "shadow-amber-300/50",
  },
  good: {
    ring: "border-green-400",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20",
    badge: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    reading: "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800",
    text: "text-green-700 dark:text-green-300",
    total: "text-green-600",
    glow: "shadow-green-300/50",
  },
  neutral: {
    ring: "border-blue-300",
    bg: "bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/20",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    reading: "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-300",
    total: "text-blue-600",
    glow: "shadow-blue-300/50",
  },
  challenging: {
    ring: "border-stone-300",
    bg: "bg-gradient-to-br from-stone-50 to-slate-50 dark:from-stone-800/50 dark:to-slate-900/50",
    badge: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
    reading: "bg-stone-50 border-stone-200 dark:bg-stone-800 dark:border-stone-600",
    text: "text-stone-600 dark:text-stone-300",
    total: "text-stone-600",
    glow: "shadow-stone-300/30",
  },
};

export default function CanXuong() {
  const { profile } = useUser();
  const [year, setYear] = useState<number | "">(1990);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [hourIdx, setHourIdx] = useState(0);
  const [result, setResult] = useState<ReturnType<typeof calculateCanXuong> | null>(null);

  // Auto-fill from profile
  useEffect(() => {
    if (profile?.birthYear) {
      setYear(profile.birthYear);
    }
  }, [profile]);

  const maxDays = new Date(Number(year) || 1990, month, 0).getDate();
  const safeDay = Math.min(day, maxDays);

  const handleCalculate = () => {
    if (typeof year === "number" && year >= 1900 && year <= 2030) {
      const res = calculateCanXuong(year, month, safeDay, hourIdx);
      setResult(res);
    }
  };

  const s = result ? LEVEL_STYLES[result.level] : null;

  return (
    <div className="max-w-4xl mx-auto py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-stone-900 dark:bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-stone-900/10">
          <Scale className="text-amber-400 dark:text-amber-600" size={32} />
        </div>
        <h2 className="text-4xl font-serif font-bold mb-4 dark:text-stone-50">Cân Xương Đoán Số</h2>
        <p className="text-stone-500 dark:text-stone-400">
          Dựa vào ngày giờ sinh để luận giải mức độ sang hèn, phúc lộc trong đời.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Input Form */}
        <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-md p-8 rounded-[2rem] border-2 border-stone-100 dark:border-stone-700 shadow-xl shadow-stone-900/5">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-stone-50">
            <Info size={18} className="text-amber-600" />
            Thông tin ngày sinh
          </h3>

          {profile && (
            <div className="mb-6 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                ✦ Đã điền từ hồ sơ: {profile.name} · {getYearCanChi(profile.birthYear)}
              </p>
            </div>
          )}

          <div className="space-y-5">
            {/* Year */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-2">
                Năm sinh (Âm lịch)
              </label>
              <input
                type="number"
                min={1900}
                max={2030}
                value={year === "" ? "" : year}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") setYear("");
                  else setYear(parseInt(val));
                }}
                className="w-full bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all dark:text-stone-100"
              />
              {typeof year === 'number' && year >= 1900 && year <= 2030 && (
                <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  {getYearCanChi(year)}
                </p>
              )}
            </div>

            {/* Day + Month (Vn style: Day first) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-2">
                  Ngày sinh (Âm lịch)
                </label>
                <div className="relative">
                  <select
                    value={safeDay}
                    onChange={(e) => setDay(parseInt(e.target.value))}
                    className="w-full appearance-none bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all pr-8 dark:text-stone-100"
                  >
                    {Array.from({ length: maxDays }, (_, i) => (
                      <option key={i + 1} value={i + 1}>Ngày {i + 1}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-2">
                  Tháng sinh (Âm lịch)
                </label>
                <div className="relative">
                  <select
                    value={month}
                    onChange={(e) => setMonth(parseInt(e.target.value))}
                    className="w-full appearance-none bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all pr-8 dark:text-stone-100"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Hour */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-2">
                Giờ sinh
              </label>
              <div className="relative">
                <select
                  value={hourIdx}
                  onChange={(e) => setHourIdx(parseInt(e.target.value))}
                  className="w-full appearance-none bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all pr-8 dark:text-stone-100"
                >
                  {HOURS.map((h, i) => (
                    <option key={i} value={i}>Giờ {h}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={year === "" || year < 1900 || year > 2030}
              className="w-full btn-zen py-4 text-sm font-bold tracking-widest flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              Luận Giải Vận Mệnh <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        {/* Result Panel */}
        <div className="flex flex-col justify-start min-h-[500px]">
          <AnimatePresence mode="wait">
            {result && s ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className={`rounded-[2rem] p-8 border-2 ${s.ring} ${s.bg}`}
              >
                {/* Circular badge */}
                <div className="text-center mb-6">
                  <div className={`relative inline-flex items-center justify-center w-44 h-44 rounded-full border-4 ${s.ring} bg-white dark:bg-stone-900 shadow-2xl ${s.glow}`}>
                    {/* Outer ring */}
                    <div className={`absolute inset-2 rounded-full border border-dashed ${s.ring} opacity-40`} />
                    <div className="flex flex-col items-center">
                      <span className={`text-5xl font-serif font-bold leading-none ${s.total}`}>
                        {result.total}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-2">
                        Lượng Chỉ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mệnh Cách badge */}
                <div className="text-center mb-6">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${s.badge}`}>
                    {result.title}
                  </span>
                </div>

                <h4 className="text-2xl font-serif font-bold italic text-center mb-5 dark:text-stone-100">
                  "{result.luong} Lượng {result.chi} Chỉ"
                </h4>

                {/* Short reading */}
                <p className={`text-center font-medium mb-4 ${s.text}`}>{result.reading}</p>

                {/* Long interpretation */}
                <div className={`p-6 rounded-2xl border ${s.reading}`}>
                  <p className={`${s.text} text-sm leading-relaxed italic`}>
                    {result.interpretation}
                  </p>
                </div>

                <p className="mt-6 text-center text-xs text-stone-400 dark:text-stone-500">
                  Cân Xương cổ học · Năm {getYearCanChi(Number(year) || 1990)} · Giờ {HOURS[hourIdx].split(" ")[0]}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full min-h-[400px] text-center"
              >
                <Scale size={80} className="text-stone-200 dark:text-stone-700 mb-6" />
                <p className="font-serif italic text-xl text-stone-400 dark:text-stone-500">
                  Đang chờ luận giải vận mệnh...
                </p>
                <p className="text-sm text-stone-300 dark:text-stone-600 mt-2">
                  Nhập đầy đủ thông tin và nhấn Luận Giải
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-12 p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-700">
        <h4 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4">Bảng phân loại Lượng Chỉ</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { range: "6.0+", label: "Đại Phú Quý", color: "text-amber-600 font-bold" },
            { range: "5.0–5.9", label: "Thượng Thượng", color: "text-amber-500 font-bold" },
            { range: "4.0–4.9", label: "Phúc Lộc / Tự Lực", color: "text-green-600 font-bold" },
            { range: "3.0–3.9", label: "Bình Hòa / Thử Thách", color: "text-blue-600 font-bold" },
          ].map((it) => (
            <div key={it.range} className="flex flex-col">
              <span className={`text-lg ${it.color}`}>{it.range}</span>
              <span className="text-xs text-stone-500 dark:text-stone-400">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
