import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/auth/ProfileForm";
import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  // Fetch the latest user data from the database to ensure we show the most current info
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-stone-50 dark:bg-stone-950">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20"
          >
            <UserCircle className="text-white" size={32} />
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h2>
          <p className="mt-2 text-stone-500 dark:text-stone-400">
            Cập nhật thông tin hiển thị và email của bạn
          </p>
        </div>

        <ProfileForm user={user} />
        
        <div className="text-center">
          <a href="/" className="text-sm text-stone-500 hover:text-primary transition-colors">
            ← Quay lại trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
