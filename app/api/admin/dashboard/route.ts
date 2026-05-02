/**
 * Admin Dashboard API
 * GET /api/admin/dashboard
 * 
 * Returns:
 * - All users with their payment history
 * - Payment statistics
 * - User details and status
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAIL = 'admin@aiudaanbootcamp.com'
const ADMIN_PASSWORD = 'Admin@aiudaan123'

// CORS headers for production domain
const getCORSHeaders = () => {
  const headers = new Headers()
  headers.set('Access-Control-Allow-Origin', 'https://aiudaanbootcamp.com')
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type, x-admin-email, x-admin-password')
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

export async function GET(request: NextRequest) {
  try {
    // Admin authentication with email and password headers
    const email = request.headers.get('x-admin-email')
    const password = request.headers.get('x-admin-password')

    // Validate credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      const response = NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    // Fetch all users with their payments
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        mobile: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            amount: true,
            plan: true,
            status: true,
            mobile: true,
            createdAt: true,
            razorpayPaymentId: true,
            bootcampType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get payment statistics
    const allPayments = await prisma.payment.findMany({
      select: {
        status: true,
        amount: true,
      },
    })

    const totalPayments = allPayments.length
    const successfulPayments = allPayments.filter(p => p.status === 'success').length
    const failedPayments = allPayments.filter(p => p.status === 'failed').length
    const totalRevenue = allPayments
      .filter(p => p.status === 'success')
      .reduce((sum, p) => sum + p.amount, 0)

    const dashboardData = {
      totalUsers: users.length,
      totalPayments,
      successfulPayments,
      failedPayments,
      totalRevenue,
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        createdAt: user.createdAt,
        payments: user.payments,
      })),
    }

    const response = NextResponse.json(dashboardData)
    const corsHeaders = getCORSHeaders()
    corsHeaders.forEach((value, key) => {
      response.headers.set(key, value)
    })
    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fetching dashboard data:', {
      message: errorMessage,
      error: error,
      timestamp: new Date().toISOString(),
    })
    
    const response = NextResponse.json(
      { 
        error: 'Failed to fetch dashboard data',
        message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
    const corsHeaders = getCORSHeaders()
    corsHeaders.forEach((value, key) => {
      response.headers.set(key, value)
    })
    return response
  }
}
