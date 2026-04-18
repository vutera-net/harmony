"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendEmail } from "@/lib/mail";
import { APP_URLS } from "@/lib/urls";
import crypto from "crypto";

const registerSchema = z.object({
  name: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export async function registerAction(values: any) {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: { email: ["Email này đã được sử dụng"] },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: token,
        expires: expires,
      },
    });

    // Send confirmation email
    const verificationUrl = `${APP_URLS.auth}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    
    await sendEmail({
      to: email,
      subject: "Xác nhận địa chỉ email của bạn",
      text: `Vui lòng xác nhận email của bạn bằng cách nhấn vào liên kết sau: ${verificationUrl}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Chào ${name},</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại Harmony!</p>
          <p>Để hoàn tất quá trình đăng ký, vui lòng xác nhận địa chỉ email của bạn bằng cách nhấn vào nút dưới đây:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Xác nhận Email</a>
          </div>
          <p>Nếu nút trên không hoạt động, bạn có thể sao chép và dán liên kết sau vào trình duyệt:</p>
          <p style="word-break: break-all;">${verificationUrl}</p>
          <p>Liên kết này sẽ hết hạn sau 24 giờ.</p>
          <p>Trân trọng,<br>Đội ngũ Harmony</p>
        </div>
      `,
    });

    return {
      success: true,
      message: "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: { form: ["Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau."] },
    };
  }
}
