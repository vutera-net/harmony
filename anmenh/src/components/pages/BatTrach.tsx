"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Compass, Info, Sparkles, MapPin, CheckCircle, XCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { calculateBatTrach, getYearCanChi, type BatTrachResult } from "@/lib/lunar-logic";

const DIRECTION_LABELS: Record<string, string> = {
  "Bắc": "N", "Nam": "S", "Đông": "E", "Tây": "W",
  "Đông Bắc": "NE", "Đông Nam": "SE", "Tây Bắc": "NW", "Tây Nam": "SW",
};

const HOVER_DEG: Record<string, number> = {
  "N": 0, "NE": 45, "E": 90, "SE": 135,
  "S": 180, "SW": 225, "W": 270, "NW": 315,
};

// Angular position for each compass label (clockwise from top)
const COMPASS_POINTS = [
  { label: "N", deg: 0 },
  { label: "NE", deg: 45 },
  { label: "E", deg: 90 },
  { label: "SE", deg: 135 },
  { label: "S", deg: 180 },
  { label: "SW", deg: 225 },
  { label: "W", deg: 270 },
  { label: "NW", deg: 315 },
];

export default function BatTrach() {
  const { profile } = useUser();
  const [year, setYear] = useState<number | "">(1990);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [result, setResult] = useState<BatTrachResult | null>(null);
  const [hoveredDir, setHoveredDir] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      if (profile.birthYear) setYear(profile.birthYear);
      setGender(profile.gender || "male");
    }
  }, [profile]);

  const handleCalculate = useCallback(() => {
    if (typeof year === "number" && year >= 1900 && year <= 2030) {
      const res = calculateBatTrach(year, gender);
      setResult(res);
    }
  }, [year, gender]);

  const isGoodDirection = (label: string) => {
    if (!result) return false;
    const viName = Object.keys(DIRECTION_LABELS).find(k => DIRECTION_LABELS[k] === label);
    if (!viName) return false;
    return (
      result.sinhKhi === viName ||
      result.thienY === viName ||
      result.dienNien === viName ||
      result.phucVi === viName
    );
  };

  const isBadDirection = (label: string) => {
    if (!result) return false;
    const viName = Object.keys(DIRECTION_LABELS).find(k => DIRECTION_LABELS[k] === label);
    if (!viName) return false;
    return (
      result.tuyetMenh === viName ||
      result.nguQuy === viName ||
      result.lucSat === viName ||
      result.hoaHai === viName
    );
  };

  const compassRotation = result ? result.compassDeg : 0;

  return (
    <div className="max-w-4xl mx-auto py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-stone-900 dark:bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-stone-900/10">
          <Compass className="text-amber-400 dark:text-amber-600" size={32} />
        </div>
        <h2 className="text-4xl font-serif font-bold mb-4 dark:text-stone-50">La Bàn Bát Trạch</h2>
        <p className="text-stone-500 dark:text-stone-400">
          Xác định cung phi, mệnh quái và tìm hướng nhà, hướng bếp đại cát cho gia chủ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Input */}
        <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-md p-8 rounded-[2rem] border-2 border-stone-100 dark:border-stone-700 shadow-xl shadow-stone-900/5">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-stone-50">
            <Info size={18} className="text-amber-600" />
            Thông tin chủ sự
          </h3>

          {profile && (
            <div className="mb-5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                ✦ Đã điền từ hồ sơ: {profile.name} · {getYearCanChi(profile.birthYear)}
              </p>
            </div>
          )}

          <div className="space-y-5">
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

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-2">Giới tính</label>
              <div className="flex gap-3">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                      gender === g
                        ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100"
                        : "bg-stone-50 dark:bg-stone-700 border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300"
                    }`}
                  >
                    {g === "male" ? "Nam" : "Nữ"}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={year === "" || year < 1900 || year > 2030}
              className="w-full btn-zen py-4 text-sm font-bold tracking-widest flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              Tra Cứu Hướng <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        {/* Compass + Result */}
        <div className="flex flex-col items-center justify-start">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                {/* Interactive Compass */}
                <div className="relative w-64 h-64 mx-auto mb-8">
                  {/* Background ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 shadow-2xl shadow-stone-900/10" />
                  <div className="absolute inset-4 rounded-full border border-dashed border-stone-100 dark:border-stone-700" />

                  {/* Compass points */}
                  {COMPASS_POINTS.map(({ label, deg }) => {
                    const rad = (deg - 90) * (Math.PI / 180);
                    const radius = 100;
                    const x = 128 + radius * Math.cos(rad);
                    const y = 128 + radius * Math.sin(rad);
                    const good = isGoodDirection(label);
                    const bad = isBadDirection(label);

                    return (
                      <div
                        key={label}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-default"
                        style={{ left: x, top: y }}
                        onMouseEnter={() => setHoveredDir(label)}
                        onMouseLeave={() => setHoveredDir(null)}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-200 ${
                          good
                            ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 ring-2 ring-amber-400 scale-110"
                            : bad
                            ? "bg-red-50 dark:bg-red-950/30 text-red-400 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800"
                            : "bg-stone-100 dark:bg-stone-700 text-stone-500"
                        } ${hoveredDir === label ? "scale-125" : ""}`}>
                          {label}
                        </div>
                      </div>
                    );
                  })}

                  {/* Rotating needle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                      initial={{ rotate: -180 }}
                      animate={{ rotate: compassRotation }}
                      transition={{ type: "spring", stiffness: 40, damping: 15, delay: 0.3 }}
                      style={{ transformOrigin: "center" }}
                      className="relative"
                    >
                      <div className="w-1.5 h-28 bg-gradient-to-b from-red-500 via-red-300 via-50% to-stone-400 rounded-full relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rotate-45" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-stone-400 rounded-full" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-white dark:bg-stone-900 border-2 border-amber-300 shadow-lg flex flex-col items-center justify-center z-10">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-stone-400">Cung</span>
                      <span className="text-lg font-serif font-bold text-amber-600 dark:text-amber-400 leading-tight">
                        {result.cung}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cung info */}
                <div className="text-center mb-6">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                    result.menh === "Đông Tứ Mệnh"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                      : "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300"
                  }`}>
                    {result.menh}
                  </span>
                </div>

                <p className="text-center text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-6 italic">
                  {result.description}
                </p>

                {/* Direction tables */}
                <div className="space-y-4">
                  <DirectionGroup
                    title="Hướng Đại Cát ✦"
                    color="text-amber-700 dark:text-amber-400"
                    bg="bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50"
                    items={[
                      { label: "Sinh Khí (Tài lộc)", value: result.sinhKhi },
                      { label: "Thiên Y (Sức khỏe)", value: result.thienY },
                      { label: "Diên Niên (Tình duyên)", value: result.dienNien },
                      { label: "Phục Vị (An nghỉ)", value: result.phucVi },
                    ]}
                    icon={<CheckCircle size={16} className="text-amber-600" />}
                  />
                  <DirectionGroup
                    title="Hướng Kỵ ✗"
                    color="text-red-600 dark:text-red-400"
                    bg="bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50"
                    items={[
                      { label: "Tuyệt Mệnh (Nguy hiểm)", value: result.tuyetMenh },
                      { label: "Ngũ Quỷ (Tai họa)", value: result.nguQuy },
                      { label: "Lục Sát (Thị phi)", value: result.lucSat },
                      { label: "Họa Hại (Bệnh tật)", value: result.hoaHai },
                    ]}
                    icon={<XCircle size={16} className="text-red-500" />}
                  />
                </div>

                <div className="mt-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 flex items-start gap-3 text-left">
                  <MapPin className="text-amber-600 shrink-0 mt-0.5" size={18} />
                  <p className="text-amber-800 dark:text-amber-300 text-xs font-medium leading-relaxed">
                    Lời khuyên: Kê giường ngủ hướng <strong>{result.phucVi}</strong> (Phục Vị) giúp tâm trí tĩnh lặng, giấc ngủ sâu.
                    Bàn làm việc hướng <strong>{result.sinhKhi}</strong> (Sinh Khí) đón tài lộc. Bếp núc hướng <strong>{result.dienNien}</strong> (Diên Niên) hòa thuận gia đình.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4 opacity-30 py-20"
              >
                <Compass size={100} className="mx-auto text-stone-300 dark:text-stone-600" />
                <p className="font-serif italic text-lg dark:text-stone-400">Vui lòng nhập thông tin để xem hướng nhà...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function DirectionGroup({
  title, color, bg, items, icon,
}: {
  title: string;
  color: string;
  bg: string;
  items: { label: string; value: string }[];
  icon: React.ReactNode;
}) {
  return (
    <div className={`p-5 rounded-2xl border ${bg}`}>
      <p className={`text-xs font-bold uppercase tracking-widest ${color} mb-3 flex items-center gap-1.5`}>
        {icon}{title}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col">
            <span className="text-[10px] text-stone-400 dark:text-stone-500">{item.label}</span>
            <span className={`font-bold text-sm ${color}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
