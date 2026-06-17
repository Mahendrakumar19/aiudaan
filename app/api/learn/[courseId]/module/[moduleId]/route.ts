/**
 * GET /api/learn/[courseId]/module/[moduleId]
 * Returns detailed content for a single module.
 */
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt'
import { getUserEnrolledCourses } from '@/lib/moodle'
import { getCourseContents, getModuleContent } from '@/lib/moodle-content'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  try {
    const { courseId: courseIdStr, moduleId: moduleIdStr } = await params
    const token = extractTokenFromHeader(request.headers.get('Authorization') || '')
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })

    const courseId = parseInt(courseIdStr)
    const moduleId = parseInt(moduleIdStr)
    if (isNaN(courseId) || isNaN(moduleId)) {
      return NextResponse.json({ success: false, message: 'Invalid parameters' }, { status: 400 })
    }

    // Verify enrollment
    const enrolledRes = await getUserEnrolledCourses(decoded.email)
    const isEnrolled = enrolledRes.courses?.some((c: any) => c.id === courseId)
    if (!isEnrolled) {
      return NextResponse.json({ success: false, message: 'Not enrolled in this course' }, { status: 403 })
    }

    // Fetch course sections to find the module and its modname
    const contentsRes = await getCourseContents(courseId)
    if (!contentsRes.success || !contentsRes.sections) {
      return NextResponse.json({ success: false, message: 'Could not load course' }, { status: 500 })
    }

    let targetMod: any = null
    let sectionName = ''
    for (const section of contentsRes.sections) {
      const mod = section.modules?.find((m: any) => m.id === moduleId)
      if (mod) {
        targetMod = mod
        sectionName = section.name
        break
      }
    }

    if (!targetMod) {
      return NextResponse.json({ success: false, message: 'Module not found' }, { status: 404 })
    }

    // Fetch deeper content based on module type
    const contentRes = await getModuleContent(moduleId, targetMod.modname, courseId)

    return NextResponse.json({
      success: true,
      module: targetMod,
      sectionName,
      detail: contentRes.content,
    })
  } catch (error) {
    logger.error('Error in /api/learn/[courseId]/module/[moduleId]:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
