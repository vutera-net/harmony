import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@harmony/auth";
import { prisma } from "@harmony/database";

export default async function IndexPage() {
  const session = await getServerSession(authOptions);

  // Chưa đăng nhập -> trang đăng nhập
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Đã đăng nhập, kiểm tra xem đã có profile chưa
  const profile = await prisma.destinyProfile.findUnique({
    where: { userId: session.user.id },
  });

  // Chưa có profile -> Onboarding
  if (!profile) {
    redirect("/onboarding");
  }

  // Đã có profile -> Dashboard
  redirect("/dashboard");
}

