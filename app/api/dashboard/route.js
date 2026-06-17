import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { getUsers, getCourses } from '@/service/moodleApi';

const MOODLE_URL = (process.env.MOODLE_URL || '').replace(/\/+$/, '');
const MOODLE_REST_ENDPOINT = `${MOODLE_URL}/webservice/rest/server.php`;

const MOODLE_TOKENS = [
  process.env.MOODLE_USER_MESSAGE_TOKEN,
  process.env.MOODLE_TOKEN,
  process.env.MOODLE_COURSE_TOKEN,
  process.env.MOODLE_CREATE_USER_TOKEN,
  process.env.MOODLE_PAYMENT_TOKEN,
  process.env.MOODLE_ENROL_TOKEN,
].filter(Boolean);

function formatDateFromUnix(unixSeconds) {
  if (!unixSeconds || Number.isNaN(Number(unixSeconds))) return null;
  return new Date(Number(unixSeconds) * 1000).toISOString();
}

function mapUserStatus(user) {
  if (!user || user.deleted || user.suspended) return 'Inactive';
  return 'Active';
}

function isRealCourse(course) {
  return Boolean(course) && course.format !== 'site' && Number(course.id) !== 1;
}

function toCurrencyAmount(amountInSmallestUnit) {
  return Number((amountInSmallestUnit / 100).toFixed(2));
}

function isInvalidTokenError(data = {}) {
  const text = `${data.exception || ''} ${data.errorcode || ''} ${data.message || ''}`.toLowerCase();
  return text.includes('invalidtoken') || text.includes('invalid token');
}

function isAccessControlError(data = {}) {
  const text = `${data.exception || ''} ${data.errorcode || ''} ${data.message || ''}`.toLowerCase();
  return text.includes('accessexception') || text.includes('accesscontrolexception') || text.includes('access control');
}

async function moodleRequestWithToken(token, wsfunction, params = {}) {
  const formData = new URLSearchParams();
  formData.append('wstoken', token);
  formData.append('wsfunction', wsfunction);
  formData.append('moodlewsrestformat', 'json');

  Object.entries(params).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  const response = await fetch(MOODLE_REST_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    throw new Error(`Moodle request failed (${response.status})`);
  }

  const data = await response.json();

  if (data?.exception || data?.errorcode) {
    if (isInvalidTokenError(data)) {
      throw new Error(
        'INVALID_TOKEN: Moodle token is invalid or no longer valid for this instance. Update MOODLE_TOKEN in .env.local and restart the server.'
      );
    }

    if (isAccessControlError(data)) {
      throw new Error(
        `ACCESS_CONTROL: Token lacks permission for ${wsfunction}. Configure this function in Moodle External Services.`
      );
    }

    throw new Error(data?.message || data?.exception || 'Unknown Moodle API error');
  }

  return data;
}

