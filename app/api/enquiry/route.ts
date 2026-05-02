import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { sendToGoogleSheets } from '@/lib/googleSheets'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Determine which handler to use
    // If 'type' is 'simple', it's from new premium form
    // If 'type' is 'enquiry' or missing, it's from old contact form
    // If it has 'studentType', it was old premium form
    
    if (body.type === 'simple' || (body.studentType === undefined && body.phone !== undefined)) {
      return handleSimpleEnquiry(body)
    } else {
      // Old premium form or contact form - treat as simple enquiry
      return handleSimpleEnquiry(body)
    }
  } catch (error) {
    logger.error('Enquiry API error', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleSimpleEnquiry(body: any) {
  const { name, email, phone, message } = body

  // Validate required fields
  if (!name || !email || !phone) {
    return NextResponse.json(
      { message: 'Name, email, and phone are required' },
      { status: 400 }
    )
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { message: 'Invalid email format' },
      { status: 400 }
    )
  }

  // Validate phone
  const phoneDigits = phone.replace(/\D/g, '')
  if (phoneDigits.length !== 10) {
    return NextResponse.json(
      { message: 'Phone must be 10 digits' },
      { status: 400 }
    )
  }

  try {
    // Send enquiry to Google Sheets for tracking
    await sendToGoogleSheets({
      name,
      email,
      mobile: phoneDigits,
      address: message || 'No message',
      class: 'Simple Enquiry',
      source: 'Enquiry Form',
      interest: 'General',
      date: new Date().toLocaleString('en-IN'),
      type: 'enquiry' as const,
    }).catch((err) => {
      console.warn('Google Sheets backup failed:', err)
    })

    return NextResponse.json(
      {
        message: 'Enquiry submitted successfully! 🚀',
        data: {
          name,
          email,
          phone: phoneDigits,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    logger.error('Simple enquiry error', error)
    return NextResponse.json(
      { message: 'Failed to process enquiry' },
      { status: 500 }
    )
  }
}

