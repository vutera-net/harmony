"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowRight, Sparkles, Moon, Sun, Compass,
  UserCircle2, Edit3, Star, Wind, Droplets, Flame,
  TreePine, CircleDot
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { getDailyLuck, getYearCanChi } from "@/lib/lunar-logic";

export default function Home() {
  const { profile, saveProfile, clearProfile } = useUser();
  const [showSetup, setShowSetup] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [birthYearInput, setBirthYearInput] = useState<number | "">(1990);
  const [genderInput, setGenderInput] = useState<"male" | "female">("male");
  const [dailyLuck, setDailyLuck] = useState<ReturnType<typeof getDailyLuck> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (profile?.birthYear) {
      setDailyLuck(getDailyLuck(profile.birthYear, new Date()));
    }
  }, [profile]);

  useEffect(() => {
    if (showSetup && profile) {
      setNameInput(profile.name || "");
      setBirthYearInput(profile.birthYear || 1990);
      setGenderInput(profile.gender || "male");
    } else if (showSetup && !profile) {
      setNameInput("");
      setBirthYearInput(1990);
      setGenderInput("male");
    }
  }, [showSetup, profile]);

  const handleSave = () => {
    const finalYear = typeof birthYearInput === "number" ? birthYearInput : 1990;
    if (nameInput.trim() && finalYear >= 1900 && finalYear <= 2030) {
      saveProfile({
        name: nameInput.trim(),
        birthYear: finalYear,
        gender: genderInput,
        birthDate: `${finalYear}-01-01`,
      });
      setShowSetup(false);
    }
  };

  const energyColors = ["bg-stone-200", "bg-amber-200", "bg-amber-300", "bg-amber-400", "bg-amber-500"];
  const today = new Date();
  const dateStr = today.toLocaleDateString("vi-VN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <section className="text-center mb-16 relative pt-10">
        <div className="absolute top-0 right-0 p-4 flex items-center gap-2">
          {profile ? (
            <div className="flex items-center gap-2 bg-white dark:bg-stone-800 px-4 py-2 rounded-full border border-stone-100 dark:border-stone-700 shadow-sm">
              <span className="text-sm font-medium">Chào, {profile.name}</span>
              <Sparkles size={16} className="text-amber-500" />
              <button
                onClick={() => setShowSetup(true)}
                className="ml-1 text-stone-400 hover:text-amber-600 transition-colors"
                title="Chỉnh sửa hồ sơ"
              >
                <Edit3 size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSetup(true)}
              className="flex items-center gap-2 text-stone-400 hover:text-amber-600 transition-colors px-3 py-2 rounded-full hover:bg-amber-50 dark:hover:bg-stone-800"
            >
              <UserCircle2 size={22} />
              <span className="text-sm font-medium hidden sm:inline">Tạo hồ sơ</span>
            </button>
          )}
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles size={14} />
          <span>Vận trình {today.getFullYear()} {getYearCanChi(today.getFullYear())}</span>
        </div>

        <h2 className="text-5xl md:text-7xl font-serif font-bold text-stone-950 dark:text-stone-50 mb-6 leading-[1.1]">
          {profile ? `Hữu duyên, ${profile.name}` : "Thấu hiểu Vận Mệnh"}
          <br />
          <span className="gold-gradient">Kiến tạo Bình An</span>
        </h2>
        <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Ứng dụng phong thủy, tử vi theo triết lý Zen hiện đại. Đưa ra những lời khuyên sâu sắc,
          giúp bạn đón lành tránh dữ và cân bằng dòng năng lượng trong cuộc sống.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/tu-vi" className="btn-zen flex items-center justify-center gap-2 group px-8 py-3">
            Luận giải bản mệnh <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/bat-trach" className="px-8 py-3 rounded-full border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
            Khám phá Phong thủy
          </Link>
        </div>
      </section>

      {/* Daily Luck Dashboard */}
      {mounted && profile && dailyLuck && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="rounded-[2.5rem] p-8 border border-amber-100 dark:border-amber-900/30 bg-gradient-to-br from-amber-50 to-stone-50 dark:from-stone-900 dark:to-stone-900/50 overflow-hidden relative">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber-100/50 dark:bg-amber-900/10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className="relative">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-1">
                    Tử Vi Hôm Nay
                  </p>
                  <h3 className="text-2xl font-serif font-bold text-stone-950 dark:text-stone-50">
                    {dateStr}
                  </h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                    Năm {getYearCanChi(profile.birthYear)} · {profile.gender === "male" ? "Nam" : "Nữ"}
                  </p>
                </div>
                {/* Energy bar */}
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Năng lượng</p>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-sm transition-all ${i < dailyLuck.energy
                          ? energyColors[i]
                          : "bg-stone-200 dark:bg-stone-700"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-stone-400">{dailyLuck.energy}/5</span>
                </div>
              </div>

              <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed italic mb-8 border-l-2 border-amber-400 pl-4">
                "{dailyLuck.message}"
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuckCard
                  label="Màu sắc may"
                  value={dailyLuck.luckyColor}
                  icon={<CircleDot size={18} className="text-amber-600" />}
                />
                <LuckCard
                  label="Hướng xuất hành"
                  value={dailyLuck.luckyDirection}
                  icon={<Wind size={18} className="text-amber-600" />}
                />
                <LuckCard
                  label="Giờ hoàng đạo"
                  value={dailyLuck.luckyHour}
                  icon={<Moon size={18} className="text-amber-600" />}
                />
                <LuckCard
                  label="Con số may"
                  value={dailyLuck.luckyNumbers.join(" · ")}
                  icon={<Star size={18} className="text-amber-600" />}
                />
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* When no profile: invite to create  */}
      {mounted && !profile && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <button
            onClick={() => setShowSetup(true)}
            className="w-full rounded-[2.5rem] p-8 border-2 border-dashed border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 transition-colors group text-center"
          >
            <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <UserCircle2 size={28} className="text-amber-600" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-2 text-stone-800 dark:text-stone-200">
              Tạo hồ sơ để xem Tử Vi Hôm Nay
            </h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md mx-auto">
              Nhập tên và năm sinh để nhận thông điệp tâm linh cá nhân hóa, năng lượng và hướng xuất hành may mắn mỗi ngày.
            </p>
          </button>
        </motion.section>
      )}

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <FeatureCard
          href="/calendar"
          icon={<Moon className="text-amber-600" />}
          title="Lịch Vạn Niên"
          desc="Tra cứu ngày lành tháng tốt, giờ hoàng đạo cho đại sự."
          color="from-blue-50 to-indigo-50 dark:from-stone-800 dark:to-stone-800"
        />
        <FeatureCard
          href="/tu-vi"
          icon={<Sparkles className="text-amber-600" />}
          title="Luận Giải Tử Vi"
          desc="Bát Tự Tứ Trụ, Cân Xương Đoán Số và Xem Tuổi Tương Hợp."
          color="from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-800"
          badge="3 tính năng"
        />
        <FeatureCard
          href="/bat-trach"
          icon={<Compass className="text-amber-600" />}
          title="Bát Trạch Phong Thủy"
          desc="Tối ưu hướng nhà, hướng bếp cho gia chủ thịnh vượng."
          color="from-green-50 to-emerald-50 dark:from-stone-800 dark:to-stone-800"
        />
      </section>

      {/* Ngũ Hành explanation */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-serif font-bold mb-3 text-stone-900 dark:text-stone-100">Triết Lý Ngũ Hành</h3>
          <p className="text-stone-500 dark:text-stone-400 max-w-xl mx-auto">
            Năm yếu tố cơ bản của vũ trụ, tương sinh tương khắc, định hình mọi quy luật cuộc sống
          </p>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {[
            { name: "Kim", icon: <CircleDot size={24} />, color: "bg-stone-50 border-stone-200 text-stone-700 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200" },
            { name: "Mộc", icon: <TreePine size={24} />, color: "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400" },
            { name: "Thủy", icon: <Droplets size={24} />, color: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-400" },
            { name: "Hỏa", icon: <Flame size={24} />, color: "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400" },
            { name: "Thổ", icon: <CircleDot size={24} />, color: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-400" },
          ].map((el) => (
            <div
              key={el.name}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${el.color} transition-transform hover:scale-105 cursor-default`}
            >
              {el.icon}
              <span className="font-bold text-sm">{el.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Setup Modal */}
      <AnimatePresence>
        {showSetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-6"
            role="dialog"
            aria-modal="true"
            aria-label={profile ? "Chỉnh sửa hồ sơ" : "Tạo hồ sơ mới"}
            onClick={(e) => e.target === e.currentTarget && setShowSetup(false)}
            onKeyDown={(e) => e.key === "Escape" && setShowSetup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-stone-900 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-stone-100 dark:border-stone-700"
            >
              <h3 className="text-3xl font-serif font-bold mb-2 dark:text-stone-50">
                {profile ? "Chỉnh sửa hồ sơ" : "Chào bạn mới"}
              </h3>
              <p className="text-stone-500 dark:text-stone-400 mb-8">
                Nhập thông tin để nhận trải nghiệm cá nhân hóa.
              </p>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="profile-name" className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-2">Họ và tên</label>
                  <input
                    id="profile-name"
                    type="text"
                    placeholder="Nguyễn Văn An"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-600 rounded-2xl px-6 py-4 focus:border-amber-500 outline-none transition-all text-base dark:text-stone-100"
                  />
                </div>

                {/* Birth Year */}
                <div>
                  <label htmlFor="profile-birthyear" className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-2">
                    Năm sinh (Âm lịch)
                  </label>
                  <input
                    id="profile-birthyear"
                    type="number"
                    min={1900}
                    max={2030}
                    value={birthYearInput === "" ? "" : birthYearInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") setBirthYearInput("");
                      else setBirthYearInput(parseInt(val));
                    }}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-600 rounded-2xl px-6 py-4 focus:border-amber-500 outline-none transition-all text-base dark:text-stone-100"
                  />
                  {typeof birthYearInput === 'number' && birthYearInput >= 1900 && birthYearInput <= 2030 && (
                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                      Năm {birthYearInput} • {getYearCanChi(birthYearInput)}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-2" id="gender-label">Giới tính</label>
                  <div className="flex gap-3" role="group" aria-labelledby="gender-label">
                    <button
                      onClick={() => setGenderInput("male")}
                      aria-pressed={genderInput === "male"}
                      className={`flex-1 py-3 rounded-2xl border-2 font-medium transition-all ${genderInput === "male"
                        ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100"
                        : "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300"
                        }`}
                    >Nam</button>
                    <button
                      onClick={() => setGenderInput("female")}
                      aria-pressed={genderInput === "female"}
                      className={`flex-1 py-3 rounded-2xl border-2 font-medium transition-all ${genderInput === "female"
                        ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100"
                        : "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300"
                        }`}
                    >Nữ</button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  {profile && (
                    <button
                      onClick={() => { clearProfile(); setShowSetup(false); }}
                      className="px-4 py-4 text-red-400 text-sm font-medium hover:text-red-600 transition-colors"
                    >
                      Xóa hồ sơ
                    </button>
                  )}
                  <button
                    onClick={() => setShowSetup(false)}
                    className="flex-1 py-4 text-stone-400 dark:text-stone-500 font-medium"
                  >
                    Bỏ qua
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!nameInput.trim() || birthYearInput === "" || birthYearInput < 1900 || birthYearInput > 2030}
                    className="flex-[2] btn-zen py-4 text-sm font-bold tracking-widest disabled:opacity-40"
                  >
                    Bắt đầu ✦
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LuckCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl p-4 border border-stone-100 dark:border-stone-700">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{label}</span>
      </div>
      <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">{value}</p>
    </div>
  );
}

function FeatureCard({
  icon, title, desc, href, color, badge
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
  color: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className={`p-8 rounded-3xl border border-transparent bg-gradient-to-br ${color} hover:border-amber-200 dark:hover:border-amber-800 transition-all group block text-left relative hover:-translate-y-1`}
    >
      {badge && (
        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full">
          {badge}
        </span>
      )}
      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-stone-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-stone-900 dark:text-stone-100">{title}</h3>
      <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{desc}</p>
    </Link>
  );
}
