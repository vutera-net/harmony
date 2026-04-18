"use server";

import { prisma } from "@/lib/prisma";

export async function verifyEmailAction(token: string, email: string) {
  try {
    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token: token,
      },
    });

    if (!verificationToken || verificationToken.identifier !== email) {
      return {
        success: false,
        error: "Mã xác nhận không hợp lệ.",
      };
    }

    // Check if token has expired
    if (new Date() > verificationToken.expires) {
      return {
        success: false,
        error: "Mã xác nhận đã hết hạn. Vui lòng đăng ký lại hoặc yêu cầu mã mới.",
      };
    }

    // Update user emailVerified status
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
      },
    });

    // Delete the used token
    await prisma.verificationToken.delete({
      where: {
        token: token,
      },
    });

    return {
      success: true,
      message: "Xác nhận email thành công! Bây giờ bạn có thể đăng nhập.",
    };
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      success: false,
      error: "Đã xảy ra lỗi trong quá trình xác nhận email. Vui lòng thử lại sau.",
    };
  }
}
