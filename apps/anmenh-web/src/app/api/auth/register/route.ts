import { NextResponse } from "next/server";
import { prisma } from "@harmony/database";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email và mật khẩu là bắt buộc." }, { status: 400 });
    }

    // Kiểm tra email đã tồn tại chưa
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email này đã được sử dụng." }, { status: 409 });
    }

    // Tạo user mới (password lưu plain text — dùng cho dev/demo; prod nên dùng bcrypt)
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash: password,
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (err) {
    console.error("[REGISTER ERROR]", err);
    return NextResponse.json({ error: "Lỗi máy chủ. Vui lòng thử lại." }, { status: 500 });
  }
}
