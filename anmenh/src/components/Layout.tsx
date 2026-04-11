"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Compass, Calendar as CalendarIcon, Home as HomeIcon, Sparkles, X, Mail, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Mock saving email
      localStorage.setItem("anmenh_waitlist_" + Date.now(), email);
      setSubmitted(true);
      setTimeout(() => {
        setShowWaitlist(false);
        setSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  const navItems = [
    { path: "/", label: "Trang chủ", icon: <HomeIcon size={20} />, exact: true },
    { path: "/calendar", label: "Xem ngày", icon: <CalendarIcon size={20} />, exact: false },
    { path: "/tu-vi", label: "Tử Vi", icon: <Sparkles size={20} />, exact: false },
    { path: "/bat-trach", label: "Hướng nhà", icon: <Compass size={20} />, exact: false },
  ];

  const isActive = (path: string, exact: boolean) =>
    exact ? pathname === path : pathname === path || pathname.startsWith(path + "/");

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] transition-colors duration-300">
      <header className="sticky top-0 z-50 glass border-b px-6 py-4 flex justify-between items-center transition-colors">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--foreground)] flex items-center justify-center">
            <span className="text-amber-400 font-serif font-bold text-xl leading-none">A</span>
          </div>
          <h1 className="text-xl font-serif font-bold tracking-tight text-[var(--foreground)]">
            An <span className="text-amber-600">Mệnh</span>
          </h1>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${isActive(item.path, item.exact) ? "text-amber-600 font-bold" : "text-stone-500 hover:text-amber-600"
                } transition-colors`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button 
          onClick={() => setShowWaitlist(true)}
          className="btn-zen text-xs uppercase tracking-widest hidden sm:block"
        >
          Tải App
        </button>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 text-[var(--foreground)]">{children}</main>

      <div className="md:hidden fixed bottom-6 left-6 right-6 h-16 glass rounded-2xl flex items-center justify-around px-6 border shadow-xl shadow-stone-900/5 transition-colors">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center gap-1 ${isActive(item.path, item.exact) ? "text-amber-600" : "text-stone-400 hover:text-amber-600"
              } transition-colors`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      <footer className="py-12 px-6 border-t border-stone-200 flex flex-col items-center text-stone-500 text-sm">
        <p className="font-serif italic mb-4">"Gìn giữ nét đẹp văn hóa tâm linh Việt."</p>
        <div className="flex gap-6 mb-8 text-xs font-semibold uppercase tracking-widest">
          <Link href="/about" className="hover:text-amber-600 transition-colors">Về chúng tôi</Link>
          <Link href="/terms" className="hover:text-amber-600 transition-colors">Điều khoản</Link>
          <Link href="/privacy" className="hover:text-amber-600 transition-colors">Bảo mật</Link>
        </div>
        <p>© 2026 An Mệnh. All rights reserved.</p>
      </footer>

      {/* Waitlist Modal */}
      <AnimatePresence>
        {showWaitlist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-6"
            onClick={(e) => e.target === e.currentTarget && setShowWaitlist(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white dark:bg-stone-900 rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-stone-100 dark:border-stone-800 relative"
            >
              <button
                onClick={() => setShowWaitlist(false)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="text-amber-500" size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white mb-2">
                  Ứng dụng di động đang phát triển
                </h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                  Phiên bản Mobile App (iOS & Android) của An Mệnh đang được hoàn thiện. Vui lòng để lại Email để tham gia thử nghiệm sớm (Closed Beta) trên Google Play nhé!
                </p>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-2xl p-6 text-center"
                >
                  <CheckCircle2 className="text-green-500 mx-auto mb-3" size={32} />
                  <p className="text-green-700 dark:text-green-400 font-medium">
                    Cảm ơn bạn! Chúng tôi đã ghi nhận email và sẽ liên hệ sớm nhất.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                      <input
                        type="email"
                        required
                        placeholder="Nhập email của bạn..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl pl-12 pr-4 py-4 text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full btn-zen py-4 font-bold tracking-widest text-sm"
                  >
                    ĐĂNG KÝ TRẢI NGHIỆM SỚM
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
