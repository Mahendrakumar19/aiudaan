import { NextResponse } from 'next/server';
import { getUsers, createUser } from '@/service/moodleApi';
import { prisma } from '@/lib/prisma';

// GET /api/students - Fetch all students from Moodle
export async function GET(request) {
  try {
    console.log('📚 Fetching students strictly from Moodle...');
    let studentsArray = [];
    
    const users = await getUsers();
    const moodleUsers = users && users.users && Array.isArray(users.users)
      ? users.users
      : Array.isArray(users) ? users : [];

    moodleUsers.forEach(user => {
      studentsArray.push({
        id: String(user.id),
        name: `${user.firstname} ${user.lastname}`,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        username: user.username,
        phone: user.phone1 || user.phone2 || 'N/A',
        courses: [],
        joinDate: user.firstaccess 
          ? new Date(user.firstaccess * 1000).toLocaleDateString() 
          : 'Not accessed yet',
        lastAccess: user.lastaccess
          ? new Date(user.lastaccess * 1000).toLocaleDateString()
          : 'Never',
        profileImageUrl: user.profileimageurl || null,
        source: 'Moodle LMS'
      });
    });

    console.log('✅ Fetched students count from Moodle:', studentsArray.length);

    return NextResponse.json({
      success: true,
      data: studentsArray,
    });
  } catch (error) {
    console.error('❌ Moodle students fetch failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch students from Moodle LMS. Ensure core_user_get_users is enabled for your Web Service token.',
      data: [],
    }, { status: 500 });
  }
}


// POST /api/students - Create a new student in Moodle
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    // Split name into firstname and lastname
    const nameParts = (name || '').trim().split(' ');
    const firstname = nameParts[0] || 'Student';
    const lastname = nameParts.slice(1).join(' ') || 'User';

    const userData = {
      username: email?.split('@')[0] || 'student' + Date.now(),
      password: password || 'TempPass123!',
      firstname,
      lastname,
      email: email || `student${Date.now()}@example.com`,
    };

    const result = await createUser(userData);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Student created successfully',
    });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create student',
      },
      { status: 500 }
    );
  }
}
