"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerAction } from "@/lib/actions/register";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    const result = await registerAction({ name, email, password });

    if (result.success) {
      alert(result.message);
      router.push("/login");
    } else {
      setErrors(result.error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-vutera-gradient">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-stone-500 hover:text-primary transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft size={16} /> Quay lại đăng nhập
          </Link>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-accent/20"
          >
            <UserPlus className="text-white" size={32} />
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight">Tạo tài khoản mới</h2>
          <p className="mt-2 text-stone-500 dark:text-stone-400">
            Gia nhập cộng đồng tâm linh hiện đại Vutera
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors?.form && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-600 text-sm rounded-xl text-center">
                {errors.form[0]}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className={`w-full bg-stone-50 dark:bg-stone-900 border-2 ${errors?.name ? "border-red-500" : "border-stone-100 dark:border-stone-800"} rounded-xl px-12 py-3.5 outline-none focus:border-accent transition-all`}
                />
              </div>
              {errors?.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name[0]}</p>}
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
                  className={`w-full bg-stone-50 dark:bg-stone-900 border-2 ${errors?.email ? "border-red-500" : "border-stone-100 dark:border-stone-800"} rounded-xl px-12 py-3.5 outline-none focus:border-accent transition-all`}
                />
              </div>
              {errors?.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email[0]}</p>}
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
                  className={`w-full bg-stone-50 dark:bg-stone-900 border-2 ${errors?.password ? "border-red-500" : "border-stone-100 dark:border-stone-800"} rounded-xl px-12 py-3.5 outline-none focus:border-accent transition-all`}
                />
              </div>
              {errors?.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password[0]}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-accent text-white rounded-xl font-bold tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? "ĐANG TẠO..." : "ĐĂNG KÝ"}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
