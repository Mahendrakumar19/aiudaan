import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { sendToGoogleSheets } from '@/lib/googleSheets'
import { prisma } from '@/lib/prisma'
import { createMoodleUser } from '@/lib/moodle'
import bcrypt from 'bcrypt'

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

// Validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateMobile(mobile: string): boolean {
  return /^\d{10}$/.test(mobile.replace(/\D/g, ''))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      mobile,
      email,
      address,
      state,
      district,
      class: studentClass,
      aiDomain,
      otherAiDomain,
      source,
      interest,
      bootcampType,
    } = body

    // Validation
    if (!name || !name.trim()) {
      const response = NextResponse.json(
        { message: 'Full Name is required' },
        { status: 400 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    if (!mobile || !validateMobile(mobile)) {
      const response = NextResponse.json(
        { message: 'Valid 10-digit mobile number is required' },
        { status: 400 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    if (!email || !validateEmail(email)) {
      const response = NextResponse.json(
        { message: 'Valid email is required' },
        { status: 400 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    if (!state || !state.trim()) {
      const response = NextResponse.json(
        { message: 'State selection is required' },
        { status: 400 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    if (!district || !district.trim()) {
      const response = NextResponse.json(
        { message: 'District selection is required' },
        { status: 400 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    if (!studentClass) {
      const response = NextResponse.json(
        { message: 'Class selection is required' },
        { status: 400 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    if (!aiDomain) {
      const response = NextResponse.json(
        { message: 'AI Domain selection is required' },
        { status: 400 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    if (aiDomain === 'Other (Please Specify)' && (!otherAiDomain || !otherAiDomain.trim())) {
      const response = NextResponse.json(
        { message: 'Please specify your domain of interest' },
        { status: 400 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    if (!source) {
      return NextResponse.json(
        { message: 'Please specify how you heard about us' },
        { status: 400 }
      )
    }

    if (!bootcampType || !['offline', 'online'].includes(bootcampType)) {
      const response = NextResponse.json(
        { message: 'Please select a valid bootcamp type (offline or online)' },
        { status: 400 }
      )
      const corsHeaders = getCORSHeaders()
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
      return response
    }

    // Prepare data
    // Use custom value if "Other" is selected, otherwise use selected domain
    const finalAiDomain = aiDomain === 'Other (Please Specify)' ? otherAiDomain?.trim() : aiDomain
    
    const registrationData = {
      name: name.trim(),
      mobile: mobile.replace(/\D/g, ''),
      email: email.trim(),
      address: address?.trim() || '',
      state: state.trim(),
      district: district.trim(),
      class: studentClass,
      aiDomain: finalAiDomain,
      bootcampType: bootcampType,
      source: source,
      interest: interest || '',
      date: new Date().toLocaleString('en-IN'),
      type: 'registration' as const, // Send type to distinguish from enquiries
    }

    // Send to Google Sheets for backup/tracking
    sendToGoogleSheets(registrationData).catch((error) => {
      logger.error('Failed to sync registration with Google Sheets', error)
    })

    // Create or update user in database
    try {
      const defaultPassword = `${email.trim().toLowerCase().split('@')[0]}Ai1!`
      
      // Sync user with Moodle LMS
      const moodleResult = await createMoodleUser(email.trim(), defaultPassword, name.trim())
      if (!moodleResult.success) {
        logger.error(`Moodle registration failed during bootcamp signup: ${moodleResult.error}`)
      }

      const hashedPassword = await bcrypt.hash(email.trim(), 10)
      
      await prisma.user.upsert({
        where: { email: email.trim() },
        update: {
          name: name.trim(),
          mobile: mobile.replace(/\D/g, ''),
          address: address?.trim(),
          state: state.trim(),
          district: district.trim(),
          class: studentClass,
          aiDomain: finalAiDomain,
          source: source,
          interest: interest || '',
          bootcampType: bootcampType,
        },
        create: {
          name: name.trim(),
          email: email.trim(),
          password: hashedPassword,
          mobile: mobile.replace(/\D/g, ''),
          address: address?.trim(),
          state: state.trim(),
          district: district.trim(),
          class: studentClass,
          aiDomain: finalAiDomain,
          source: source,
          interest: interest || '',
          bootcampType: bootcampType,
        },
      })

      logger.info(`User created/updated: ${email.trim()}`)
    } catch (dbError) {
      logger.error('Failed to create user in database', dbError)
      // Don't fail the request if database fails, but log the error
    }

    return NextResponse.json(
      {
        message: 'Registration successful',
        data: registrationData,
      },
      { 
        status: 201,
        headers: getCORSHeaders(),
      }
    )
  } catch (error) {
    logger.error('Registration API error', error)
    const response = NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
    const corsHeaders = getCORSHeaders()
    corsHeaders.forEach((value, key) => {
      response.headers.set(key, value)
    })
    return response
  }
}
