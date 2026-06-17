/**
 * GET /api/learn/[courseId]/file
 * Proxies a Moodle file download securely — user never sees the raw Moodle URL.
 * Query param: ?path=<encoded moodle fileurl>
 */
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt'
import { proxyMoodleFile } from '@/lib/moodle-content'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    // Auth guard
    const token = extractTokenFromHeader(request.headers.get('Authorization') || '')
    const cookieToken = request.cookies.get('token')?.value
    const activeToken = token || cookieToken

    if (!activeToken) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const decoded = verifyToken(activeToken)
    if (!decoded) return new NextResponse('Invalid token', { status: 401 })

    const rawUrl = request.nextUrl.searchParams.get('path')
    if (!rawUrl) return new NextResponse('Missing path parameter', { status: 400 })

    logger.info(`Proxying Moodle file for user ${decoded.email}: ${rawUrl.substring(0, 80)}...`)

    const upstream = await proxyMoodleFile(rawUrl)

    if (!upstream.ok) {
      return new NextResponse('File not found', { status: 404 })
    }

    const contentType = upstream.headers.get('Content-Type') || 'application/octet-stream'
    const contentLength = upstream.headers.get('Content-Length')
    const contentDisposition = upstream.headers.get('Content-Disposition')

    const responseHeaders = new Headers()
    responseHeaders.set('Content-Type', contentType)
    responseHeaders.set('Cache-Control', 'private, max-age=3600')
    if (contentLength) responseHeaders.set('Content-Length', contentLength)
    if (contentDisposition) responseHeaders.set('Content-Disposition', contentDisposition)

    return new NextResponse(upstream.body, {
      status: 200,
      headers: responseHeaders,
    })
  } catch (error) {
    logger.error('Error in /api/learn/[courseId]/file:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
