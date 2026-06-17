import { NextResponse } from 'next/server';

const MOODLE_URL = (process.env.MOODLE_URL || '').replace(/\/+$/, '');
const ENDPOINT = `${MOODLE_URL}/webservice/rest/server.php`;

const TOKENS = {
  MOODLE_TOKEN: process.env.MOODLE_TOKEN,
  MOODLE_COURSE_TOKEN: process.env.MOODLE_COURSE_TOKEN,
  MOODLE_CREATE_USER_TOKEN: process.env.MOODLE_CREATE_USER_TOKEN,
  MOODLE_ENROL_TOKEN: process.env.MOODLE_ENROL_TOKEN,
  MOODLE_USER_MESSAGE_TOKEN: process.env.MOODLE_USER_MESSAGE_TOKEN,
};

async function testFunction(token: string, wsfunction: string, params: Record<string, string> = {}) {
  const formData = new URLSearchParams();
  formData.append('wstoken', token);
  formData.append('wsfunction', wsfunction);
  formData.append('moodlewsrestformat', 'json');

  Object.entries(params).forEach(([key, value]) => {
    formData.append(key, value);
  });

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!response.ok) {
      return { success: false, status: response.status, error: `HTTP status ${response.status}` };
    }

    const data = await response.json();
    if (data.exception || data.errorcode) {
      return {
        success: false,
        exception: data.exception,
        errorcode: data.errorcode,
        message: data.message,
      };
    }
    return { success: true, count: Array.isArray(data) ? data.length : (data.users ? data.users.length : 'yes') };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function GET() {
  if (!MOODLE_URL) {
    return NextResponse.json({ success: false, error: 'MOODLE_URL not configured' });
  }

  const results: Record<string, any> = {};

  for (const [tokenName, tokenValue] of Object.entries(TOKENS)) {
    if (!tokenValue) {
      results[tokenName] = { status: 'NOT_SET' };
      continue;
    }

    const maskedToken = `${tokenValue.substring(0, 8)}...`;
    
    // Test multiple functions
    const [courses, categories, usersWildcard, usersID1, usersByField, enrolledUsers] = await Promise.all([
      testFunction(tokenValue, 'core_course_get_courses'),
      testFunction(tokenValue, 'core_course_get_categories'),
      testFunction(tokenValue, 'core_user_get_users', { 'criteria[0][key]': 'email', 'criteria[0][value]': '%' }),
      testFunction(tokenValue, 'core_user_get_users', { 'criteria[0][key]': 'id', 'criteria[0][value]': '2' }), // specific ID query to check if wildcard is the issue
      testFunction(tokenValue, 'core_user_get_users_by_field', { 'field': 'username', 'values[0]': 'admin' }),
      testFunction(tokenValue, 'core_enrol_get_enrolled_users', { 'courseid': '2' })
    ]);

    results[tokenName] = {
      status: 'CONFIGURED',
      tokenMask: maskedToken,
      capabilities: {
        core_course_get_courses: courses,
        core_course_get_categories: categories,
        core_user_get_users_wildcard: usersWildcard,
        core_user_get_users_by_id2: usersID1,
        core_user_get_users_by_field: usersByField,
        core_enrol_get_enrolled_users: enrolledUsers,
      }
    };
  }

  return NextResponse.json({
    success: true,
    moodleUrl: MOODLE_URL,
    endpoint: ENDPOINT,
    results,
  });
}
