import { NextRequest, NextResponse } from 'next/server'
import { ContentEngine } from '@/lib/engines/content-engine'
import { deslugifyCanChi } from '@/lib/can-chi-slug'
import { ZodiacSign } from '@/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0]

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 })
  }

  const canChi = deslugifyCanChi(slug)
  if (!canChi) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  // Map Chi to ZodiacSign
  const branchIndex = canChi.chi.index
  const branches: ZodiacSign[] = ['ty', 'suu', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi']
  const zodiac = branches[branchIndex]

  const content = ContentEngine.generateDailyContent(dateStr, slug, zodiac)

  return NextResponse.json({ data: content })
}
