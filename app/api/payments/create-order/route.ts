/**
 * Create Razorpay Order
 * POST /api/payments/create-order
 */

import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import {
  generateReceiptId,
  formatAmountForRazorpay,
  PAYMENT_PLANS,
} from '@/lib/razorpay-utils'
import { RazorpayOrderRequest } from '@/types/payment'

import { prisma } from '@/lib/prisma'
import { createMoodleUser, enrollMoodleUserInCourse } from '@/lib/moodle'
import { savePaymentRecord } from '@/lib/payment-db'
import { sendConfirmationEmail } from '@/lib/email-service'

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
    
    // Support both nested userData and flat parameters
    const userData = body.userData || {}
    const plan = body.plan || userData.plan
    const email = body.email || userData.email
    const name = body.name || userData.name
    let mobile = body.mobile || userData.mobile || userData.phone
    if (!mobile || !mobile.trim()) {
      mobile = '9999999999'
    }
    const bootcampType = body.bootcampType || userData.bootcampType || 'online'
    const courseId = body.courseId || userData.courseId
    const moodleUsername = body.moodleUsername || userData.moodleUsername // Moodle username (may differ from email)
    const isMoodleCourse = plan === 'moodle_course'
    // Prefer moodleUsername for Moodle lookups; fall back to email
    const moodleLookupKey = moodleUsername || email

    // Validation
    if (!plan || !email || !name || !mobile || (!isMoodleCourse && !bootcampType)) {
      const response = NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    let planDetails = {
      price: 499,
      currency: 'INR',
      name: 'Moodle LMS Course'
    }

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

      // Check if the course is FREE - Execute immediate self-enrollment bypass
      if (planDetails.price === 0) {
        console.log(`🎁 Free enrollment requested for ${email} in Moodle course ${courseId}`);
        const defaultPassword = `${email.trim().toLowerCase().split('@')[0]}Ai1!`

        // 1. Create/verify Moodle account
        const moodleResult = await createMoodleUser(email.trim(), defaultPassword, name.trim())
        if (!moodleResult.success) {
          console.error(`Moodle registration warning: ${moodleResult.error}`)
        }

        // 2. Enroll user in the course
        if (courseId) {
          const enrolRes = await enrollMoodleUserInCourse(moodleLookupKey, Number(courseId))
          if (!enrolRes.success) {
            console.error(`❌ Moodle Course Auto-Enrollment failed: ${enrolRes.error}`)
          }
        }

        // 3. Save free payment success record locally
        const mockOrderId = `free_order_${Date.now()}`
        const mockPaymentId = `free_pay_${Date.now()}`
        await savePaymentRecord({
          email: email.trim(),
          name: name.trim(),
          mobile: mobile.replace(/\D/g, ''),
          amount: 0,
          plan: 'moodle_course' as any,
          bootcampType: bootcampType,
          status: 'success',
          razorpayOrderId: mockOrderId,
          razorpayPaymentId: mockPaymentId,
          razorpaySignature: 'free_self_enrollment',
        })

        // 4. Send confirmation email
        try {
          await sendConfirmationEmail({
            to: email.trim(),
            name: name.trim(),
            email: email.trim(),
            phone: mobile,
            plan: 'moodle_course',
            amount: 0,
            orderId: mockOrderId,
            bootcampType: bootcampType,
          })
        } catch (emailErr) {
          console.error('Failed to send free enrollment email confirmation:', emailErr)
        }

        const freeResponse = NextResponse.json({
          success: true,
          isFree: true,
          message: 'Free course self-enrollment completed successfully',
          orderId: mockOrderId,
        })
        const corsHeaders = getCORSHeaders()
        corsHeaders.forEach((value, key) => {
          freeResponse.headers.set(key, value)
        })
        return freeResponse
      }
    } else {
      // Validate bootcampType
      if (!['offline', 'online'].includes(bootcampType)) {
        const response = NextResponse.json(
          { success: false, message: 'Invalid bootcamp type. Must be "offline" or "online"' },
          { status: 400 }
        )
        const corsHeaders = getCORSHeaders()
        corsHeaders.forEach((value, key) => {
          response.headers.set(key, value)
        })
        return response
      }

      // Get plan details based on bootcampType and plan
      let planKey: 'basic' | 'standard' | 'online' = 'basic'
      
      if (bootcampType === 'online') {
        planKey = 'online'
      } else if (bootcampType === 'offline') {
        planKey = plan === 'standard' ? 'standard' : 'basic'
      }

      const foundPlan = PAYMENT_PLANS[planKey]

      if (!foundPlan) {
        const response = NextResponse.json(
          { success: false, message: 'Invalid plan selected' },
          { status: 400 }
        )
        const corsHeaders = getCORSHeaders()
        corsHeaders.forEach((value, key) => {
          response.headers.set(key, value)
        })
        return response
      }
      planDetails = foundPlan
    }

    // Validate environment variables
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not configured')
      const response = NextResponse.json(
        { success: false, message: 'Payment service not configured' },
        { status: 500 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    // Create order payload
    const orderPayload: RazorpayOrderRequest = {
      amount: formatAmountForRazorpay(planDetails.price), // Convert to paise
      currency: planDetails.currency,
      receipt: generateReceiptId(),
      notes: {
        name: name,
        email: email,
        phone: mobile,
        plan: planDetails.name,
      },
    }

    // Create Razorpay order via API
    const response = await axios.post(
      'https://api.razorpay.com/v1/orders',
      orderPayload,
      {
        auth: {
          username: razorpayKeyId,
          password: razorpayKeySecret,
        },
      }
    )

    const order = response.data

    const jsonResponse = NextResponse.json({
      success: true,
      orderId: order.id,
      amount: planDetails.price,
      currency: planDetails.currency,
      planDetails,
      bootcampType: bootcampType,
    })

    // Don't cache order creation (time-sensitive, user-specific)
    jsonResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    const corsHeaders = getCORSHeaders()
    corsHeaders.forEach((value, key) => {
      jsonResponse.headers.set(key, value)
    })
    
    return jsonResponse
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)

    if (error.response?.data) {
      const response = NextResponse.json(
        {
          success: false,
          message: error.response.data.description || 'Failed to create order',
        },
        { status: error.response.status || 500 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    const response = NextResponse.json(
      { success: false, message: 'Failed to create payment order' },
      { status: 500 }
    )
    const corsHeaders = getCORSHeaders()
    corsHeaders.forEach((value, key) => {
      response.headers.set(key, value)
    })
    return response
  }
}
