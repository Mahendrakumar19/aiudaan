// Helper functions to interact with Moodle through Next.js API routes
// This avoids CORS issues by proxying requests through the Next.js backend

import axios from 'axios';

const moodleAPI = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Moodle operations can take longer
});

// ============= User Operations =============

/**
 * Get all users from Moodle via Next.js API route
 * @returns {Promise<{success: boolean, data: {users: Array, warnings: Array}}>}
 */
export const getMoodleUsers = async () => {
  try {
    const response = await moodleAPI.get('/students');
    return response.data; // { success, data, errorType?, fix? }
  } catch (error) {
    // Axios wraps non-2xx as error; extract the response body if available
    const body = error.response?.data;
    if (body) return body; // let the caller handle success:false
    const errorMessage = error.message || 'Failed to fetch users';
    throw new Error(errorMessage);
  }
};

/**
 * Create a new user in Moodle.
 * Routes through /api/students (Next.js server route) to avoid CORS.
 * The server route converts the payload to URLSearchParams and POSTs to
 * {MOODLE_URL}/webservice/rest/server.php
 *
 * Required Moodle params built server-side:
 *   wstoken, wsfunction=core_user_create_users, moodlewsrestformat=json
 *   users[0][username], users[0][password], users[0][firstname],
 *   users[0][lastname], users[0][email]
 *
 * @param {Object} userData
 * @param {string} [userData.username]  - Moodle username (falls back to email)
 * @param {string} userData.password    - 8+ chars, uppercase, lowercase, digit
 * @param {string} userData.firstname
 * @param {string} userData.lastname
 * @param {string} userData.email
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const createMoodleUser = async (userData) => {
  const { username, password, firstname, lastname, email } = userData;

  // ── 1. Required fields ───────────────────────────────────────────────────
  if (!firstname?.trim()) throw new Error('First name is required');
  if (!lastname?.trim())  throw new Error('Last name is required');
  if (!email?.trim())     throw new Error('Email address is required');
  if (!password)          throw new Error('Password is required');

  // ── 2. Email format ───────────────────────────────────────────────────────
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw new Error('Invalid email address');
  }

  // ── 3. Password policy (individual checks for actionable messages) ────────
  if (password.length < 8)     throw new Error('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) throw new Error('Password must contain at least one uppercase letter (A–Z)');
  if (!/[a-z]/.test(password)) throw new Error('Password must contain at least one lowercase letter (a–z)');
  if (!/[0-9]/.test(password)) throw new Error('Password must contain at least one number (0–9)');
  if (!/[@$!%*?&#^()_+\-=]/.test(password)) throw new Error('Password must contain at least one special character (e.g. @$!%*?&#)');

  // ── 4. Sanitize username — lowercase, no spaces, only Moodle-allowed chars ─
  //    Moodle allows: a-z 0-9 . _ - @
  const rawUsername = (username || email).toLowerCase().trim();
  const cleanUsername = rawUsername.replace(/\s+/g, '').replace(/[^a-z0-9._@-]/g, '');
  if (!cleanUsername || cleanUsername.length < 3) {
    throw new Error('Username must be at least 3 characters after removing invalid characters');
  }

  try {
    // POST JSON to our proxy route; the route converts to URLSearchParams for Moodle
    const response = await moodleAPI.post('/students', {
      username: cleanUsername,
      password,
      firstname: firstname.trim(),
      lastname:  lastname.trim(),
      email:     email.toLowerCase().trim(),
    });

    return response.data; // { success: true, data: [{id, username}] }
  } catch (error) {
    const errMsg = error.response?.data?.error || error.message || 'Failed to create user';

    // Map Moodle-specific errors to user-friendly messages
    if (/username.*exist|usernameexists/i.test(errMsg)) {
      throw new Error(`Username "${cleanUsername}" already exists. Please choose a different username.`);
    }
    if (/email.*exist|emailexists/i.test(errMsg)) {
      throw new Error(`Email "${email.trim()}" is already registered. Please use a different email address.`);
    }
    if (/access.*control|accesscontrolexception/i.test(errMsg)) {
      throw new Error(
        'Permission denied: the Moodle token does not have core_user_create_users permission. ' +
        'Fix in Moodle: Site admin → Server → Web services → External services → Add function.'
      );
    }
    if (/invalid.*param|invalidparameter/i.test(errMsg)) {
      throw new Error(`Moodle rejected the request (invalid parameter): ${errMsg}`);
    }

    throw new Error(errMsg);
  }
};

// ============= Course Operations =============

/**
 * Get courses from Moodle
 * @param {Object} options - Query options (e.g., { ids: [1, 2, 3] })
 * @returns {Promise} Courses data
 */
