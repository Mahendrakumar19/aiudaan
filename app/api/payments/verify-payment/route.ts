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
import { prisma } from '@/lib/prisma'
import {
  verifyRazorpaySignature,
  storeRegistration,
  PAYMENT_PLANS,
} from '@/lib/razorpay-utils'
import { sendConfirmationEmail } from '@/lib/email-service'
import { savePaymentRecord } from '@/lib/payment-db'
import { enrollMoodleUserInCourse } from '@/lib/moodle'

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
    } = body

    // Support both nested userData and flat parameters
    const userData = body.userData || {}
    const email = body.email || userData.email
    const name = body.name || userData.name
    let mobile = body.mobile || userData.mobile || userData.phone
    if (!mobile || !mobile.trim()) {
      mobile = '9999999999'
    }
    const plan = body.plan || userData.plan
    const bootcampType = body.bootcampType || userData.bootcampType || 'online'
    const courseId = body.courseId || userData.courseId
    const moodleUsername = body.moodleUsername || userData.moodleUsername
    const isMoodleCourse = plan === 'moodle_course'
    // Prefer moodleUsername for Moodle lookups; fall back to email
    const moodleLookupKey = moodleUsername || email

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

    if (!name || !email || !mobile || (!isMoodleCourse && !bootcampType)) {
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

    let planDetails = {
      price: 499,
      currency: 'INR',
      name: 'Moodle LMS Course'
    }
    let planKey = 'moodle_course'

    if (isMoodleCourse) {
      if (courseId) {
        const numericId = Number(courseId)
        let dbCourse = null
        if (!isNaN(numericId)) {
          dbCourse = await prisma.course.findUnique({
            where: { moodleId: numericId }
          })
        }
        if (!dbCourse) {
          dbCourse = await prisma.course.findUnique({
            where: { id: String(courseId) }
          })
        }
        if (dbCourse) {
          planDetails.price = dbCourse.price
          planDetails.name = dbCourse.title
        }
      }
    } else {
      // Get plan details for amount based on bootcampType and plan
      let resolvedPlanKey: 'basic' | 'standard' | 'online' = 'basic'
      
      if (bootcampType === 'online') {
        resolvedPlanKey = 'online'
      } else if (bootcampType === 'offline') {
        resolvedPlanKey = plan === 'standard' ? 'standard' : 'basic'
      }

      const foundPlan = PAYMENT_PLANS[resolvedPlanKey]

      if (!foundPlan) {
        return NextResponse.json(
          { success: false, message: 'Invalid plan' },
          { status: 400 }
        )
      }
      planDetails = foundPlan
      planKey = resolvedPlanKey
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
      plan: planKey as any,
      bootcampType: bootcampType,
      status: 'success',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    })

    // Trigger Moodle Course Auto-Enrollment if applicable
    if (isMoodleCourse && courseId) {
      try {
        console.log(`Triggering Moodle enrollment for ${moodleLookupKey} in course ${courseId}`)
        const enrolRes = await enrollMoodleUserInCourse(moodleLookupKey, parseInt(courseId))
        if (!enrolRes.success) {
          console.error(`❌ Moodle Course Auto-Enrollment failed: ${enrolRes.error}`)
        } else {
          console.log(`✅ Moodle Course Auto-Enrollment succeeded for ${moodleLookupKey} in course ${courseId}`)
        }
      } catch (enrolErr) {
        console.error('Failed to trigger Moodle enrollment:', enrolErr)
      }
    }

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
