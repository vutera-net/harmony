import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = emailSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
         { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = result.data;

    try {
      await prisma.waitlist.create({
        data: { email },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Email này đã có trong danh sách chờ.' },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { message: 'Đăng ký thành công!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[WAITLIST_API]:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
