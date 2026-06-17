import { NextResponse } from 'next/server';
import { getCourses } from '@/service/moodleApi';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🔄 Triggering manual Moodle to local DB course sync...');
    
    // Fetch latest courses from Moodle
    const moodleCourses = await getCourses();
    const coursesArray = Array.isArray(moodleCourses) ? moodleCourses : [];
    
    if (coursesArray.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No courses found in Moodle to sync.',
        count: 0
      });
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (const mc of coursesArray) {
      if (mc.format === 'site' || mc.id === 1) continue;

      const summaryClean = mc.summary ? mc.summary.replace(/<[^>]*>/g, '').trim() : '';

      // Check if course exists in our DB by moodleId
      let localCourse = await prisma.course.findUnique({
        where: { moodleId: mc.id }
      });

      if (!localCourse) {
        await prisma.course.create({
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
        createdCount++;
      } else {
        await prisma.course.update({
          where: { id: localCourse.id },
          data: {
            title: mc.fullname || mc.displayname || localCourse.title,
            description: summaryClean || localCourse.description,
          }
        });
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Course synchronization completed. Created ${createdCount} and updated ${updatedCount} courses locally.`,
      created: createdCount,
      updated: updatedCount,
    });
  } catch (error) {
    console.error('❌ Error in courses manual sync route:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Sync failed',
    }, { status: 500 });
  }
}
