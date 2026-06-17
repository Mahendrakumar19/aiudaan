import { NextResponse } from 'next/server';
import { getUsersByField, deleteUsers, getUserEnrolledCourses } from '@/service/moodleApi';

// DELETE /api/students/[id] - Delete a student
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await deleteUsers([Number(id)]);

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete student',
      },
      { status: 500 }
    );
  }
}

// GET /api/students/[id] - Get single student
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const users = await getUsersByField('id', Number(id));
    const user = Array.isArray(users) ? users[0] : null;

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Student not found',
        },
        { status: 404 }
      );
    }

    const courses = await getUserEnrolledCourses(user.id).catch(() => []);

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        name: `${user.firstname || ''} ${user.lastname || ''}`.trim(),
        email: user.email,
        username: user.username,
        status: user.deleted || user.suspended ? 'Inactive' : 'Active',
        profileImageUrl: user.profileimageurl || null,
        courses: Array.isArray(courses) ? courses : [],
      },
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch student',
      },
      { status: 500 }
    );
  }
}
