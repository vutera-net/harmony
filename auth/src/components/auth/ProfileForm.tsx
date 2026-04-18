"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Save, Loader2, Lock, ShieldCheck } from "lucide-react";
import { updateProfile } from "@/lib/actions/update-profile";
import { changePassword } from "@/lib/actions/change-password";
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
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  
  // Profile state
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    try {
      const result = await updateProfile(formData);
      if (result.error) {
        setMessage({ type: "error", text: typeof result.error === "string" ? result.error : "Có lỗi xảy ra khi cập nhật thông tin." });
      } else {
        setMessage({ type: "success", text: "Thông tin hồ sơ đã được cập nhật thành công!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Đã có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);

    try {
      const result = await changePassword(formData);
      if (result.error) {
        setMessage({ type: "error", text: typeof result.error === "string" ? result.error : "Có lỗi xảy ra khi thay đổi mật khẩu." });
      } else {
        setMessage({ type: "success", text: result.message || "Mật khẩu đã được thay đổi thành công!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
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
      {/* Tab Switcher */}
      <div className="flex p-1 bg-stone-100 dark:bg-stone-900 rounded-2xl mb-8">
        <button
          onClick={() => setActiveTab("profile")}
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-xl transition-all",
            activeTab === "profile" 
              ? "bg-white dark:bg-stone-800 text-primary shadow-sm" 
              : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
          )}
        >
          Thông tin
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-xl transition-all",
            activeTab === "security" 
              ? "bg-white dark:bg-stone-800 text-primary shadow-sm" 
              : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
          )}
        >
          Bảo mật
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "profile" ? (
          <motion.form
            key="profile-form"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={handleProfileSubmit}
            className="space-y-6"
          >
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
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-xl px-12 py-3.5 outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  ĐANG CẬP NHẬT...
                </>
              ) : (
                <>
                  <Save size={20} />
                  LƯU THÔNG TIN
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="security-form"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onSubmit={handlePasswordSubmit}
            className="space-y-6"
          >
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
              <label className="text-sm font-medium ml-1">Mật khẩu hiện tại</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-xl px-12 py-3.5 outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Mật khẩu mới</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-xl px-12 py-3.5 outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-xl px-12 py-3.5 outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  ĐANG THAY ĐỔI...
                </>
              ) : (
                <>
                  <Save size={20} />
                  CẬP NHẬT MẬT KHẨU
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
