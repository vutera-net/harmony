"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, CheckCircle2, Sparkles } from "lucide-react";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem("anmenh_waitlist_" + Date.now(), email);
      setSubmitted(true);
      setTimeout(() => {
        setShowWaitlist(false);
        setSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 text-[var(--foreground)]">
        {children}
      </main>

      <Footer />

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
