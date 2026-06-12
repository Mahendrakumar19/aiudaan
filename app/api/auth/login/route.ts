import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { hashPassword, generateToken } from '@/lib/auth/jwt'
import { authenticateMoodleUser, getMoodleUser } from '@/lib/moodle'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body // 'email' holds the username or email entered

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Verify credentials against Moodle LMS
    const moodleAuth = await authenticateMoodleUser(email, password)

    if (!moodleAuth.success) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Resolve canonical user details from Moodle
    let canonicalEmail = email.trim().toLowerCase()
    let fullName = email.split('@')[0]

    try {
      const moodleUserRes = await getMoodleUser(email)
      if (moodleUserRes.success && moodleUserRes.user) {
        canonicalEmail = moodleUserRes.user.email || canonicalEmail
        fullName = moodleUserRes.user.fullname || `${moodleUserRes.user.firstname} ${moodleUserRes.user.lastname || ''}`.trim() || fullName
      }
    } catch (moodleError) {
      logger.error('Failed to resolve Moodle user details on login', moodleError)
    }

    // Find or create user locally using their verified email
    let user = await prisma.user.findUnique({
      where: { email: canonicalEmail },
    })

    if (!user) {
      // Create a local placeholder for the synced Moodle user
      const hashedPassword = await hashPassword(password)
      user = await prisma.user.create({
        data: {
          name: fullName,
          email: canonicalEmail,
          password: hashedPassword,
        },
      })
    }

    // Generate token
    const token = generateToken(user.id, user.email)

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    logger.error('Login error', error)
    return NextResponse.json(
      { message: 'Login failed' },
      { status: 500 }
    )
  }
}

