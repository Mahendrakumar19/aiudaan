import { NextResponse } from 'next/server';

// Import the faculty data from the main route (in production, use a database)
// For now, we'll use a simple in-memory approach
let facultyData = [];

// GET: Fetch single faculty by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log(`✅ GET /api/faculty/${id} - Fetching faculty`);

    const faculty = facultyData.find(f => f.id === parseInt(id));

    if (!faculty) {
      return NextResponse.json(
        { success: false, message: 'Faculty not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: faculty,
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

// PUT: Update faculty by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    console.log(`📝 PUT /api/faculty/${id} - Updating faculty:`, body);

    const index = facultyData.findIndex(f => f.id === parseInt(id));

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Faculty not found' },
        { status: 404 }
      );
    }

    // Update faculty
    facultyData[index] = {
      ...facultyData[index],
      ...body,
      id: parseInt(id), // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    console.log('✅ Faculty updated successfully:', facultyData[index].id);
    return NextResponse.json({
      success: true,
      data: facultyData[index],
      message: 'Faculty updated successfully',
    });
  } catch (error) {
    console.error('❌ Error updating faculty:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update faculty' },
      { status: 500 }
    );
  }
}

// DELETE: Delete faculty by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    console.log(`🗑️ DELETE /api/faculty/${id} - Deleting faculty`);

    const index = facultyData.findIndex(f => f.id === parseInt(id));

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Faculty not found' },
        { status: 404 }
      );
    }

    facultyData.splice(index, 1);

    console.log('✅ Faculty deleted successfully');
    return NextResponse.json({
      success: true,
      message: 'Faculty deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting faculty:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete faculty' },
      { status: 500 }
    );
  }
}