async function moodleRequest(wsfunction, params = {}) {
  if (!MOODLE_URL) {
    throw new Error('MOODLE_URL environment variable is not set');
  }

  if (MOODLE_TOKENS.length === 0) {
    throw new Error('No Moodle token configured. Set MOODLE_TOKEN in .env.local');
  }

  let lastError = null;
  for (const token of MOODLE_TOKENS) {
    try {
      return await moodleRequestWithToken(token, wsfunction, params);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('All Moodle tokens failed');
}

async function getMoodleUsers() {
  try {
    const result = await getUsers();
    return Array.isArray(result?.users) ? result.users : (Array.isArray(result) ? result : []);
  } catch (error) {
    console.error('Dashboard getMoodleUsers failed:', error);
    return [];
  }
}

async function getMoodleCourses() {
  try {
    const result = await getCourses();
    return Array.isArray(result) ? result.filter(isRealCourse) : [];
  } catch (error) {
    console.error('Dashboard getMoodleCourses failed:', error);
    return [];
  }
}

async function getRecentEnrollments(courses, limit = 5) {
  const sortedCourses = [...courses].sort((a, b) => (b.id || 0) - (a.id || 0));
  const selectedCourses = sortedCourses.slice(0, 10);

  const enrollments = [];

  for (const course of selectedCourses) {
    if (enrollments.length >= limit) break;

    try {
      const enrolledUsers = await moodleRequest('core_enrol_get_enrolled_users', {
        courseid: course.id,
      });

      if (!Array.isArray(enrolledUsers) || enrolledUsers.length === 0) continue;

      for (const user of enrolledUsers) {
        if (enrollments.length >= limit) break;

        enrollments.push({
          id: `${course.id}-${user.id}`,
          studentName: `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.fullname || 'Unknown Student',
          courseName: course.fullname || `Course #${course.id}`,
          enrollmentDate:
            formatDateFromUnix(user.lastcourseaccess) ||
            formatDateFromUnix(user.firstaccess) ||
            null,
          status: mapUserStatus(user),
          email: user.email || '',
        });
      }
    } catch {
      // Skip course-level errors to keep dashboard resilient.
      continue;
    }
  }

  return enrollments.slice(0, limit);
}

async function getRazorpayAnalytics() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      monthlyGrowthPercentage: 0,
    };
  }

  const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;

  const fetchRazorpayPayments = async (count, skip) => {
    const response = await fetch(
      `https://api.razorpay.com/v1/payments?count=${count}&skip=${skip}`,
      {
        method: 'GET',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Razorpay payments request failed (${response.status})`);
    }

    return response.json();
  };

  const allPayments = [];
  const pageSize = 100;
  let skip = 0;
  let safetyCounter = 0;

  while (safetyCounter < 20) {
    const response = await fetchRazorpayPayments(pageSize, skip);
    const payments = Array.isArray(response?.items) ? response.items : [];

    allPayments.push(...payments);

    if (payments.length < pageSize) break;

    skip += pageSize;
    safetyCounter += 1;
  }

  const successfulPayments = allPayments.filter((payment) => payment.status === 'captured');

  const totalRevenueSmallest = successfulPayments.reduce(
    (sum, payment) => sum + (Number(payment.amount) || 0),
    0
  );

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();

  const currentMonthRevenueSmallest = successfulPayments.reduce((sum, payment) => {
    const createdAtMs = Number(payment.created_at || 0) * 1000;
    if (createdAtMs >= currentMonthStart) {
      return sum + (Number(payment.amount) || 0);
    }
    return sum;
  }, 0);

  const previousMonthRevenueSmallest = successfulPayments.reduce((sum, payment) => {
    const createdAtMs = Number(payment.created_at || 0) * 1000;
    if (createdAtMs >= previousMonthStart && createdAtMs < currentMonthStart) {
      return sum + (Number(payment.amount) || 0);
    }
    return sum;
  }, 0);

  const monthlyGrowthPercentage =
    previousMonthRevenueSmallest > 0
      ? Number(
          (((currentMonthRevenueSmallest - previousMonthRevenueSmallest) /
            previousMonthRevenueSmallest) *
            100).toFixed(2)
        )
      : currentMonthRevenueSmallest > 0
      ? 100
      : 0;

  return {
    totalRevenue: toCurrencyAmount(totalRevenueSmallest),
    totalOrders: allPayments.length,
    monthlyGrowthPercentage,
  };
}

export async function GET() {
  try {
    const [usersResult, coursesResult, revenueResult] = await Promise.allSettled([
      getMoodleUsers(),
      getMoodleCourses(),
      getRazorpayAnalytics(),
    ]);

    let users = usersResult.status === 'fulfilled' ? usersResult.value : [];
    if (users.length === 0) {
      try {
        const localUsers = await prisma.user.findMany({
          where: { role: 'student' },
          orderBy: { createdAt: 'desc' },
        });
        users = localUsers.map((user) => {
          const nameParts = (user.name || '').trim().split(' ');
          const firstname = nameParts[0] || 'Student';
          const lastname = nameParts.slice(1).join(' ') || 'User';
          return {
            id: user.id,
            firstname,
            lastname,
            email: user.email,
            username: user.email.split('@')[0],
            phone1: user.mobile || 'N/A',
            firstaccess: Math.floor(new Date(user.createdAt).getTime() / 1000),
            lastaccess: Math.floor(new Date(user.updatedAt).getTime() / 1000),
            profileimageurl: user.image || null,
          };
        });
      } catch (dbErr) {
        console.warn('⚠️ Fallback: failed to fetch local users for dashboard:', dbErr.message);
      }
    }
    const courses = coursesResult.status === 'fulfilled' ? coursesResult.value : [];
    const revenueData =
      revenueResult.status === 'fulfilled'
        ? revenueResult.value
        : { totalRevenue: 0, totalOrders: 0, monthlyGrowthPercentage: 0 };

    const warnings = [];
    if (usersResult.status === 'rejected') {
      warnings.push(`users: ${usersResult.reason?.message || 'failed to fetch users'}`);
    }
    if (coursesResult.status === 'rejected') {
      warnings.push(`courses: ${coursesResult.reason?.message || 'failed to fetch courses'}`);
    }
    if (revenueResult.status === 'rejected') {
      warnings.push(`revenue: ${revenueResult.reason?.message || 'failed to fetch revenue'}`);
    }

    const recentEnrollments = await getRecentEnrollments(courses, 5);

    const latestUsers = [...users]
      .sort((a, b) => {
        const aTs = Number(a.lastaccess || a.firstaccess || 0);
        const bTs = Number(b.lastaccess || b.firstaccess || 0);
        return bTs - aTs;
      })
      .slice(0, 5);

    const courseByEmail = new Map();
    for (const enrollment of recentEnrollments) {
      if (enrollment.email && !courseByEmail.has(enrollment.email)) {
        courseByEmail.set(enrollment.email, enrollment.courseName);
      }
    }

    const recentStudents = latestUsers.map((user) => ({
      id: user.id,
      avatar: user.profileimageurl || null,
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      name: `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.fullname || 'Unknown',
      email: user.email || '',
      course: courseByEmail.get(user.email || '') || 'Not Enrolled',
      enrollmentDate:
        formatDateFromUnix(user.firstaccess) ||
        formatDateFromUnix(user.lastaccess) ||
        null,
      status: mapUserStatus(user),
    }));

    // Fetch Hostinger MySQL registered users count
    let localUsersCount = 0;
    try {
      localUsersCount = await prisma.user.count();
    } catch (dbErr) {
      console.warn('⚠️ Hostinger DB user count fetch failed:', dbErr.message);
    }

    return NextResponse.json({
      totalStudents: users.length,
      totalLocalUsers: localUsersCount,
      totalCourses: courses.length,
      totalRevenue: revenueData.totalRevenue,
      totalOrders: revenueData.totalOrders,
      monthlyGrowthPercentage: revenueData.monthlyGrowthPercentage,
      recentStudents,
      recentEnrollments,
      warnings,
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to load dashboard analytics',
      },
      { status: 500 }
    );
  }
}
