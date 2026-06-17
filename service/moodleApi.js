// Moodle Web Services API utility
function getMoodleConfig() {
  const moodleUrl = (process.env.MOODLE_URL || '').replace(/\/+$/, '');
  const moodleToken = process.env.MOODLE_TOKEN;
  const moodleCourseToken = process.env.MOODLE_COURSE_TOKEN;
  const moodleCreateUserToken = process.env.MOODLE_CREATE_USER_TOKEN;
  const moodleUserMessageToken = process.env.MOODLE_USER_MESSAGE_TOKEN;

  if (!moodleUrl) {
    throw new Error('MOODLE_URL environment variable is not set');
  }

  return {
    moodleUrl,
    moodleToken,
    moodleCourseToken,
    moodleCreateUserToken,
    moodleUserMessageToken,
    moodleRestEndpoint: `${moodleUrl}/webservice/rest/server.php`,
  };
}

function isInvalidTokenError(data = {}) {
  const text = `${data.exception || ''} ${data.errorcode || ''} ${data.message || ''}`.toLowerCase();
  return text.includes('invalidtoken') || text.includes('invalid token');
}

function isAccessControlError(data = {}) {
  const text = `${data.exception || ''} ${data.errorcode || ''} ${data.message || ''}`.toLowerCase();
  return text.includes('accessexception') || text.includes('accesscontrolexception') || text.includes('access control');
}

/**
 * Base function to make Moodle API calls
 * @param {string} wsfunction - The Moodle web service function name
 * @param {object} params - Parameters for the function
 * @param {string} customToken - Optional custom token to use instead of default
 * @returns {Promise<any>} - JSON response from Moodle
 */
