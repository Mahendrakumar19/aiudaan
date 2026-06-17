import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const bootcampType = searchParams.get('bootcampType') || 'all';
    const state = searchParams.get('state') || 'all';

    // Fetch all users who have registration-related details
    const users = await prisma.user.findMany({
      where: {
        role: 'student',
        OR: [
          { mobile: { not: null } },
          { class: { not: null } },
          { state: { not: null } }
        ]
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform and filter
    let registrations = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile || 'N/A',
      address: user.address || 'N/A',
      state: user.state || 'N/A',
      district: user.district || 'N/A',
      class: user.class || 'N/A',
      aiDomain: user.aiDomain || 'N/A',
      source: user.source || 'N/A',
      interest: user.interest || 'N/A',
      bootcampType: user.bootcampType || 'online',
      createdAt: user.createdAt.toISOString(),
    }));

    if (bootcampType !== 'all') {
      registrations = registrations.filter(
        (r) => r.bootcampType.toLowerCase() === bootcampType.toLowerCase()
      );
    }

    if (state !== 'all') {
      registrations = registrations.filter(
        (r) => r.state.toLowerCase() === state.toLowerCase()
      );
    }

    if (search) {
      registrations = registrations.filter(
        (r) =>
          r.name.toLowerCase().includes(search) ||
          r.email.toLowerCase().includes(search) ||
          r.mobile.toLowerCase().includes(search) ||
          r.state.toLowerCase().includes(search) ||
          r.district.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      data: registrations,
      total: registrations.length,
    });
  } catch (error: any) {
    console.error('❌ Error fetching registrations:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}
