import { type NextRequest } from 'next/server'
import { calculateBatTrach, stripBatTrachForPublic } from '@/lib/engines/bat-trach-engine'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'
import { cacheGet, cacheSet, cacheKeys, TTL } from '@/lib/cache'
import type { BatTrachResult } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { birthYear, gender } = body

    if (!birthYear || !gender) {
      return errorResponse('Missing birthYear or gender')
    }
    if (!['male', 'female'].includes(gender)) {
      return errorResponse('gender must be male or female')
    }
    if (birthYear < 1900 || birthYear > 2100) {
      return errorResponse('birthYear must be between 1900 and 2100')
    }

    const cacheKey = cacheKeys.batTrach(birthYear, gender)
    let result = await cacheGet(cacheKey)
    if (!result) {
      result = calculateBatTrach(birthYear, gender)
      await cacheSet(cacheKey, result, TTL.YEAR)
    }

    const publicResult = stripBatTrachForPublic(result as BatTrachResult)

    return successResponse({
      result: publicResult,
      requires_premium: true,
      premium_link: 'https://anmenh.vutera.net/bridge?intent=phongthuy_battrach'
    })
  } catch (err) {
    return serverErrorResponse(err)
  }
}
