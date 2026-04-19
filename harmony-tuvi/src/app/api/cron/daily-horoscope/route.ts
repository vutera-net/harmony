import { NextRequest, NextResponse } from 'next/server'
import { generateDailyHoroscopes } from '@/lib/engines/horoscope-generator'
import { prisma } from '@/lib/prisma'
import { cacheSet, cacheKeys, TTL } from '@/lib/cache'

// Verify cron secret
const CRON_SECRET = process.env.CRON_SECRET
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'https://auth.vutera.net'

export async function POST(req: NextRequest) {
  // Verify authorization
  const authHeader = req.headers.get('authorization')
  if (CRON_SECRET && authHeader !== \`Bearer \${CRON_SECRET}\`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]

    // Generate horoscopes for all 12 zodiacs
    const horoscopes = generateDailyHoroscopes(today)

    // Store in database
    const zodiacOrder = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi']
    const zodiacCodes = ['ty', 'suu', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi']

    for (let i = 0; i < zodiacOrder.length; i++) {
      const zodiacVn = zodiacOrder[i]
      const zodiacCode = zodiacCodes[i]
      const horoscope = horoscopes[zodiacVn]

      // Upsert into database
      await prisma.dailyHoroscope.upsert({
        where: { date_zodiac: { date: today, zodiac: zodiacCode } },
        create: {
          date: today,
          zodiac: zodiacCode,
          content: horoscope as any,
        },
        update: {
          content: horoscope as any,
        },
      })

      // Cache separately for fast retrieval
      const cacheKey = cacheKeys.dailyHoroscope(dateStr, zodiacCode)
      await cacheSet(cacheKey, horoscope, TTL.DAY)
    }

    // Trigger daily notifications to users
    try {
      await fetch(\`\${AUTH_SERVICE_URL}/api/notifications/trigger\`, {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${CRON_SECRET}\`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '✨ Vận hạn hằng ngày đã sẵn sàng!',
          body: 'Khám phá ngay những điều thú vị đang chờ đón bạn trong ngày hôm nay.',
          url: '/tu-vi-hang-ngay',
        }),
      });
    } catch (notifError) {
      console.error('Failed to trigger notifications:', notifError);
      // We don't fail the whole cron job if notifications fail
    }

    return NextResponse.json({
      success: true,
      message: \`Generated horoscopes for \${zodiacOrder.length} zodiacs on \${dateStr} and triggered notifications\`,
      count: zodiacOrder.length,
    })
  } catch (error) {
    console.error('Daily horoscope cron error:', error)
    return NextResponse.json(
      { error: 'Failed to generate daily horoscopes', details: String(error) },
      { status: 500 }
    )
  }
}
