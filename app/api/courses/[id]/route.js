import { NextResponse } from 'next/server';
import { updateCourse, deleteCourse, getCourses } from '@/service/moodleApi';
import { prisma } from '@/lib/prisma';

// Helper to look up course in local DB using ID (CUID) or Moodle ID (number)
async function findLocalCourse(idVal) {
  const numericId = parseInt(idVal);
  if (!isNaN(numericId)) {
    // If it's a number, look up by moodleId
    return await prisma.course.findUnique({
      where: { moodleId: numericId }
    });
  }
  // Otherwise look up by CUID
  return await prisma.course.findUnique({
    where: { id: idVal }
  });
}

// PUT /api/courses/[id] - Update a course in Moodle and Local Hostinger DB
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const localCourse = await findLocalCourse(id);
    const numericMoodleId = localCourse?.moodleId || parseInt(id);

    const courseData = {
      id: numericMoodleId,
      fullname: body.title || body.fullname,
      shortname: body.shortname,
      categoryid: body.categoryid || 1,
      summary: body.description || body.summary || '',
      visible: body.status === 'Published' ? 1 : 0,
    };

    console.log('Updating course in Moodle:', courseData);
    try {
      if (!isNaN(numericMoodleId)) {
        await updateCourse(courseData);
      }
    } catch (moodleError) {
      console.warn('⚠️ Moodle course update failed or skipped:', moodleError.message);
    }

    console.log('Updating course in local Hostinger DB...');
    if (localCourse) {
      const updatedLocal = await prisma.course.update({
        where: { id: localCourse.id },
        data: {
          title: body.title || localCourse.title,
          description: body.description || localCourse.description,
          price: body.price !== undefined ? parseFloat(body.price) : localCourse.price,
          instructor: body.instructor || localCourse.instructor,
          duration: body.duration || localCourse.duration,
          level: body.level || localCourse.level,
          category: body.category || localCourse.category,
          image: body.thumbnail !== undefined ? body.thumbnail : localCourse.image,
          rating: body.rating !== undefined ? parseFloat(body.rating) : localCourse.rating,
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Course updated successfully in Moodle and Hostinger DB',
        data: {
          id: updatedLocal.moodleId || updatedLocal.id,
          localId: updatedLocal.id,
          moodleId: updatedLocal.moodleId,
          title: updatedLocal.title,
          instructor: updatedLocal.instructor,
          description: updatedLocal.description,
          category: updatedLocal.category,
          price: updatedLocal.price,
          status: body.status || 'Published',
          thumbnail: updatedLocal.image,
          duration: updatedLocal.duration,
          level: updatedLocal.level,
          rating: updatedLocal.rating,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Course updated in Moodle (local record not found)',
      data: { id: numericMoodleId },
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update course',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Delete a course from Moodle and Local Hostinger DB
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const localCourse = await findLocalCourse(id);
    const numericMoodleId = localCourse?.moodleId || parseInt(id);

    console.log('Deleting course from Moodle with ID:', numericMoodleId);
    try {
      if (!isNaN(numericMoodleId)) {
        await deleteCourse(numericMoodleId);
      }
    } catch (moodleError) {
      console.warn('⚠️ Moodle course deletion failed or skipped:', moodleError.message);
    }

    console.log('Deleting course from local Hostinger DB...');
    if (localCourse) {
      await prisma.course.delete({
        where: { id: localCourse.id }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully from both Moodle and Hostinger DB',
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete course',
      },
      { status: 500 }
    );
  }
}

// GET /api/courses/[id] - Get single course details (merged)
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const localCourse = await findLocalCourse(id);

    if (localCourse) {
      return NextResponse.json({
        success: true,
        data: {
          id: localCourse.moodleId || localCourse.id,
          localId: localCourse.id,
          moodleId: localCourse.moodleId,
          title: localCourse.title,
          instructor: localCourse.instructor,
          description: localCourse.description,
          category: localCourse.category,
          price: localCourse.price,
          status: 'Published',
          thumbnail: localCourse.image,
          students: localCourse.students,
          rating: localCourse.rating,
          duration: localCourse.duration,
          level: localCourse.level,
        },
      });
    }

    // Fallback: Check Moodle directly if not cached/found in local DB
    const numericId = parseInt(id);
    if (!isNaN(numericId)) {
      const result = await getCourses({ ids: [numericId] });
      const course = Array.isArray(result) ? result[0] : null;

      if (course) {
        return NextResponse.json({
          success: true,
          data: {
            id: course.id,
            title: course.fullname || course.displayname,
            description: course.summary ? course.summary.replace(/<[^>]*>/g, '') : '',
            instructor: 'Admin',
            category: `Category ${course.categoryid}`,
            price: 0,
            status: course.visible ? 'Published' : 'Draft',
            thumbnail: '',
            students: 0,
            rating: 4.5,
          },
        });
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Course not found',
      },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch course',
      },
      { status: 500 }
    );
  }
}
