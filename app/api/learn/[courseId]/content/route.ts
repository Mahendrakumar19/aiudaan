/**
 * GET /api/learn/[courseId]/content
 * Returns course sections + modules for authenticated enrolled users.
 */
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt'
import { getUserEnrolledCourses } from '@/lib/moodle'
import { getCourseContents } from '@/lib/moodle-content'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId: courseIdStr } = await params
    // Auth check
    const token = extractTokenFromHeader(request.headers.get('Authorization') || '')
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })

    const courseId = parseInt(courseIdStr)
    if (isNaN(courseId)) return NextResponse.json({ success: false, message: 'Invalid courseId' }, { status: 400 })

    // Verify the user is enrolled in this course
    const enrolledRes = await getUserEnrolledCourses(decoded.email)
    if (!enrolledRes.success) {
      return NextResponse.json({ success: false, message: 'Could not verify enrollment' }, { status: 403 })
    }

    const isEnrolled = enrolledRes.courses?.some((c: any) => c.id === courseId)
    if (!isEnrolled) {
      return NextResponse.json({ success: false, message: 'Not enrolled in this course' }, { status: 403 })
    }

    // Fetch course contents
    const contentRes = await getCourseContents(courseId)
    if (!contentRes.success) {
      return NextResponse.json({ success: false, message: contentRes.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      sections: contentRes.sections,
    })
  } catch (error) {
    logger.error('Error in /api/learn/[courseId]/content:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
