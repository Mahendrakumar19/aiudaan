import { logger } from './logger'

const MOODLE_URL = process.env.MOODLE_URL || 'https://moodle.aiudaanbootcamp.com'
const MOODLE_TOKEN = process.env.MOODLE_TOKEN || process.env.MOODLE_CREATE_USER_TOKEN || process.env.MOODLE_WSTOKEN || 'e6a32d1645bc8bb5039adfa4a170560b'

const HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'User-Agent': 'Mozilla/5.0 (compatible)',
  'Accept': 'application/json',
}

async function moodlePost(params: Record<string, string>): Promise<any> {
  const body = new URLSearchParams({ wstoken: MOODLE_TOKEN, moodlewsrestformat: 'json', ...params })
  const res = await fetch(`${MOODLE_URL}/webservice/rest/server.php`, {
    method: 'POST',
    headers: HEADERS,
    body: body.toString(),
  })
  if (!res.ok) throw new Error(`Moodle HTTP ${res.status}`)
  const data = await res.json()
  if (data?.exception) throw new Error(data.message || data.exception)
  return data
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MoodleFile {
  filename: string
  fileurl: string
  mimetype: string
  filesize: number
  isexternalfile?: boolean
  timemodified?: number
}

export interface MoodleModule {
  id: number
  url?: string
  name: string
  instance?: number
  contextid?: number
  visible?: number
  uservisible?: boolean
  visibleoncoursepage?: number
  modicon?: string
  modname: string // 'resource' | 'url' | 'page' | 'label' | 'quiz' | 'assign' | 'folder' | 'video' | 'hvp' | ...
  modplural?: string
  indent?: number
  onclick?: string
  afterlink?: string | null
  customdata?: string | null
  noviewlink?: boolean
  completion?: number
  completiondata?: {
    state: number  // 0=incomplete 1=complete 2=complete pass 3=complete fail
    timecompleted: number
    overrideby: number | null
    valueused: boolean
    hascompletion: boolean
    isautomatic: boolean
    istrackeduser: boolean
    uservisible: boolean
    details: any[]
  }
  contents?: MoodleFile[]
  contentsinfo?: {
    filescount: number
    filessize: number
    lastmodified: number
    mimetypes: string[]
    repositorytype?: string
  }
  description?: string
}

export interface MoodleSection {
  id: number
  name: string
  visible?: number
  summary?: string
  summaryformat?: number
  section?: number
  hiddenbyreason?: string
  uservisible?: boolean
  modules: MoodleModule[]
}

export interface CourseContent {
  sections: MoodleSection[]
  totalModules: number
  completedModules: number
}

// ─── Functions ────────────────────────────────────────────────────────────────

/**
 * Fetch all sections and modules for a course.
 * Strips raw Moodle file URLs — replaces with proxied /api/learn/[courseId]/file?token=...
 */
export async function getCourseContents(
  courseId: number
): Promise<{ success: boolean; sections?: MoodleSection[]; error?: string }> {
  try {
    logger.info(`Fetching course contents for courseId=${courseId}`)
    const data = await moodlePost({
      wsfunction: 'core_course_get_contents',
      courseid: String(courseId),
    })

    if (!Array.isArray(data)) {
      return { success: false, error: 'Unexpected response from Moodle' }
    }

    // Sanitize: strip raw Moodle webservice download URLs from module.contents
    const sections: MoodleSection[] = data.map((section: any) => ({
      ...section,
      modules: (section.modules || []).map((mod: any) => ({
        ...mod,
        // Sanitize file urls — proxy them through our API
        contents: (mod.contents || []).map((f: any) => ({
          ...f,
          fileurl: f.fileurl
            ? `/api/learn/${courseId}/file?path=${encodeURIComponent(f.fileurl)}`
            : undefined,
          _rawurl: f.fileurl, // keep raw for internal server use
        })),
      })),
    }))

    return { success: true, sections }
  } catch (error) {
    logger.error('getCourseContents error:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * Fetch a specific module's detail page content.
 */
export async function getModuleContent(
  moduleId: number,
  modname: string,
  courseId: number
): Promise<{ success: boolean; content?: any; error?: string }> {
  try {
    let data: any = null

    if (modname === 'page') {
      const res = await moodlePost({
        wsfunction: 'mod_page_get_pages_by_courses',
        'courseids[0]': String(courseId),
      })
      const pages = Array.isArray(res?.pages) ? res.pages : []
      data = pages.find((p: any) => p.coursemodule === moduleId)
    } else if (modname === 'resource') {
      const res = await moodlePost({
        wsfunction: 'mod_resource_get_resources_by_courses',
        'courseids[0]': String(courseId),
      })
      const resources = Array.isArray(res?.resources) ? res.resources : []
      data = resources.find((r: any) => r.coursemodule === moduleId)
    } else if (modname === 'url') {
      const res = await moodlePost({
        wsfunction: 'mod_url_get_urls_by_courses',
        'courseids[0]': String(courseId),
      })
      const urls = Array.isArray(res?.urls) ? res.urls : []
      data = urls.find((u: any) => u.coursemodule === moduleId)
    } else if (modname === 'assign') {
      const res = await moodlePost({
        wsfunction: 'mod_assign_get_assignments',
        'courseids[0]': String(courseId),
      })
      // assignments nested inside course object
      const courses = Array.isArray(res?.courses) ? res.courses : []
      for (const c of courses) {
        const found = (c.assignments || []).find((a: any) => a.cmid === moduleId)
        if (found) { data = found; break }
      }
    } else if (modname === 'quiz') {
      const res = await moodlePost({
        wsfunction: 'mod_quiz_get_quizzes_by_courses',
        'courseids[0]': String(courseId),
      })
      const quizzes = Array.isArray(res?.quizzes) ? res.quizzes : []
      data = quizzes.find((q: any) => q.coursemodule === moduleId)
    } else if (modname === 'folder') {
      const res = await moodlePost({
        wsfunction: 'mod_folder_get_folders_by_courses',
        'courseids[0]': String(courseId),
      })
      const folders = Array.isArray(res?.folders) ? res.folders : []
      data = folders.find((f: any) => f.coursemodule === moduleId)
    }

    return { success: true, content: data || null }
  } catch (error) {
    logger.error('getModuleContent error:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * Proxy a Moodle file download through our server (appends wstoken).
 * Returns a readable stream response.
 */
export async function proxyMoodleFile(rawUrl: string): Promise<Response> {
  // Append token to the raw Moodle URL for authenticated download
  const separator = rawUrl.includes('?') ? '&' : '?'
  const authenticatedUrl = `${rawUrl}${separator}token=${MOODLE_TOKEN}`
  return fetch(authenticatedUrl)
}

/**
 * Get the Moodle token (for server-side use only).
 */
export function getMoodleToken(): string {
  return MOODLE_TOKEN
}

export const MOODLE_BASE_URL = MOODLE_URL
