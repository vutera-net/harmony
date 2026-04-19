"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, KeyRound, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "@/lib/actions/reset-password";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await resetPasswordAction({
        token,
        password,
        confirmPassword,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError({ server: ["Đã có lỗi xảy ra. Vui lòng thử lại."] });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-xl text-center space-y-4"
      >
        <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
          <CheckCircle2 className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold">Thành công!</h2>
        <p className="text-stone-500 dark:text-stone-400">
          Mật khẩu của bạn đã được thay đổi. Đang chuyển hướng đến trang đăng nhập...
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-8 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center">
            {error.server ? error.server[0] : "Vui lòng kiểm tra lại thông tin nhập vào."}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium ml-1">Mật khẩu mới</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-xl px-12 py-3.5 outline-none focus:border-primary transition-all"
            />
          </div>
          {error?.password && (
            <p className="text-xs text-red-500 ml-1">{error.password[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium ml-1">Xác nhận mật khẩu</label>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-stone-50 dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-xl px-12 py-3.5 outline-none focus:border-primary transition-all"
            />
          </div>
          {error?.confirmPassword && (
            <p className="text-xs text-red-500 ml-1">{error.confirmPassword[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary text-white rounded-xl font-bold tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? "ĐANG CẬP NHẬT..." : "XÁC NHẬN ĐỔI MẬT KHẨU"}
        </button>
      </form>
    </motion.div>
  );
}
