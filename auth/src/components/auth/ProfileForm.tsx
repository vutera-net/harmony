"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Save, Loader2 } from "lucide-react";
import { updateProfile } from "@/lib/actions/update-profile";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProfileFormProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    try {
      const result = await updateProfile(formData);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Thông tin hồ sơ đã được cập nhật thành công!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Đã có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-8 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-xl w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className={cn(
            "p-4 text-sm rounded-xl text-center border",
            message.type === "success" 
              ? "bg-green-500/10 border-green-500/20 text-green-500" 
              : "bg-red-500/10 border-red-500/20 text-red-500"
          )}>
            {message.text}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium ml-1">Tên hiển thị</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên của bạn"
              className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-xl px-12 py-3.5 outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type=\"email\"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=\"email@example.com\"
              className=\"w-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-xl px-12 py-3.5 outline-none focus:border-primary transition-all\"
            />
          </div>
        </div>

        <button
          type=\"submit\"
          disabled={loading}
          className=\"w-full py-4 bg-primary text-white rounded-xl font-bold tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2\"
        >
          {loading ? (
            <>
              <Loader2 className=\"animate-spin\" size={20} />
              ĐANG CẬP NHẬT...
            </>
          ) : (
            <>
              <Save size={20} />
              LƯU THÔNG TIN
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
