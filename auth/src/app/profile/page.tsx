import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/auth/ProfileForm";
import ProfileHeader from "@/components/auth/ProfileHeader";
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
          <ProfileHeader />
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
