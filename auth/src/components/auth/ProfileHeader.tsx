"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";

export default function ProfileHeader() {
  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20"
      >
        <User className="text-white" size={32} />
      </motion.div>
      <h2 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h2>
      <p className="mt-2 text-stone-500 dark:text-stone-400">
        Cập nhật thông tin hiển thị và email của bạn
      </p>
    </div>
  );
}
