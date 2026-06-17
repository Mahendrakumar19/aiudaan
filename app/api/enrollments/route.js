import { NextResponse } from 'next/server';
import {
  enrollUser,
  unenrollUser,
  getCourses,
  getEnrolledUsers,
} from '@/service/moodleApi';

function toIsoDate(unixSeconds) {
  if (!unixSeconds) return null;
  return new Date(Number(unixSeconds) * 1000).toISOString();
}

// GET /api/enrollments - returns latest enrollment rows
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').trim().toLowerCase();

    const courses = await getCourses();
    const list = Array.isArray(courses) ? courses.filter((c) => c.id !== 1).slice(0, 25) : [];

    const enrollmentRows = [];

    for (const course of list) {
      const users = await getEnrolledUsers(course.id).catch(() => []);
      if (!Array.isArray(users)) continue;

      users.forEach((user) => {
        enrollmentRows.push({
          id: `${course.id}-${user.id}`,
          studentId: user.id,
          studentName: `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.fullname || 'Unknown',
          studentEmail: user.email || '',
          courseId: course.id,
          courseName: course.fullname || `Course #${course.id}`,
          enrollmentDate: toIsoDate(user.lastcourseaccess || user.firstaccess),
          status: user.suspended || user.deleted ? 'Inactive' : 'Active',
        });
      });
    }

    const filtered = search
      ? enrollmentRows.filter((item) =>
          item.studentName.toLowerCase().includes(search) ||
          item.studentEmail.toLowerCase().includes(search) ||
          item.courseName.toLowerCase().includes(search)
        )
      : enrollmentRows;

    filtered.sort(
      (a, b) => new Date(b.enrollmentDate || 0).getTime() - new Date(a.enrollmentDate || 0).getTime()
    );

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch enrollments',
      },
      { status: 500 }
    );
  }
}

// POST /api/enrollments - enroll student in course
export async function POST(request) {
  try {
    const body = await request.json();
    const { userid, courseid, roleid } = body;

    if (!userid || !courseid) {
      return NextResponse.json(
        {
          success: false,
          error: 'userid and courseid are required',
        },
        { status: 400 }
      );
    }

    const result = await enrollUser({
      userid: Number(userid),
      courseid: Number(courseid),
      roleid: Number(roleid || 5),
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Enrollment successful',
    });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to enroll student',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/enrollments - remove enrollment
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { userid, courseid, roleid } = body;

    if (!userid || !courseid) {
      return NextResponse.json(
        {
          success: false,
          error: 'userid and courseid are required',
        },
        { status: 400 }
      );
    }

    const result = await unenrollUser({
      userid: Number(userid),
      courseid: Number(courseid),
      roleid: Number(roleid || 5),
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Enrollment removed successfully',
    });
  } catch (error) {
    console.error('Error removing enrollment:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to remove enrollment',
      },
      { status: 500 }
    );
  }
}
