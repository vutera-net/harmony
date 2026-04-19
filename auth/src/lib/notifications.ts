import webpush from 'web-push';
import { prisma } from './prisma';

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY !== process.env.VAPID_PUBLIC_KEY) {
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
}

webpush.setVapidDetails(
  'harmony-app',
  'mailto:admin@harmony.net',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

export async function saveSubscription(userId: string, subscription: any) {
  return await prisma.pushSubscription.upsert({
    where: { userId },
    update: { subscription },
    create: {
      userId,
      subscription,
    },
  });
}

export async function removeSubscription(userId: string) {
  return await prisma.pushSubscription.delete({
    where: { userId },
  });
}

export async function sendNotification(userId: string, title: string, options: any) {
  const userSub = await prisma.pushSubscription.findUnique({
    where: { userId },
  });

  if (!userSub) {
    return { success: false, error: 'No subscription found' };
  }

  try {
    await webpush.sendNotification(userSub.subscription, JSON.stringify({
      title,
      ...options,
    }));
    return { success: true };
  } catch (error) {
    console.error(`WebPush error for user ${userId}:`, error);
    if ((error as any).statusCode === 410) {
      // Subscription expired or unsubscribed
      await removeSubscription(userId);
    }
    return { success: false, error: String(error) };
  }
}

export async function sendBulkNotifications(notifications: { userId: string; title: string; options: any }[]) {
  const results = await Promise.allSettled(
    notifications.map(n => sendNotification(n.userId, n.title, n.options))
  );
  return results;
}
