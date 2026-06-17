import { logger } from './logger'

const MOODLE_URL = process.env.MOODLE_URL || 'https://moodle.aiudaanbootcamp.com'
const MOODLE_WSTOKEN = process.env.MOODLE_CREATE_USER_TOKEN || process.env.MOODLE_TOKEN || process.env.MOODLE_WSTOKEN || 'e6a32d1645bc8bb5039adfa4a170560b'


/**
 * Creates a user in the Moodle LMS.
 */
export async function createMoodleUser(
  email: string,
  password?: string,
  fullName?: string
): Promise<{ success: boolean; moodleId?: number; error?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase()
    // Username in Moodle must be lowercase
    const username = cleanEmail

    // Generate a secure compliant password if none is provided
    // Moodle password policies: uppercase, lowercase, digit, special char, length >= 8
    const cleanPassword = password || `${cleanEmail.split('@')[0]}Ai1!`

    // Parse first name and last name
    const nameParts = (fullName || 'Student').trim().split(/\s+/)
    const firstname = nameParts[0]
    const lastname = nameParts.slice(1).join(' ') || '.'

    const params = new URLSearchParams()
    params.append('wstoken', MOODLE_WSTOKEN)
    params.append('wsfunction', 'core_user_create_users')
    params.append('moodlewsrestformat', 'json')
    
    params.append('users[0][username]', username)
    params.append('users[0][password]', cleanPassword)
    params.append('users[0][firstname]', firstname)
    params.append('users[0][lastname]', lastname)
    params.append('users[0][email]', cleanEmail)

    const endpoint = `${MOODLE_URL}/webservice/rest/server.php`
    logger.info(`Creating Moodle user for ${cleanEmail} at ${endpoint}`)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json'
      },
      body: params.toString(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (Array.isArray(data) && data.length > 0 && data[0].id) {
      logger.info(`Moodle user created successfully: ID ${data[0].id}`)
      return { success: true, moodleId: data[0].id }
    }

    if (data.exception) {
      logger.error('Moodle API Exception:', data)
      // Check if user already exists in Moodle
      if (data.errorcode === 'usernameexists') {
        return { success: true, error: 'User already exists in Moodle' }
      }
      return { success: false, error: data.message || data.exception }
    }

    return { success: false, error: 'Unknown response format from Moodle' }
  } catch (error) {
    logger.error('Error in createMoodleUser:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * Authenticates a user against Moodle using login/token.php
 */
export async function authenticateMoodleUser(
  emailOrUsername: string,
  password?: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const cleanInput = emailOrUsername.trim()
    let moodleUsername = cleanInput.toLowerCase()

    // If it's an email, fetch the user details to resolve the Moodle username
    if (cleanInput.includes('@')) {
      try {
        const moodleUserRes = await getMoodleUser(cleanInput)
        if (moodleUserRes.success && moodleUserRes.user) {
          moodleUsername = moodleUserRes.user.username || moodleUsername
        }
      } catch (moodleErr) {
        logger.error(`Failed to lookup username for ${cleanInput} before login`, moodleErr)
      }
    }

    const cleanPassword = password || `${moodleUsername.split('@')[0]}Ai1!`

    const loginUrl = `${MOODLE_URL}/login/token.php?username=${encodeURIComponent(
      moodleUsername
    )}&password=${encodeURIComponent(cleanPassword)}&service=moodle_mobile_app`

    logger.info(`Authenticating user against Moodle: ${cleanInput} (Moodle Username: ${moodleUsername})`)

    const response = await fetch(loginUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.token) {
      logger.info(`Moodle login successful for ${cleanInput}`)
      return { success: true, token: data.token }
    }

    if (data.error) {
      logger.warn(`Moodle login failed for ${cleanInput}: ${data.error}`)
      return { success: false, error: data.error }
    }

    return { success: false, error: 'Invalid response from Moodle login endpoint' }
  } catch (error) {
    logger.error('Error in authenticateMoodleUser:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * Fetches user details from Moodle by username or email.
 */
export async function getMoodleUser(
  usernameOrEmail: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const cleanInput = usernameOrEmail.trim()
    const isEmail = cleanInput.includes('@')
    const field = isEmail ? 'email' : 'username'
    const cleanValue = isEmail ? cleanInput.toLowerCase() : cleanInput

    const params = new URLSearchParams()
    params.append('wstoken', MOODLE_WSTOKEN)
    params.append('wsfunction', 'core_user_get_users_by_field')
    params.append('moodlewsrestformat', 'json')
    params.append('field', field)
    params.append('values[0]', cleanValue)

    const endpoint = `${MOODLE_URL}/webservice/rest/server.php`
    logger.info(`Fetching Moodle user details by ${field} for ${cleanValue} at ${endpoint}`)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json'
      },
      body: params.toString(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (Array.isArray(data) && data.length > 0) {
      const moodleUser = data[0]
      logger.info(`Moodle user details fetched successfully for ${cleanValue}: ID ${moodleUser.id}`)
      return { success: true, user: moodleUser }
    }

    // Fallback: If searching by username (no @) returned nothing, try a fallback search or vice-versa
    return { success: false, error: 'User not found in Moodle' }
  } catch (error) {
    logger.error('Error in getMoodleUser:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

const MOODLE_COURSE_TOKEN = process.env.MOODLE_COURSE_TOKEN || MOODLE_WSTOKEN

/**
 * Fetches all courses available on the Moodle site.
 */
export async function getMoodleCourses(): Promise<{ success: boolean; courses?: any[]; error?: string }> {
  try {
    const params = new URLSearchParams()
    params.append('wstoken', MOODLE_COURSE_TOKEN)
    params.append('wsfunction', 'core_course_get_courses')
    params.append('moodlewsrestformat', 'json')

    const endpoint = `${MOODLE_URL}/webservice/rest/server.php`
    logger.info(`Fetching Moodle course directory from ${endpoint}`)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json'
      },
      body: params.toString()
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (Array.isArray(data)) {
      // Filter out site home course (usually ID 1 has shortname site/home)
      const courses = data.filter(c => c.id !== 1)
      return { success: true, courses }
    }

    if (data.exception) {
      return { success: false, error: data.message || data.exception }
    }

    return { success: false, error: 'Unknown response format' }
  } catch (error) {
    logger.error('Error in getMoodleCourses:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * Fetches all courses a specific user is enrolled in.
 * @param usernameOrEmail - Moodle username (e.g. 'mahi') or email (e.g. 'mahi@example.com')
 */
export async function getUserEnrolledCourses(
  usernameOrEmail: string
): Promise<{ success: boolean; courses?: any[]; error?: string }> {
  try {
    // 1. Resolve Moodle User ID (works with both username and email)
    const moodleUserRes = await getMoodleUser(usernameOrEmail)
    if (!moodleUserRes.success || !moodleUserRes.user) {
      return { success: false, error: moodleUserRes.error || 'Failed to resolve user' }
    }

    const moodleUserId = moodleUserRes.user.id

    // 2. Fetch enrolled courses
    const params = new URLSearchParams()
    params.append('wstoken', process.env.MOODLE_TOKEN || MOODLE_COURSE_TOKEN)
    params.append('wsfunction', 'core_enrol_get_users_courses')
    params.append('moodlewsrestformat', 'json')
    params.append('userid', String(moodleUserId))

    const endpoint = `${MOODLE_URL}/webservice/rest/server.php`
    logger.info(`Fetching Moodle enrolled courses for user ${moodleUserId} from ${endpoint}`)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json'
      },
      body: params.toString()
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (Array.isArray(data)) {
      return { success: true, courses: data }
    }

    if (data.exception) {
      return { success: false, error: data.message || data.exception }
    }

    return { success: false, error: 'Unknown response format' }
  } catch (error) {
    logger.error('Error in getUserEnrolledCourses:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

const MOODLE_ENROL_TOKEN = process.env.MOODLE_ENROL_TOKEN || MOODLE_WSTOKEN

/**
 * Enrolls a Moodle user in a course manually.
 * @param usernameOrEmail - Moodle username (e.g. 'mahi') or email
 * @param courseId - Moodle numeric course ID
 */
export async function enrollMoodleUserInCourse(
  usernameOrEmail: string,
  courseId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Resolve Moodle User ID (handles both username and email)
    const moodleUserRes = await getMoodleUser(usernameOrEmail)
    if (!moodleUserRes.success || !moodleUserRes.user) {
      return { success: false, error: moodleUserRes.error || 'Failed to resolve user' }
    }

    const moodleUserId = moodleUserRes.user.id

    // 2. Call enrol_manual_enrol_users
    const params = new URLSearchParams()
    params.append('wstoken', MOODLE_ENROL_TOKEN)
    params.append('wsfunction', 'enrol_manual_enrol_users')
    params.append('moodlewsrestformat', 'json')
    params.append('enrolments[0][roleid]', '5') // Student role
    params.append('enrolments[0][userid]', String(moodleUserId))
    params.append('enrolments[0][courseid]', String(courseId))

    const endpoint = `${MOODLE_URL}/webservice/rest/server.php`
    logger.info(`Enrolling Moodle user ${moodleUserId} in course ${courseId} at ${endpoint}`)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json'
      },
      body: params.toString()
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Moodle's enrol_manual_enrol_users returns null/empty on success, or throws exception JSON
    const text = await response.text()
    if (!text || text.trim() === 'null') {
      logger.info(`Successfully enrolled user ${moodleUserId} in course ${courseId}`)
      return { success: true }
    }

    const data = JSON.parse(text)
    if (data.exception) {
      logger.error('Moodle Enrollment Exception:', data)
      return { success: false, error: data.message || data.exception }
    }

    return { success: true }
  } catch (error) {
    logger.error('Error in enrollMoodleUserInCourse:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}


