"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Scale, Heart, ArrowRight } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { getYearCanChi } from "@/lib/lunar-logic";

const FEATURES = [
  {
    href: "/bat-tu",
    icon: <Sparkles size={28} className="text-amber-600" />,
    title: "Bát Tự Tứ Trụ",
    desc: "Phân tích lá số Tử Bình qua 4 trụ Năm, Tháng, Ngày, Giờ. Tìm ra vượng khuyết Ngũ Hành để cải vận.",
    need: "Cần ngày + giờ sinh",
    color: "from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-800",
    border: "hover:border-amber-300 dark:hover:border-amber-700",
  },
  {
    href: "/can-xuong",
    icon: <Scale size={28} className="text-amber-600" />,
    title: "Cân Xương Đoán Số",
    desc: "Tính Lượng Chỉ từ ngày giờ sinh theo cổ học. Luận đoán mức độ sang hèn, phúc lộc trọn đời.",
    need: "Cần ngày + giờ sinh",
    color: "from-stone-50 to-slate-50 dark:from-stone-800 dark:to-stone-800",
    border: "hover:border-stone-300 dark:hover:border-stone-600",
  },
  {
    href: "/tuong-hop",
    icon: <Heart size={28} className="text-amber-600" />,
    title: "Xem Tuổi Tương Hợp",
    desc: "Kết hợp Thiên Can, Địa Chi và Cung Phi Bát Trạch để luận đoán nhân duyên đôi lứa.",
    need: "Cần năm sinh hai người",
    color: "from-rose-50 to-pink-50 dark:from-stone-800 dark:to-stone-800",
    border: "hover:border-rose-200 dark:hover:border-rose-900",
  },
];

export default function TuVi() {
  const { profile } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto py-8"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="w-16 h-16 mx-auto bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20"
        >
          <Sparkles className="text-amber-500" size={32} />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-stone-900 dark:text-white">
          Luận Giải Tử Vi
        </h1>
        <p className="text-stone-500 dark:text-stone-400 max-w-md mx-auto text-sm md:text-base leading-relaxed">
          Ba phương pháp cổ học giúp bạn hiểu sâu về bản mệnh, vận trình và nhân duyên.
        </p>
      </div>

      {/* Profile banner */}
      {profile && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 flex items-center gap-3"
        >
          <Sparkles size={16} className="text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
            Hồ sơ: <span className="font-bold">{profile.name}</span> · {getYearCanChi(profile.birthYear)} · {profile.gender === "male" ? "Nam" : "Nữ"}
          </p>
        </motion.div>
      )}

      {/* Feature cards */}
      <div className="space-y-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.href}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <Link
              href={f.href}
              className={`flex items-center gap-5 p-6 rounded-2xl border border-transparent bg-gradient-to-br ${f.color} ${f.border} transition-all group hover:-translate-y-0.5`}
            >
              <div className="w-14 h-14 rounded-xl bg-white dark:bg-stone-700 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                {f.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">{f.title}</h2>
                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-2">{f.desc}</p>
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
                  {f.need}
                </span>
              </div>
              <ArrowRight size={18} className="text-stone-300 dark:text-stone-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
