"use client";
import React, { useState, useMemo, useCallback } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sun, Moon, Info, X } from "lucide-react";
import { solarToLunar, getDayInfo, getYearCanChi } from "@/lib/lunar-logic";
import { motion, AnimatePresence } from "framer-motion";

const MONTH_NAMES = [
  "Tháng Giêng", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu",
  "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Chạp",
];
const WEEK_DAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

type FilterMode = "all" | "good" | "bad";

interface DayData {
  solar: number;
  lunar: number;
  lunarMonth: number;
  isHoangDao: boolean;
  isHacDao: boolean;
  isToday: boolean;
  gioHoangDao: string[];
  canChi: string;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filter, setFilter] = useState<FilterMode>("all");
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = useCallback(() => setCurrentDate(new Date(year, month - 1, 1)), [year, month]);
  const nextMonth = useCallback(() => setCurrentDate(new Date(year, month + 1, 1)), [year, month]);

  const today = new Date();
  const canChi = getYearCanChi(year);

  const days = useMemo((): DayData[] => {
    const total = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: total }, (_, i) => {
      const d = i + 1;
      const date = new Date(year, month, d);
      const info = getDayInfo(date);
      const lunar = solarToLunar(date);
      return {
        solar: d,
        lunar: lunar.day,
        lunarMonth: lunar.month,
        isHoangDao: info.isHoangDao,
        isHacDao: info.isHacDao,
        isToday: d === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
        gioHoangDao: info.gioHoangDao,
        canChi: lunar.canChi,
      };
    });
  }, [year, month]);

  const firstDayOffset = new Date(year, month, 1).getDay();

  const visibleDays = useMemo(() => {
    if (filter === "all") return days;
    return days.map((d) => ({
      ...d,
      hidden: filter === "good" ? !d.isHoangDao : !d.isHacDao,
    }));
  }, [days, filter]);

  // Stats
  const hoangDaoCount = days.filter((d) => d.isHoangDao).length;
  const hacDaoCount = days.filter((d) => d.isHacDao).length;

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold flex items-center gap-3 dark:text-stone-50">
            <CalendarIcon className="text-amber-600" />
            Lịch Vạn Niên
          </h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            Năm {canChi} {year} · {hoangDaoCount} ngày Hoàng Đạo · {hacDaoCount} ngày Hắc Đạo
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-stone-800 px-5 py-2 rounded-full border border-stone-200 dark:border-stone-600 shadow-sm">
          <button onClick={prevMonth} className="hover:text-amber-600 transition-colors p-1">
            <ChevronLeft size={20} />
          </button>
          <span className="font-serif font-bold text-lg min-w-[160px] text-center dark:text-stone-100">
            {MONTH_NAMES[month]} {year}
          </span>
          <button onClick={nextMonth} className="hover:text-amber-600 transition-colors p-1">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { key: "all", label: "Tất cả", icon: <CalendarIcon size={14} /> },
          { key: "good", label: `Hoàng Đạo (${hoangDaoCount})`, icon: <Sun size={14} /> },
          { key: "bad", label: `Hắc Đạo (${hacDaoCount})`, icon: <Moon size={14} /> },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key as FilterMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === key
                ? key === "good"
                  ? "bg-amber-600 text-white shadow-md"
                  : key === "bad"
                  ? "bg-rose-600 text-white shadow-md"
                  : "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-md"
                : "bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-amber-300"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-6 flex-wrap text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-400" />
          <span className="text-stone-500 dark:text-stone-400">Hoàng Đạo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-rose-100 border border-rose-400" />
          <span className="text-stone-500 dark:text-stone-400">Hắc Đạo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-stone-900 dark:bg-stone-100" />
          <span className="text-stone-500 dark:text-stone-400">Hôm nay</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-stone-800 rounded-[2rem] border border-stone-200 dark:border-stone-700 shadow-2xl shadow-stone-900/5 overflow-hidden">
        {/* Weekday header */}
        <div className="grid grid-cols-7 border-b border-stone-100 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
          {WEEK_DAYS.map((w) => (
            <div
              key={w}
              className="py-4 text-center text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 border-r border-stone-100 dark:border-stone-700 last:border-r-0"
            >
              {w}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 border-l border-stone-100 dark:border-stone-700">
          {/* Empty cells for offset */}
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div
              key={`e-${i}`}
              className="h-20 sm:h-28 border-b border-r border-stone-50 dark:border-stone-700/50 bg-stone-50/40 dark:bg-stone-900/20"
            />
          ))}

          {/* Day cells */}
          {visibleDays.map((d) => {
            const dimmed = (d as typeof d & { hidden?: boolean }).hidden;

            return (
              <div
                key={d.solar}
                role="button"
                tabIndex={dimmed ? -1 : 0}
                aria-label={`Ngày ${d.solar}, âm lịch ${d.lunar}/${d.lunarMonth}${d.isHoangDao ? ", Hoàng Đạo" : ""}${d.isHacDao ? ", Hắc Đạo" : ""}`}
                onClick={() => !dimmed && setSelectedDay(d)}
                onKeyDown={(e) => { if (!dimmed && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setSelectedDay(d); } }}
                className={`h-20 sm:h-28 border-b border-r border-stone-100 dark:border-stone-700/50 p-2 sm:p-3 transition-all flex flex-col justify-between cursor-pointer group ${
                  dimmed ? "opacity-20 pointer-events-none" : "hover:bg-amber-50/50 dark:hover:bg-amber-900/10"
                } ${d.isHoangDao ? "bg-amber-50/30 dark:bg-amber-950/10" : ""} ${
                  d.isToday ? "ring-2 ring-inset ring-amber-400 dark:ring-amber-600" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`text-base sm:text-lg font-bold leading-none ${
                      d.isHoangDao
                        ? "text-amber-600 dark:text-amber-400"
                        : d.isHacDao
                        ? "text-rose-400 dark:text-rose-500"
                        : "text-stone-900 dark:text-stone-100"
                    } ${
                      d.isToday
                        ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 w-7 h-7 rounded-full flex items-center justify-center text-sm"
                        : ""
                    }`}
                  >
                    {d.solar}
                  </span>
                  <span className="text-[10px] text-stone-400 dark:text-stone-500 font-medium leading-none">
                    {d.lunar}
                    {d.lunarMonth !== month + 1 && <sup className="text-amber-500">/{d.lunarMonth}</sup>}
                  </span>
                </div>

                <div className="flex items-center gap-0.5 overflow-hidden">
                  {d.isHoangDao && (
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-amber-600 dark:text-amber-500 font-bold uppercase truncate">
                      <Sun size={9} />
                      <span className="hidden sm:inline">Hoàng Đạo</span>
                    </div>
                  )}
                  {d.isHacDao && !d.isHoangDao && (
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-rose-400 dark:text-rose-500 font-medium uppercase truncate">
                      <Moon size={9} />
                      <span className="hidden sm:inline">Hắc Đạo</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Detail Modal */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`Chi tiết ngày ${selectedDay?.solar}`}
            onClick={(e) => e.target === e.currentTarget && setSelectedDay(null)}
            onKeyDown={(e) => e.key === "Escape" && setSelectedDay(null)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              className="bg-white dark:bg-stone-800 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 w-full sm:max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-1">
                    {MONTH_NAMES[month]} {year}
                  </p>
                  <h3 className="text-4xl font-serif font-bold dark:text-stone-50">
                    Ngày {selectedDay.solar}
                  </h3>
                  <p className="text-stone-500 dark:text-stone-400 mt-1">
                    Âm lịch: {selectedDay.lunar}/{selectedDay.lunarMonth}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
                >
                  <X size={18} className="dark:text-stone-300" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Status */}
                <div className={`flex items-center gap-3 p-4 rounded-2xl ${
                  selectedDay.isHoangDao
                    ? "bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50"
                    : selectedDay.isHacDao
                    ? "bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50"
                    : "bg-stone-50 dark:bg-stone-700/50 border border-stone-100 dark:border-stone-600"
                }`}>
                  {selectedDay.isHoangDao ? (
                    <Sun className="text-amber-600 shrink-0" size={22} />
                  ) : (
                    <Moon className="text-stone-500 shrink-0" size={22} />
                  )}
                  <div>
                    <p className={`font-bold ${selectedDay.isHoangDao ? "text-amber-700 dark:text-amber-400" : selectedDay.isHacDao ? "text-rose-600 dark:text-rose-400" : "text-stone-600 dark:text-stone-300"}`}>
                      {selectedDay.isHoangDao ? "Ngày Hoàng Đạo ✦ Đại Lành" : selectedDay.isHacDao ? "Ngày Hắc Đạo · Nên Hạn Chế" : "Ngày Bình Thường"}
                    </p>
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                      {selectedDay.isHoangDao
                        ? "Thích hợp khởi sự, ký kết, cưới hỏi, khai trương."
                        : selectedDay.isHacDao
                        ? "Nên tránh khởi sự, di chuyển, giao dịch lớn."
                        : "Ngày bình thường, không có điểm đặc biệt."}
                    </p>
                  </div>
                </div>

                {/* Lucky hours */}
                {selectedDay.gioHoangDao.length > 0 && (
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-700/50 border border-stone-100 dark:border-stone-600">
                    <div className="flex items-center gap-2 mb-3">
                      <Info size={16} className="text-amber-600" />
                      <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Giờ Hoàng Đạo</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedDay.gioHoangDao.map((g) => (
                        <span
                          key={g}
                          className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold"
                        >
                          Giờ {g}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Can Chi */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-700/50 border border-stone-100 dark:border-stone-600">
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Can Chi năm</p>
                  <p className="font-bold text-stone-800 dark:text-stone-200">{selectedDay.canChi}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
