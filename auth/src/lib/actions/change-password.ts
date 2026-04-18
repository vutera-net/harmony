"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export async function changePassword(formData: FormData) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { error: "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn." };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const validatedFields = changePasswordSchema.safeParse({
    currentPassword,
    newPassword,
    confirmPassword,
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user || !user.password) {
      return { error: "Không tìm thấy thông tin người dùng hoặc tài khoản không có mật khẩu." };
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordCorrect) {
      return { error: "Mật khẩu hiện tại không chính xác." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return { success: true, message: "Mật khẩu đã được thay đổi thành công!" };
  } catch (error) {
    console.error("Change password error:", error);
    return { error: "Đã xảy ra lỗi trong quá trình thay đổi mật khẩu. Vui lòng thử lại sau." };
  }
}
