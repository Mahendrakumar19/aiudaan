import { NextResponse } from 'next/server';

// In-memory storage for faculty (replace with database in production)
let facultyData = [
  {
    id: 1,
    name: 'Dr. John Smith',
    email: 'john.smith@university.edu',
    phone: '+1234567890',
    expertise: 'Computer Science',
    profileImage: '/images/faculty-default.jpg',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Prof. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    phone: '+1234567891',
    expertise: 'Data Science',
    profileImage: '/images/faculty-default.jpg',
    createdAt: new Date().toISOString(),
  },
];

let nextId = 3;

// GET: Fetch all faculty
export async function GET() {
  try {
    console.log('✅ GET /api/faculty - Fetching all faculty');
    return NextResponse.json({
      success: true,
      data: facultyData,
      message: 'Faculty fetched successfully',
    });
  } catch (error) {
    console.error('❌ Error fetching faculty:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch faculty' },
      { status: 500 }
    );
  }
}

// POST: Create new faculty
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('📝 POST /api/faculty - Creating faculty:', body);

    // Validate required fields
    const { name, email, password, phone, expertise } = body;
    
    if (!name || !email || !password || !phone || !expertise) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingFaculty = facultyData.find(f => f.email === email);
    if (existingFaculty) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      );
    }

    // Create new faculty (in production, hash the password)
    const newFaculty = {
      id: nextId++,
      name,
      email,
      phone,
      expertise,
      profileImage: body.profileImage || '/images/faculty-default.jpg',
      createdAt: new Date().toISOString(),
    };

    facultyData.push(newFaculty);

    console.log('✅ Faculty created successfully:', newFaculty.id);
    return NextResponse.json({
      success: true,
      data: newFaculty,
      message: 'Faculty created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating faculty:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create faculty' },
      { status: 500 }
    );
  }
}

// DELETE: Delete all faculty (for testing)
export async function DELETE() {
  try {
    console.log('🗑️ DELETE /api/faculty - Deleting all faculty');
    facultyData = [];
    nextId = 1;
    return NextResponse.json({
      success: true,
      message: 'All faculty deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting faculty:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete faculty' },
      { status: 500 }
    );
  }
}
