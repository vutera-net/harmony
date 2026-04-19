import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { saveSubscription } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await req.json();
    await saveSubscription(session.user.id, subscription);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
