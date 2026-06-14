import { NextRequest, NextResponse } from 'next/server'
import { getMoodleCourses, getUserEnrolledCourses } from '@/lib/moodle'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const enrolledOnly = searchParams.get('enrolled') === 'true'

    if (enrolledOnly) {
      const authHeader = request.headers.get('Authorization')
      const token = extractTokenFromHeader(authHeader || '')
      if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }

      const decoded = verifyToken(token)
      if (!decoded) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
      }

      const res = await getUserEnrolledCourses(decoded.email)
      if (res.success) {
        return NextResponse.json({ success: true, courses: res.courses })
      } else {
        return NextResponse.json({ success: false, error: res.error }, { status: 500 })
      }
    }

    // Default: return all moodle courses
    const res = await getMoodleCourses()
    if (res.success) {
      return NextResponse.json({ success: true, courses: res.courses })
    } else {
      return NextResponse.json({ success: false, error: res.error }, { status: 500 })
    }
  } catch (error) {
    logger.error('Error in /api/courses/moodle:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
