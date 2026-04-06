import { redirect } from "next/navigation";
// import { getServerSession } from "next-auth"; 
// import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/database';

export default async function IndexPage() {
  // Logic thực tế sẽ là:
  // 1. Kiểm tra session. Nếu ko có -> redirect("/api/auth/signin")
  // 2. Kiểm tra prisma.DestinyProfile. Nếu ko có -> redirect("/onboarding")
  // 3. Nếu có cả 2 -> redirect("/dashboard")
  
  // Tạm thời để dev UI: Redirect thẳng ra Onboarding để Demo Lớp Da
  redirect("/onboarding");
}
