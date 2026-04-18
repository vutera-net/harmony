import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-500">Thiếu mã xác nhận</h2>
        <p className="text-stone-500">Vui lòng sử dụng liên kết được gửi đến email của bạn để đặt lại mật khẩu.</p>
        <a href="/login" className="inline-block py-2 px-4 bg-primary text-white rounded-lg font-medium">Quay lại Đăng nhập</a>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-vutera-gradient">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20"
          >
            <KeyRound className="text-white" size={32} />
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight">Đặt lại mật khẩu</h2>
          <p className="mt-2 text-stone-500 dark:text-stone-400">
            Vui lòng nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-white">Đang kiểm tra mã xác nhận...</div>}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </main>
  );
}
