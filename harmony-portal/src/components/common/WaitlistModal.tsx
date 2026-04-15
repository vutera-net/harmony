"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Bell, Rocket, CheckCircle2 } from "lucide-react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === "error@example.com") {
            reject(new Error("Email này không hợp lệ hoặc đã tồn tại."));
          } else {
            resolve(true);
          }
        }, 1500);
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-100 dark:border-stone-800"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-12">
              {!submitted ? (
                <>
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-3xl flex items-center justify-center rotate-12">
                        <Smartphone className="text-amber-600 dark:text-amber-500 -rotate-12" size={36} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-stone-800 rounded-full shadow-lg flex items-center justify-center">
                        <Bell className="text-amber-500" size={16} />
                      </div>
                    </div>
                  </div>

                  <h2 className="text-3xl font-serif font-bold text-center mb-4 dark:text-white">
                    App Harmony Sắp Ra Mắt
                  </h2>
                  <p className="text-stone-500 dark:text-stone-400 text-center mb-8 leading-relaxed">
                    Trải nghiệm Tử Vi & Cá nhân hóa vận mệnh mượt mà hơn ngay trên điện thoại của bạn. Đăng ký để trở thành những người đầu tiên trải nghiệm phiên bản Beta.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="Địa chỉ email của bạn..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-stone-800 border-2 border-stone-100 dark:border-stone-700 rounded-2xl px-6 py-4 outline-none focus:border-amber-500 transition-all dark:text-white"
                      />
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm text-center animate-shake">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-2xl font-bold tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          ĐĂNG KÝ NGAY <Rocket size={18} />
                        </>
                      )}
                    </button>
                  </form>

                  <p className="mt-6 text-center text-xs text-stone-400 dark:text-stone-500">
                    Chúng tôi sẽ thông báo cho bạn ngay khi ứng dụng có mặt trên Store.
                  </p>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="text-green-600 dark:text-green-500" size={48} />
                  </div>
                  <h2 className="text-3xl font-serif font-bold mb-4 dark:text-white">Cảm ơn bạn!</h2>
                  <p className="text-stone-500 dark:text-stone-400 leading-relaxed mb-8">
                    Bạn đã được thêm vào danh sách hàng chờ. Chúng tôi sẽ gửi email xác nhận và thông báo Gift Code đặc biệt cho bạn khi App ra mắt.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-all"
                  >
                    Đóng
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
