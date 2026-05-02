import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { cacheOrFetch } from '@/lib/api-cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const level = searchParams.get('level') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = 10

    // Cache only default/first page listing (no filters)
    const shouldCache = !search && !category && !level && page === 1
    
    if (shouldCache) {
      const cached = await cacheOrFetch(
        'courses:listing:page1',
        async () => {
          const total = await prisma.course.count()
          const courses = await prisma.course.findMany({
            take: pageSize,
            orderBy: { createdAt: 'desc' },
          })
          return { courses, total }
        },
        3600000 // 1 hour
      )

      return NextResponse.json({
        courses: cached.courses,
        pagination: {
          page,
          pageSize,
          total: cached.total,
          pages: Math.ceil(cached.total / pageSize),
        },
      })
    }

    // Build filter for non-cached requests
    const where: any = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (category) where.category = category
    if (level) where.level = level

    // Get total count
    const total = await prisma.course.count({ where })

    // Get courses
    const courses = await prisma.course.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      courses,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    logger.error('Get courses error', error)
    return NextResponse.json(
      { message: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, price, instructor, duration, level, category } = body

    // Validation
    if (!title || !description || !instructor) {
      return NextResponse.json(
        { message: 'Required fields are missing' },
        { status: 400 }
      )
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: price || 0,
        instructor,
        duration: duration || '12 weeks',
        level: level || 'Beginner',
        category: category || 'Technology',
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    logger.error('Create course error', error)
    return NextResponse.json(
      { message: 'Failed to create course' },
      { status: 500 }
    )
  }
}
