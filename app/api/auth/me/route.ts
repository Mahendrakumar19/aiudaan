import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt'
import { getMoodleUser } from '@/lib/moodle'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Extract token from header
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader || '')

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Overlay details from Moodle (skip for central admin account)
    let name = user.name
    let moodleUsername: string | undefined = undefined
    if (user.email !== 'admin@aiudaanbootcamp.com') {
      try {
        const moodleRes = await getMoodleUser(user.email)
        if (moodleRes.success && moodleRes.user) {
          name = moodleRes.user.fullname || `${moodleRes.user.firstname} ${moodleRes.user.lastname || ''}`.trim() || user.name
          moodleUsername = moodleRes.user.username // e.g. 'mahi'
        }
      } catch (moodleError) {
        logger.error('Failed to overlay Moodle details in /api/auth/me', moodleError)
      }
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user
    const mergedUser = {
      ...userWithoutPassword,
      name,
      ...(moodleUsername ? { moodleUsername } : {}),
    }

    return NextResponse.json(mergedUser)
  } catch (error) {
    logger.error('Get user error', error)
    return NextResponse.json(
      { message: 'Failed to get user' },
      { status: 500 }
    )
  }
}

