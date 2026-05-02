/**
 * Payment Failure Webhook
 * POST /api/payments/failure
 * 
 * Handles failed payment records
 */

import { NextRequest, NextResponse } from 'next/server'
import { savePaymentRecord } from '@/lib/payment-db'
import { PAYMENT_PLANS } from '@/lib/razorpay-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      name,
      plan,
      razorpay_order_id,
      error_message,
    } = body

    if (!email || !name) {
      return NextResponse.json(
        { success: false, message: 'Missing user data' },
        { status: 400 }
      )
    }

    // Get plan details
    const planKey = plan === 'standard' ? 'standard' : 'basic'
    const planDetails = PAYMENT_PLANS[planKey as 'basic' | 'standard']

    if (!planDetails) {
      return NextResponse.json(
        { success: false, message: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Save failed payment record
    const paymentRecord = await savePaymentRecord({
      email,
      name,
      amount: planDetails.price,
      plan: planKey as 'basic' | 'standard',
      status: 'failed',
      razorpayOrderId: razorpay_order_id,
      errorMessage: error_message || 'Payment failed',
    })

    console.log(`❌ Failed payment recorded: ${paymentRecord.id}`)

    return NextResponse.json({
      success: true,
      message: 'Payment failure recorded',
      paymentId: paymentRecord.id,
    })
  } catch (error) {
    console.error('Error recording payment failure:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to record payment failure' },
      { status: 500 }
    )
  }
}
