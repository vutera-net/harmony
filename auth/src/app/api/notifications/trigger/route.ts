import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBulkNotifications } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, body: notificationBody, url } = body;

    const subscriptions = await prisma.pushSubscription.findMany({
      select: { userId: true },
    });

    if (subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'No subscriptions to notify' });
    }

    const notificationTasks = subscriptions.map(sub => ({
      userId: sub.userId,
      title: title || 'Harmony: Xem vận hạn hôm nay!',
      options: {
        body: notificationBody || 'Hãy cùng xem ngày hôm nay mang lại điều gì cho bạn nhé!',
        url: url || '/tu-vi-hang-ngay',
      },
    }));

    const results = await sendBulkNotifications(notificationTasks);

    return NextResponse.json({ 
      success: true, 
      count: subscriptions.length,
      results: results.map(r => r.status)
    });
  } catch (error) {
    console.error('Trigger notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
