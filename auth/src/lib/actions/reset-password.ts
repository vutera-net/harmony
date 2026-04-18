"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token là bắt buộc"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export async function resetPasswordAction(data: unknown) {
  const validatedFields = resetPasswordSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { token, password } = validatedFields.data;

  try {
    // 1. Find the token and check if it's valid
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return {
        success: false,
        error: { server: ["Liên kết đặt lại mật khẩu không hợp lệ."] },
      };
    }

    if (new Date() > verificationToken.expires) {
      return {
        success: false,
        error: { server: ["Liên kết đặt lại mật khẩu đã hết hạn."] },
      };
    }

    // 2. Find the user associated with the token
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return {
        success: false,
        error: { server: ["Không tìm thấy người dùng liên kết với token này."] },
      };
    }

    // 3. Hash new password and update user
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // 4. Delete the token to prevent reuse
    await prisma.verificationToken.delete({
      where: { token },
    });

    return {
      success: true,
      message: "Mật khẩu đã được cập nhật thành công! Bạn có thể đăng nhập ngay bây giờ.",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      error: { server: ["Đã xảy ra lỗi trong quá trình cập nhật mật khẩu. Vui lòng thử lại sau."] },
    };
  }
}
