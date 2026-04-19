import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = params.redirect as string | undefined;

  if (!session) {
    if (callbackUrl) {
      redirect(`/login?redirect=${encodeURIComponent(callbackUrl)}`);
    }
    redirect("/login");
  }

  if (callbackUrl) {
    redirect(callbackUrl);
  }

  redirect("/profile");
}
