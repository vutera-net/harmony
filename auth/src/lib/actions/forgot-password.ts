"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import crypto from "crypto";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

export async function forgotPasswordAction(data: unknown) {
  const validatedFields = forgotPasswordSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // For security reasons, we don't reveal if the email exists or not.
    // But internally we check if user exists.
    if (!user) {
      return { success: true, message: "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu." };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token valid for 1 hour

    // Clean up old tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Store new token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: token,
        expires: expires,
      },
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    
    const emailResult = await sendEmail({
      to: email,
      subject: "Đặt lại mật khẩu tài khoản Harmony",
      text: `Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng truy cập liên kết sau để tiếp tục: ${resetLink}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Đặt lại mật khẩu Harmony</h2>
          <p>Chào bạn,</p>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
          <p>Vui lòng nhấn vào nút dưới đây để tạo mật khẩu mới. Liên kết này sẽ hết hạn sau 1 giờ.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Đặt lại mật khẩu</a>
          </div>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, bạn có thể bỏ qua email này.</p>
          <p>Trân trọng,<br>Đội ngũ Harmony</p>
        </div>
      `,
    });

    if (!emailResult.success) {
      console.error("Failed to send reset email");
      // We still return success to the user to prevent email enumeration
      return { success: true, message: "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu." };
    }

    return { success: true, message: "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu." };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      error: { server: ["Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau."] },
    };
  }
}
