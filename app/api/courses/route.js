import { NextResponse } from 'next/server';
import { getCourses, createCourse } from '@/service/moodleApi';
import { prisma } from '@/lib/prisma';

// Helper function to sync Moodle courses with local database
async function syncCoursesWithLocalDb(moodleCourses) {
  const syncedCourses = [];
  
  for (const mc of moodleCourses) {
    if (mc.format === 'site' || mc.id === 1) continue;
    
    // Check if course exists in our DB by moodleId
    let localCourse = await prisma.course.findUnique({
      where: { moodleId: mc.id }
    });
    
    const summaryClean = mc.summary ? mc.summary.replace(/<[^>]*>/g, '').trim() : '';
    
    if (!localCourse) {
      // Create new course locally
      localCourse = await prisma.course.create({
        data: {
          moodleId: mc.id,
          title: mc.fullname || mc.displayname || '',
          description: summaryClean || 'No description provided.',
          price: 0,
          instructor: 'Admin',
          duration: '12 weeks',
          level: 'Beginner',
          category: mc.categoryid > 0 ? `Category ${mc.categoryid}` : 'General',
          students: 0,
          rating: 4.5,
          image: '',
        }
      });
    } else {
      // Update title and description if they changed in Moodle
      localCourse = await prisma.course.update({
        where: { id: localCourse.id },
        data: {
          title: mc.fullname || mc.displayname || localCourse.title,
          description: summaryClean || localCourse.description,
        }
      });
    }
    
    syncedCourses.push(localCourse);
  }
  
  return syncedCourses;
}

// Helper to map DB course to UI format expected by frontends
function mapDbCourseToUI(dbCourse) {
  return {
    id: dbCourse.moodleId || dbCourse.id, // Use moodleId as primary ID for frontends
    localId: dbCourse.id,
    moodleId: dbCourse.moodleId,
    title: dbCourse.title,
    instructor: dbCourse.instructor || 'Admin',
    description: dbCourse.description || '',
    category: dbCourse.category || 'General',
    price: dbCourse.price || 0,
    status: 'Published',
    thumbnail: dbCourse.image || '',
    students: dbCourse.students || 0,
    rating: dbCourse.rating || 4.5,
    duration: dbCourse.duration || '12 weeks',
    level: dbCourse.level || 'Beginner',
  };
}

// GET /api/courses - Fetch all courses (sync from Moodle to local DB, return local DB)
export async function GET(request) {
  try {
    console.log('📚 Fetching courses from Moodle...');
    let moodleCourses = [];
    try {
      moodleCourses = await getCourses();
    } catch (moodleError) {
      console.warn('⚠️ Moodle connection failed, falling back to local DB cache:', moodleError.message);
    }

    const coursesArray = Array.isArray(moodleCourses) ? moodleCourses : [];
    
    if (coursesArray.length > 0) {
      await syncCoursesWithLocalDb(coursesArray);
    }

    // Fetch all courses from the local Hostinger database to serve the frontend
    const localCourses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const mappedCourses = localCourses.map(mapDbCourseToUI);

    return NextResponse.json({
      success: true,
      data: mappedCourses,
      count: mappedCourses.length,
    });
  } catch (error) {
    console.error('❌ Error in courses GET route:', error);
    
    // Fallback: try to return whatever is in local DB even on complete failure
    try {
      const localCourses = await prisma.course.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json({
        success: true,
        data: localCourses.map(mapDbCourseToUI),
        count: localCourses.length,
        warning: 'Returned offline database cache due to error'
      });
    } catch (dbError) {
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to fetch courses',
        data: [],
      }, { status: 500 });
    }
  }
}

// POST /api/courses - Create a new course in Moodle and Local Database
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, shortname, category, categoryid, description, instructor, price, status, thumbnail, duration, level, rating } = body;

    // Map frontend fields to Moodle fields
    const courseData = {
      fullname: title || body.fullname,
      shortname: shortname || title?.substring(0, 20).replace(/\s+/g, '').toLowerCase() || 'course' + Date.now(),
      categoryid: categoryid || 1,
      summary: description || body.summary || '',
      visible: status === 'Published' ? 1 : 0,
      price: price || 0,
    };

    console.log('Creating course in Moodle:', courseData);
    let moodleCourseId = null;
    try {
      const result = await createCourse(courseData);
      const createdCourse = Array.isArray(result) && result[0] ? result[0] : result;
      moodleCourseId = createdCourse?.id || null;
    } catch (moodleError) {
      console.warn('⚠️ Moodle course creation failed or skipped due to token permission limits:', moodleError.message);
    }

    console.log('Creating course locally in Hostinger DB...');
    const localDbCourse = await prisma.course.create({
      data: {
        moodleId: moodleCourseId,
        title: title || courseData.fullname,
        description: description || courseData.summary,
        price: parseFloat(price) || 0,
        instructor: instructor || 'Admin',
        duration: duration || '12 weeks',
        level: level || 'Beginner',
        category: category || 'General',
        image: thumbnail || '',
        rating: parseFloat(rating) || 4.5,
      }
    });

    return NextResponse.json({
      success: true,
      data: mapDbCourseToUI(localDbCourse),
      message: moodleCourseId 
        ? 'Course created successfully in both Moodle and Hostinger DB'
        : 'Course created locally in Hostinger DB (Moodle sync skipped due to permissions)',
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create course',
      },
      { status: 500 }
    );
  }
}