export const getMoodleCourses = async (options = {}) => {
  try {
    const params = new URLSearchParams();
    if (options.ids && Array.isArray(options.ids)) {
      params.append('ids', options.ids.join(','));
    }
    
    const response = await moodleAPI.get(`/courses?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error getting Moodle courses:', error);
    throw error;
  }
};

/**
 * Get course content (sections, modules, etc.)
 * @param {number} courseid - Course ID
 * @returns {Promise} Course content data
 */
export const getMoodleCourseContent = async (courseid) => {
  try {
    const response = await moodleAPI.get(`/courses?courseid=${courseid}`);
    return response.data;
  } catch (error) {
    console.error('Error getting Moodle course content:', error);
    throw error;
  }
};

/**
 * Create a new course in Moodle
 * @param {Object} courseData - Course information
 * @param {string} courseData.fullname - Full course name
 * @param {string} courseData.shortname - Short course name
 * @param {number} [courseData.categoryid] - Category ID (default: 1)
 * @param {string} [courseData.summary] - Course summary/description
 * @returns {Promise} Created course data
 */
export const createMoodleCourse = async (courseData) => {
  try {
    const response = await moodleAPI.post('/courses', courseData);
    return response.data;
  } catch (error) {
    console.error('Error creating Moodle course:', error);
    throw error;
  }
};

// ============= Enrollment Operations =============

/**
 * Enroll a user in a course
 * @param {Object} enrollmentData - Enrollment information
 * @param {number} enrollmentData.userid - User ID
 * @param {number} enrollmentData.courseid - Course ID
 * @param {number} [enrollmentData.roleid] - Role ID (default: 5 for student)
 * @returns {Promise} Enrollment result
 */
export const enrollMoodleUser = async (enrollmentData) => {
  try {
    const response = await moodleAPI.post('/enrollments', enrollmentData);
    return response.data;
  } catch (error) {
    console.error('Error enrolling user in Moodle:', error);
    throw error;
  }
};

// ============= Combined Operations =============

/**
 * Create a user and enroll them in a course (convenience function)
 * @param {Object} userData - User data
 * @param {number} courseid - Course ID to enroll in
 * @param {number} [roleid] - Role ID (default: 5 for student)
 * @returns {Promise} Object with user and enrollment data
 */
export const createAndEnrollUser = async (userData, courseid, roleid = 5) => {
  try {
    // First create the user
    const userResult = await createMoodleUser(userData);
    
    if (!userResult.success || !userResult.data || !userResult.data[0]) {
      throw new Error('Failed to create user or invalid response');
    }
    
    const userid = userResult.data[0].id;
    
    // Then enroll them in the course
    const enrollResult = await enrollMoodleUser({
      userid,
      courseid,
      roleid,
    });
    
    return {
      success: true,
      user: userResult.data[0],
      enrollment: enrollResult,
    };
  } catch (error) {
    console.error('Error creating and enrolling user:', error);
    throw error;
  }
};

// ============= Category Operations =============

/**
 * Get all categories from Moodle
 * @param {Object} options - Query options (e.g., { criteria: [{key: 'name', value: 'Science'}] })
 * @returns {Promise} Categories data
 */
export const getMoodleCategories = async (options = {}) => {
  try {
    const params = new URLSearchParams();
    if (options.criteria) {
      params.append('criteria', JSON.stringify(options.criteria));
    }
    
    const response = await moodleAPI.get(`/categories?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error getting Moodle categories:', error);
    throw error;
  }
};

/**
 * Create a new category in Moodle
 * @param {Object} categoryData - Category information
 * @param {string} categoryData.name - Category name
 * @param {number} [categoryData.parent] - Parent category ID (0 for top level)
 * @param {string} [categoryData.description] - Category description
 * @returns {Promise} Created category data
 */
export const createMoodleCategory = async (categoryData) => {
  try {
    const response = await moodleAPI.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating Moodle category:', error);
    throw error;
  }
};

/**
 * Update a category in Moodle
 * @param {number} categoryId - Category ID
 * @param {Object} categoryData - Updated category information
 * @param {string} [categoryData.name] - Category name
 * @param {string} [categoryData.description] - Category description
 * @returns {Promise} Updated category data
 */
export const updateMoodleCategory = async (categoryId, categoryData) => {
  try {
    const response = await moodleAPI.put('/categories', {
      id: categoryId,
      ...categoryData,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating Moodle category:', error);
    throw error;
  }
};

const moodleService = {
  // User operations
  getMoodleUsers,
  createMoodleUser,
  
  // Course operations
  getMoodleCourses,
  getMoodleCourseContent,
  createMoodleCourse,
  
  // Enrollment operations
  enrollMoodleUser,
  
  // Combined operations
  createAndEnrollUser,
  
  // Category operations
  getMoodleCategories,
  createMoodleCategory,
  updateMoodleCategory,
};

export default moodleService;
