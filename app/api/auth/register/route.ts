import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { hashPassword, generateToken } from '@/lib/auth/jwt'
import { createMoodleUser } from '@/lib/moodle'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists locally
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      )
    }

    // Create user in Moodle LMS first
    const moodleResult = await createMoodleUser(email, password, name)
    if (!moodleResult.success) {
      logger.error(`Moodle registration failed: ${moodleResult.error}`)
      return NextResponse.json(
        { message: `Moodle LMS signup failed: ${moodleResult.error}` },
        { status: 500 }
      )
    }

    // Hash password and create user locally
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Generate token
    const token = generateToken(user.id, user.email)

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        user: userWithoutPassword,
        token,
      },
      { status: 201 }
    )
  } catch (error) {
    logger.error('Registration error', error)
    return NextResponse.json(
      { message: 'Registration failed' },
      { status: 500 }
    )
  }
}

