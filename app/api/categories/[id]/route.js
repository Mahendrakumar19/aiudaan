import { NextResponse } from 'next/server';
import { getCategories, updateCategory, deleteCategory } from '@/service/moodleApi';

// GET /api/categories/[id] - Fetch single category by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const categories = await getCategories({
      criteria: [{ key: 'id', value: String(id) }],
    });

    const category = Array.isArray(categories) ? categories[0] : null;
    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category fetched successfully',
    });
  } catch (error) {
    console.error('❌ Error fetching category:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update category by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    await updateCategory({
      id: Number(id),
      name: body.name,
      description: body.description,
    });

    return NextResponse.json({
      success: true,
      data: { id: parseInt(id), ...body, updatedAt: new Date().toISOString() },
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('❌ Error updating category:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete category by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await deleteCategory(Number(id));

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}
