/**
 * Admin Payments Statistics API
 * GET /api/admin/payments
 * 
 * Returns:
 * - Total payments
 * - Success count & revenue
 * - Failed count
 * - Pending count
 * - Recent transactions
 * - Plan breakdown
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

    // Get statistics
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Calculate statistics
    const stats = {
      totalPayments: payments.length,
      successCount: payments.filter(p => p.status === 'success').length,
      failedCount: payments.filter(p => p.status === 'failed').length,
      pendingCount: payments.filter(p => p.status === 'pending').length,
      totalRevenue: payments
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + p.amount, 0),
      
      // Plan breakdown
      planBreakdown: {
        basic: {
          total: payments.filter(p => p.plan === 'basic').length,
          success: payments.filter(p => p.plan === 'basic' && p.status === 'success').length,
          revenue: payments
            .filter(p => p.plan === 'basic' && p.status === 'success')
            .reduce((sum, p) => sum + p.amount, 0),
        },
        standard: {
          total: payments.filter(p => p.plan === 'standard').length,
          success: payments.filter(p => p.plan === 'standard' && p.status === 'success').length,
          revenue: payments
            .filter(p => p.plan === 'standard' && p.status === 'success')
            .reduce((sum, p) => sum + p.amount, 0),
        },
      },
      
      // Recent transactions (last 10)
      recentPayments: payments.slice(0, 10),
    }

    const response = NextResponse.json(stats)
    const corsHeaders = getCORSHeaders()
    corsHeaders.forEach((value, key) => {
      response.headers.set(key, value)
    })
    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fetching payment statistics:', {
      message: errorMessage,
      error: error,
      timestamp: new Date().toISOString(),
    })
    
    const response = NextResponse.json(
      { 
        error: 'Failed to fetch payment statistics',
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
