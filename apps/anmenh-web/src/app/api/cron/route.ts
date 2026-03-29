import { NextResponse } from 'next/server';
import { prisma } from '@harmony/database';
import { generateDailyInsight } from '@harmony/domain';

// Cấu hình tăng giới hạn chạy hàm để quét DB đêm (Serverless)
export const maxDuration = 60; // Max timeout Vercel Hobby, Pro up to 300

export async function GET(request: Request) {
  try {
    // Chỉ kích hoạt khi CRON_SECRET chuẩn từ Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (process.env.NODE_ENV === "production" && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Tránh kẻ xấu quét trộm Serverless DB!', { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Giả định chạy Batch 100 User đầu tiên
    const profiles = await prisma.destinyProfile.findMany({
      take: 100,
    });

    let count = 0;

    for (const p of profiles) {
      // Gọi Engine Domain xin AI Prompt
      const insight = await generateDailyInsight(p.element, p.zodiac, today);
      if (insight) {
        // Lưu Upsert (đã quét thì Update, chưa quét thì Insert)
        await prisma.dailyInsight.upsert({
          where: { profileId_date: { profileId: p.id, date: today } },
          update: {
            energyScore: insight.energyScore,
            doList: JSON.stringify(insight.doList),
            avoidList: JSON.stringify(insight.avoidList),
            luckyColor: insight.luckyColor,
          },
          create: {
            profileId: p.id,
            date: today,
            energyScore: insight.energyScore,
            doList: JSON.stringify(insight.doList),
            avoidList: JSON.stringify(insight.avoidList),
            luckyColor: insight.luckyColor,
          }
        });
        count++;
      }
    }

    return NextResponse.json({ success: true, generatedInsights: count });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
