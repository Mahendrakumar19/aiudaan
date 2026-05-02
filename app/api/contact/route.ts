import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

// Mock email sending - in production you'd use a service like SendGrid, Nodemailer, etc.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Here you would send the email using a service like SendGrid
    // For now, we'll just simulate success
    logger.info('Contact form submission received', { name, email })

    return NextResponse.json(
      {
        message: 'Thank you for your message. We will get back to you soon!',
        success: true,
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('Contact form error', error)
    return NextResponse.json(
      { message: 'Failed to send message' },
      { status: 500 }
    )
  }
}