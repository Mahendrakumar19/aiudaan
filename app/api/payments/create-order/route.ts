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
    const mobile = body.mobile || userData.mobile || userData.phone
    const bootcampType = body.bootcampType || userData.bootcampType || 'online'
    const isMoodleCourse = plan === 'moodle_course'

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

    if (!isMoodleCourse) {
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
