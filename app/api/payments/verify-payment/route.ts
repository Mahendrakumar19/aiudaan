/**
 * Verify Razorpay Payment
 * POST /api/payments/verify-payment
 * 
 * This endpoint:
 * 1. Verifies the payment signature (CRITICAL FOR SECURITY)
 * 2. Stores registration data
 * 3. Saves payment record to database
 * 4. Triggers email confirmation
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  verifyRazorpaySignature,
  storeRegistration,
  PAYMENT_PLANS,
} from '@/lib/razorpay-utils'
import { sendConfirmationEmail } from '@/lib/email-service'
import { savePaymentRecord } from '@/lib/payment-db'

// CORS headers for production domain
const getCORSHeaders = () => {
  const headers = new Headers()
  headers.set('Access-Control-Allow-Origin', 'https://aiudaanbootcamp.com')
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type')
  headers.set('Access-Control-Max-Age', '86400')
  return headers
}

// Handle preflight requests
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCORSHeaders(),
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      name,
      mobile,
      plan,
      bootcampType,
    } = body

    // Validate inputs
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      const response = NextResponse.json(
        { success: false, message: 'Missing payment verification data' },
        { status: 400 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    if (!name || !email || !mobile || !bootcampType) {
      const response = NextResponse.json(
        { success: false, message: 'Invalid user data' },
        { status: 400 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    // Validate bootcampType
    if (!['offline', 'online'].includes(bootcampType)) {
      const response = NextResponse.json(
        { success: false, message: 'Invalid bootcamp type' },
        { status: 400 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    // Get Razorpay secret from environment
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

    if (!razorpayKeySecret) {
      console.error('Razorpay key secret not configured')
      const response = NextResponse.json(
        { success: false, message: 'Payment service misconfigured' },
        { status: 500 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    // CRITICAL: Verify signature on backend
    // Never trust frontend signature verification
    const isSignatureValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpayKeySecret
    )

    if (!isSignatureValid) {
      console.warn('❌ Invalid Razorpay signature detected')
      const response = NextResponse.json(
        { success: false, message: 'Payment verification failed' },
        { status: 401 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    console.log('✅ Razorpay signature verified successfully')

    // Get plan details for amount based on bootcampType and plan
    let planKey: 'basic' | 'standard' | 'online' = 'basic'
    
    if (bootcampType === 'online') {
      planKey = 'online'
    } else if (bootcampType === 'offline') {
      planKey = plan === 'standard' ? 'standard' : 'basic'
    }

    const planDetails = PAYMENT_PLANS[planKey]

    if (!planDetails) {
      return NextResponse.json(
        { success: false, message: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Store registration in database
    const registrationId = storeRegistration({
      name: name,
      email: email,
      phone: mobile,
      plan: planKey,
      amount: planDetails.price,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentStatus: 'completed',
      emailSent: false,
    })

    console.log(`✅ Registration stored: ${registrationId}`)

    // Save payment record to database
    await savePaymentRecord({
      email,
      name,
      mobile,
      amount: planDetails.price,
      plan: planKey as 'basic' | 'standard' | 'online',
      bootcampType: bootcampType,
      status: 'success',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    })

    // Send confirmation email
    const emailPayload = {
      to: email,
      name: name,
      email: email,
      phone: mobile,
      plan: planKey,
      amount: planDetails.price,
      orderId: razorpay_order_id,
      bootcampType: bootcampType,
    }

    const emailSent = await sendConfirmationEmail(emailPayload)

    // Return success response
    const response = NextResponse.json({
      success: true,
      message: 'Payment verified and registration confirmed',
      registrationId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      emailSent,
    })

    // Important: Don't cache payment verification (user-specific data)
    // Important: Don't cache payment verification (user-specific data)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    
    const corsHeaders = getCORSHeaders()
    corsHeaders.forEach((value, key) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error('Error verifying payment:', error)
    const response = NextResponse.json(
      { success: false, message: 'Payment verification failed' },
      { status: 500 }
    )
    const corsHeaders = getCORSHeaders()
    corsHeaders.forEach((value, key) => {
      response.headers.set(key, value)
    })
    return response
  }
}
