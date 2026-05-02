import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { otpService } from '@/lib/otpService'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !email.trim()) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    if (!otp || !otp.trim()) {
      return NextResponse.json(
        { message: 'OTP is required' },
        { status: 400 }
      )
    }

    // Verify OTP using shared service
    const result = otpService.verifyOTP(email, otp)

    if (!result.valid) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      )
    }

    // OTP is valid
    // In a real application, you might want to:
    // 1. Update user profile in database with verified email
    // 2. Generate a verification token
    // 3. Set a flag in session/cookie

    return NextResponse.json(
      {
        message: 'Email verified successfully!',
        verified: true,
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('Verify OTP error', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