async function moodleRequest(wsfunction, params = {}, customToken = null) {
  const { moodleToken, moodleCourseToken, moodleRestEndpoint } = getMoodleConfig();
  const token = customToken || moodleToken || moodleCourseToken;
  
  if (!token) {
    throw new Error('No Moodle token configured. Set MOODLE_TOKEN or MOODLE_COURSE_TOKEN in .env.local');
  }

  // Create FormData for POST request
  const formData = new URLSearchParams();
  formData.append('wstoken', token);
  formData.append('wsfunction', wsfunction);
  formData.append('moodlewsrestformat', 'json');

  // Add custom parameters
  Object.keys(params).forEach(key => {
    formData.append(key, params[key]);
  });

  console.log('🔄 Moodle Request:', {
    endpoint: moodleRestEndpoint,
    wsfunction,
    params: Object.keys(params),
    token: token ? `${token.substring(0, 10)}...` : 'NOT SET',
  });

  try {
    const response = await fetch(moodleRestEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    console.log('📡 Moodle HTTP Response Status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 Moodle Response Data:', data);

    // Check for Moodle error response
    if (data.exception || data.errorcode) {
      if (isInvalidTokenError(data)) {
        throw new Error(
          'INVALID_TOKEN: Moodle token is invalid or lacks access. Update MOODLE_TOKEN in .env.local and restart the server.'
        );
      }

      if (isAccessControlError(data)) {
        throw new Error(
          `ACCESS_CONTROL: Token lacks permission for ${wsfunction}. Configure this function in Moodle External Services.`
        );
      }

      const errorDetails = {
        exception: data.exception,
        message: data.message,
        debuginfo: data.debuginfo,
        errorcode: data.errorcode
      };
      console.error('🚨 Moodle API Error Details:', errorDetails);
      
      // Include debug info in the error message for easier troubleshooting
      const errorMsg = data.debuginfo 
        ? `${data.message || data.exception}\nDebug: ${data.debuginfo}`
        : data.message || data.exception;
      
      throw new Error(`Moodle API Error: ${errorMsg}`);
    }

    return data;
  } catch (error) {
    console.error('❌ Moodle API request failed:', error);
    throw error;
  }
}

/**
 * Create a new user in Moodle
 * @param {object} user - User details
 * @param {string} user.username - Username
 * @param {string} user.password - Password
 * @param {string} user.firstname - First name
 * @param {string} user.lastname - Last name
 * @param {string} user.email - Email address
 * @returns {Promise<any>} - Created user data
 */
export async function createUser(user) {
  const { moodleCreateUserToken, moodleRestEndpoint } = getMoodleConfig();

  if (!moodleCreateUserToken) {
    throw new Error(
      'MOODLE_CREATE_USER_TOKEN is not set. Add it to .env.local and restart the server.'
    );
  }

  // Moodle username rules: lowercase alphanumeric, underscore, hyphen, period, @
  // Use email as username if no explicit username provided (common Moodle pattern)
  const rawUsername = (user.username || user.email || '').toLowerCase().trim();
  // Strip only truly disallowed characters (keep . - @ _)
  const cleanUsername = rawUsername.replace(/[^a-z0-9._@-]/g, '');

  if (!cleanUsername) {
    throw new Error('Invalid username: could not derive a valid Moodle username.');
  }

  // Pre-flight: check if email already exists in Moodle (best-effort).
  // This surfaces a clear duplicate-email message instead of the generic
  // "Invalid parameter value detected" that Moodle returns for duplicates.
  try {
    const checkBody = new URLSearchParams();
    checkBody.append('wstoken', moodleCreateUserToken);
    checkBody.append('wsfunction', 'core_user_get_users');
    checkBody.append('moodlewsrestformat', 'json');
    checkBody.append('criteria[0][key]', 'email');
    checkBody.append('criteria[0][value]', user.email.toLowerCase().trim());

    const checkRes = await fetch(moodleRestEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: checkBody.toString(),
    });
    const checkData = await checkRes.json();

    if (!checkData.exception && Array.isArray(checkData.users) && checkData.users.length > 0) {
      throw new Error(
        `Email "${user.email.trim()}" is already registered in Moodle. ` +
        'Please use a different email address.'
      );
    }
  } catch (err) {
    // Re-throw duplicate-email errors; silently skip if the check itself fails
    // (e.g. token lacks core_user_get_users permission)
    if (/already registered/i.test(err.message)) throw err;
    console.warn('⚠️ Pre-flight email check skipped:', err.message);
  }

  // Build request exactly as Moodle expects — only the 5 required fields
  const params = new URLSearchParams();
  params.append('wstoken', moodleCreateUserToken);
  params.append('wsfunction', 'core_user_create_users');
  params.append('moodlewsrestformat', 'json');
  params.append('users[0][username]', cleanUsername);
  params.append('users[0][password]', user.password);
  params.append('users[0][firstname]', user.firstname.trim());
  params.append('users[0][lastname]', user.lastname.trim());
  params.append('users[0][email]', user.email.toLowerCase().trim());

  console.log('🔵 Moodle createUser → server.php', {
    endpoint: moodleRestEndpoint,
    wsfunction: 'core_user_create_users',
    username: cleanUsername,
    email: user.email.toLowerCase().trim(),
    token: `${moodleCreateUserToken.substring(0, 10)}...`,
  });

  const response = await fetch(moodleRestEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Moodle server returned HTTP ${response.status}`);
  }

  const data = await response.json();
  console.log('📦 Moodle createUser response:', data);

  if (data.exception || data.errorcode) {
      let msg = data.debuginfo
        ? `${data.message || data.exception} | Debug: ${data.debuginfo}`
        : data.message || data.exception;

      // Moodle returns the generic "invalidparameter" code for duplicate
      // email/username AND for password policy violations. Append guidance.
      if (data.errorcode === 'invalidparameter') {
        msg +=
          ' — Likely causes: (1) this email or username already exists in Moodle,' +
          ' (2) password does not meet Moodle\'s policy' +
          ' (must include uppercase, lowercase, a number AND a special character, e.g. Test@1234).';
      }

      throw new Error(`Moodle API Error: ${msg}`);

  }

  return data;
}

/**
 * Get users from Moodle
 * @param {object} criteria - Search criteria
 * @param {string} criteria.key - Search key (e.g., 'email', 'username', 'id')
 * @param {string} criteria.value - Search value
 * @returns {Promise<any>} - List of users
 */
export async function getUsers(criteria = {}) {
  const { moodleToken, moodleCourseToken, moodleCreateUserToken, moodleUserMessageToken } = getMoodleConfig();

  const params = {};

  if (!criteria.key && !criteria.value) {
    params['criteria[0][key]'] = 'email';
    params['criteria[0][value]'] = '%';
  } else {
    params['criteria[0][key]'] = criteria.key;
    params['criteria[0][value]'] = criteria.value;
  }

  // Try every available token in priority order.
  // Whichever token's Web Service has core_user_get_users allowed will succeed.
  const tokensToTry = [
    { name: 'MOODLE_USER_MESSAGE_TOKEN', value: moodleUserMessageToken },
    { name: 'MOODLE_TOKEN', value: moodleToken },
    { name: 'MOODLE_COURSE_TOKEN', value: moodleCourseToken },
    { name: 'MOODLE_CREATE_USER_TOKEN', value: moodleCreateUserToken },
    { name: 'MOODLE_PAYMENT_TOKEN', value: process.env.MOODLE_PAYMENT_TOKEN },
    { name: 'MOODLE_ENROL_TOKEN', value: process.env.MOODLE_ENROL_TOKEN },
  ].filter(t => t.value);

  if (tokensToTry.length === 0) {
    throw new Error('No Moodle tokens configured. Set MOODLE_TOKEN in .env.local');
  }

  let lastError;
  for (const { name, value } of tokensToTry) {
    try {
      console.log(`🔑 Trying token: ${name}`);
      const result = await moodleRequest('core_user_get_users', params, value);
      console.log(`✅ Token ${name} has core_user_get_users permission`);
      return result;
    } catch (err) {
      console.warn(`⚠️ Token ${name} failed: ${err.message}`);
      lastError = err;
    }
  }

  // Fallback: If core_user_get_users failed (due to Moodle's invalidresponse exception),
  // compile a unique list of users from all active course enrollments.
  console.log('🔄 Fallback: Fetching students via course enrollments (core_enrol_get_enrolled_users)...');
  try {
    const coursesResult = await getCourses();
    const courses = Array.isArray(coursesResult) ? coursesResult : [];
    const uniqueUsers = new Map();

    const enrolToken = process.env.MOODLE_ENROL_TOKEN || moodleToken || moodleCourseToken;

    for (const course of courses) {
      if (course.id === 1) continue; // Skip default site course
      try {
        const enrolledUsers = await moodleRequest('core_enrol_get_enrolled_users', {
          courseid: course.id
        }, enrolToken);

        if (Array.isArray(enrolledUsers)) {
          enrolledUsers.forEach(u => {
            if (!uniqueUsers.has(u.id)) {
              uniqueUsers.set(u.id, u);
            }
          });
        }
      } catch (enrolErr) {
        console.warn(`⚠️ Failed to fetch enrolled users for course ${course.id}:`, enrolErr.message);
      }
    }

    if (uniqueUsers.size > 0) {
      console.log(`✅ Enrollment-based fallback succeeded: gathered ${uniqueUsers.size} unique users`);
      return { users: Array.from(uniqueUsers.values()) };
    }
  } catch (fallbackErr) {
    console.error('❌ Course enrollment fallback failed:', fallbackErr.message);
  }

  // All tokens failed — throw a helpful error with Moodle admin instructions
  throw new Error(
    'ACCESS_CONTROL: No token has working core_user_get_users permission and enrollment fallback failed. ' +
    'Fix in Moodle: Site admin → Server → Web services → External services → ' +
    'Edit your service → Add function: core_user_get_users'
  );
}

/**
 * Get users by a specific field using core_user_get_users_by_field
 * @param {string} field - One of: id, username, email, idnumber
 * @param {string|number|Array<string|number>} values - Value(s) to search
 * @returns {Promise<any[]>} - Array of users
 */
export async function getUsersByField(field, values) {
  const valueList = Array.isArray(values) ? values : [values];
  const params = {
    field,
  };

  valueList.forEach((value, index) => {
    params[`values[${index}]`] = value;
  });

  return await moodleRequest('core_user_get_users_by_field', params);
}

/**
 * Delete users in Moodle
 * @param {number[]|number} userids - Moodle user IDs
 * @returns {Promise<any>} - Moodle response
 */
export async function deleteUsers(userids) {
  const ids = Array.isArray(userids) ? userids : [userids];
  const params = {};

  ids.forEach((id, index) => {
    params[`userids[${index}]`] = Number(id);
  });

  return await moodleRequest('core_user_delete_users', params);
}

/**
 * Get all courses enrolled by a user
 * @param {number} userid - Moodle user ID
 * @returns {Promise<any[]>}
 */
export async function getUserEnrolledCourses(userid) {
  return await moodleRequest('core_enrol_get_users_courses', {
    userid: Number(userid),
  });
}

/**
 * Create a new course in Moodle
 * @param {object} course - Course details
 * @param {string} course.fullname - Full course name
 * @param {string} course.shortname - Short course name
 * @param {number} course.categoryid - Category ID
 * @param {string} [course.summary] - Course summary
 * @param {number} [course.visible] - Course visibility (0 or 1)
 * @param {number} [course.price] - Course price (stored in custom field)
 * @returns {Promise<any>} - Created course data
 */
export async function createCourse(course) {
  const params = {
    'courses[0][fullname]': course.fullname,
    'courses[0][shortname]': course.shortname,
    'courses[0][categoryid]': course.categoryid || 1,
  };

  if (course.summary) {
    params['courses[0][summary]'] = course.summary;
  }

  if (course.visible !== undefined) {
    params['courses[0][visible]'] = course.visible;
  }

  // Add custom fields if price is provided
  if (course.price !== undefined) {
    params['courses[0][customfields][0][shortname]'] = 'cost';
    params['courses[0][customfields][0][value]'] = `<p>${course.price}</p>`;
  }

  return await moodleRequest('core_course_create_courses', params);
}

/**
 * Enroll a user in a course
 * @param {object} enrollment - Enrollment details
 * @param {number} enrollment.userid - User ID
 * @param {number} enrollment.courseid - Course ID
 * @param {number} [enrollment.roleid] - Role ID (default: 5 for student)
 * @returns {Promise<any>} - Enrollment result
 */
export async function enrollUser(enrollment) {
  const params = {
    'enrolments[0][roleid]': enrollment.roleid || 5, // 5 is typically the student role
    'enrolments[0][userid]': enrollment.userid,
    'enrolments[0][courseid]': enrollment.courseid,
  };

  return await moodleRequest('enrol_manual_enrol_users', params);
}

/**
 * Unenroll a user from a course
 * @param {object} enrollment - Enrollment details
 * @param {number} enrollment.userid - User ID
 * @param {number} enrollment.courseid - Course ID
 * @param {number} [enrollment.roleid] - Role ID (default: 5 for student)
 * @returns {Promise<any>} - Unenrollment result
 */
export async function unenrollUser(enrollment) {
  const params = {
    'enrolments[0][roleid]': enrollment.roleid || 5,
    'enrolments[0][userid]': enrollment.userid,
    'enrolments[0][courseid]': enrollment.courseid,
  };

  return await moodleRequest('enrol_manual_unenrol_users', params);
}

/**
 * Get enrolled users for a course
 * @param {number} courseid - Course ID
 * @returns {Promise<any[]>}
 */
export async function getEnrolledUsers(courseid) {
  return await moodleRequest('core_enrol_get_enrolled_users', {
    courseid: Number(courseid),
  });
}

/**
 * Get all courses or filter by criteria
 * @param {object} options - Query options
 * @param {array} [options.ids] - Array of course IDs to fetch
 * @returns {Promise<any>} - List of courses
 */
export async function getCourses(options = {}) {
  const params = {};

  if (options.ids && Array.isArray(options.ids)) {
    options.ids.forEach((id, index) => {
      params[`options[ids][${index}]`] = id;
    });
  }

  return await moodleRequest('core_course_get_courses', params);
}

/**
 * Get course content (sections, modules, etc.)
 * @param {number} courseid - Course ID
 * @param {object} [options] - Additional options
 * @returns {Promise<any>} - Course content structure
 */
export async function getCourseContent(courseid, options = {}) {
  const params = {
    courseid: courseid,
  };

  // Add optional parameters if provided
  if (options.sectionid !== undefined) {
    params.sectionid = options.sectionid;
  }
  if (options.sectionnumber !== undefined) {
    params.sectionnumber = options.sectionnumber;
  }

  return await moodleRequest('core_course_get_contents', params);
}

/**
 * Update an existing course in Moodle
 * @param {object} course - Course details with id
 * @param {number} course.id - Course ID
 * @param {string} [course.fullname] - Full course name
 * @param {string} [course.shortname] - Short course name
 * @param {number} [course.categoryid] - Category ID
 * @param {string} [course.summary] - Course summary
 * @param {number} [course.visible] - Course visibility (0 or 1)
 * @returns {Promise<any>} - Updated course data
 */
export async function updateCourse(course) {
  const params = {
    'courses[0][id]': course.id,
  };

  if (course.fullname !== undefined) {
    params['courses[0][fullname]'] = course.fullname;
  }
  if (course.shortname !== undefined) {
    params['courses[0][shortname]'] = course.shortname;
  }
  if (course.categoryid !== undefined) {
    params['courses[0][categoryid]'] = course.categoryid;
  }
  if (course.summary !== undefined) {
    params['courses[0][summary]'] = course.summary;
  }
  if (course.visible !== undefined) {
    params['courses[0][visible]'] = course.visible;
  }

  return await moodleRequest('core_course_update_courses', params);
}

/**
 * Delete a course from Moodle
 * @param {number} courseid - Course ID to delete
 * @returns {Promise<any>} - Deletion result
 */
export async function deleteCourse(courseid) {
  const params = {
    'courseids[0]': courseid,
  };

  return await moodleRequest('core_course_delete_courses', params);
}

/**
 * Get all categories from Moodle
 * @param {object} options - Query options
 * @param {array} [options.criteria] - Array of criteria objects with key/value pairs
 * @returns {Promise<any>} - List of categories
 */
export async function getCategories(options = {}) {
  const params = {};

  // Add criteria if provided
  if (options.criteria && Array.isArray(options.criteria)) {
    options.criteria.forEach((criterion, index) => {
      if (criterion.key) {
        params[`criteria[${index}][key]`] = criterion.key;
        params[`criteria[${index}][value]`] = criterion.value || '';
      }
    });
  }

  return await moodleRequest('core_course_get_categories', params);
}

/**
 * Create a new category in Moodle
 * @param {object} category - Category details
 * @param {string} category.name - Category name
 * @param {number} [category.parent] - Parent category ID (0 for top level)
 * @param {string} [category.description] - Category description
 * @returns {Promise<any>} - Created category data
 */
export async function createCategory(category) {
  const params = {
    'categories[0][name]': category.name,
    'categories[0][parent]': category.parent || 0,
  };

  if (category.description) {
    params['categories[0][description]'] = category.description;
  }

  return await moodleRequest('core_course_create_categories', params);
}

/**
 * Update a category in Moodle
 * @param {object} category - Category details with id
 * @param {number} category.id - Category ID
 * @param {string} [category.name] - Category name
 * @param {string} [category.description] - Category description
 * @returns {Promise<any>} - Updated category data
 */
export async function updateCategory(category) {
  const params = {
    'categories[0][id]': category.id,
  };

  if (category.name !== undefined) {
    params['categories[0][name]'] = category.name;
  }

  if (category.description !== undefined) {
    params['categories[0][description]'] = category.description;
  }

  return await moodleRequest('core_course_update_categories', params);
}

/**
 * Delete a category from Moodle
 * @param {number} categoryid - Category ID to delete
 * @returns {Promise<any>} - Deletion result
 */
export async function deleteCategory(categoryid) {
  const params = {
    'categories[0][id]': categoryid,
    'categories[0][recursive]': 0, // Don't delete courses, just move them
  };

  return await moodleRequest('core_course_delete_categories', params);
}

// Export default object with all functions
const moodleApi = {
  createUser,
  getUsers,
  getUsersByField,
  deleteUsers,
  getUserEnrolledCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollUser,
  unenrollUser,
  getEnrolledUsers,
  getCourses,
  getCourseContent,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default moodleApi;
