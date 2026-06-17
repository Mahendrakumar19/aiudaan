import { NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/service/moodleApi';
import { prisma } from '@/lib/prisma';

// GET /api/categories - Fetch Moodle categories
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').trim().toLowerCase();

    let categories = [];
    try {
      categories = await getCategories();
    } catch (moodleError) {
      console.warn('⚠️ Moodle categories fetch failed, falling back to local DB distinct categories:', moodleError.message);
      try {
        const localCourses = await prisma.course.findMany({
          select: { category: true },
          distinct: ['category'],
        });
        const distinctNames = localCourses
          .map((c) => c.category || 'General')
          .filter((v, i, a) => a.indexOf(v) === i);

        categories = distinctNames.map((name, index) => ({
          id: index + 100, // Offset to avoid overlapping with default/Moodle IDs if mixed
          name: name,
          parent: 0,
          description: `Category: ${name}`,
        }));
      } catch (dbErr) {
        console.error('❌ Failed to fetch distinct course categories from DB:', dbErr.message);
      }

      if (categories.length === 0) {
        categories = [
          { id: 1, name: 'General', parent: 0, description: 'Default Category' },
          { id: 2, name: 'React', parent: 0, description: 'React Category' },
          { id: 3, name: 'AI/ML', parent: 0, description: 'AI & Machine Learning' },
        ];
      }
    }

    const list = Array.isArray(categories) ? categories : [];

    const filtered = search
      ? list.filter((category) =>
          category.name?.toLowerCase().includes(search) ||
          String(category.id).includes(search)
        )
      : list;

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
      message: 'Categories fetched successfully',
    });
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}


// POST /api/categories - Create Moodle category
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, parent } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Category name is required' },
        { status: 400 }
      );
    }

    const result = await createCategory({
      name,
      description: description || '',
      parent: Number(parent || 0),
    });

    return NextResponse.json(
      {
        success: true,
        data: Array.isArray(result) ? result[0] : result,
        message: 'Category created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error creating category:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}
