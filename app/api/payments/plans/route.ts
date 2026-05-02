/**
 * Optimized Payment Plans API Route
 * Caches payment plans and uses response headers for browser caching
 */

import { PAYMENT_PLANS } from '@/lib/razorpay-utils'
import { NextResponse } from 'next/server'

export async function GET() {
  // Paymentplans are static, cache indefinitely in production
  const response = NextResponse.json({ plans: PAYMENT_PLANS })

  // Set aggressive caching headers
  response.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400')
  response.headers.set('CDN-Cache-Control', 'max-age=86400')

  return response
}
