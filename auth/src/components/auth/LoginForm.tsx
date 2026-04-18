"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Github, Chrome } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("redirect") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: true,
          callbackUrl,
        });
        if (result?.error) {
          if (result.error.includes("EMAIL_NOT_VERIFIED")) {
            setError("Vui lòng xác nhận email của bạn trước khi đăng nhập.");
          } else {
            setError("Email hoặc mật khẩu không chính xác.");
          }
        }
      } catch (err) {
        setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20"
        >
          <LogIn className="text-white" size={32} />
        </motion.div>
        <h2 className="text-3xl font-bold tracking-tight">Chào mừng trở lại</h2>
        <p className="mt-2 text-stone-500 dark:text-stone-400">
          Đăng nhập vào hệ sinh thái Vutera
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

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

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Mật khẩu</label>
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "ĐANG XÁC THỰC..." : "ĐĂNG NHẬP"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200 dark:border-stone-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-stone-500">Hoặc tiếp tục với</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 transition-all"
          >
            <Chrome size={20} /> <span className="text-sm font-medium">Google</span>
          </button>
          <button
            onClick={() => signIn("facebook")}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
            <span className="text-sm font-medium">Facebook</span>
          </button>
          <button
            onClick={() => signIn("zalo")}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.14 14.113c-.23.43-.65.68-1.12.68-.4 0-.75-.17-1.02-.47l-2.14-2.36-1.34 1.34c-.2.2-.46.32-.72.32-.26 0-.52-.12-.72-.32l-2.14-2.36c-.27-.3-.62-.47-1.02-.47-.47 0-.89.25-1.12.68L5.1 15.5c-.24.43-.15.98.26 1.31.41.33 0.94.43 1.43.3l3.63-.58c.51-.08.99.13 1.38.45.38.32.6.75.64 1.22l.17 2.13c.05.63.44 1.16 1.02 1.44.58.28 1.22.3 1.8.13l2.14-1.04c.5-.24.92-.63 1.2-1.15.28-.52.35-1.12.2-1.73l-.2-2.13c-.04-.47.13-.9.44-1.22.32-.32.75-.46 1.22-.46h1.34z" />
            </svg>
            <span className="text-sm font-medium">Zalo</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 transition-all opacity-50 cursor-not-allowed">
            <Github size={20} /> <span className="text-sm font-medium">Github</span>
          </button>
        </div>
      </motion.div>

      <p className="text-center text-sm text-stone-500">
        Chưa có tài khoản?{" "}
        <a href="/register" className="text-primary font-bold hover:underline">
          Đăng ký ngay
        </a>
      </p>
    </div>
  );
}
