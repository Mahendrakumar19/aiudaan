'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useAuth } from '@/hooks'

// Module type icons
function ModuleIcon({ modname }: { modname: string }) {
  const icons: Record<string, string> = {
    resource: '📄', page: '📝', url: '🔗', quiz: '🧩',
    assign: '📋', folder: '📁', label: '🏷️', forum: '💬',
    video: '🎬', hvp: '🎮', scorm: '🎯', default: '📌',
  }
  const icon = icons[modname] || icons.default
  return <span className="text-base leading-none">{icon}</span>
}

function ModulePill({ modname }: { modname: string }) {
  const labels: Record<string, string> = {
    resource: 'File', page: 'Reading', url: 'Link', quiz: 'Quiz',
    assign: 'Assignment', folder: 'Folder', label: 'Info', forum: 'Discussion',
    video: 'Video', hvp: 'Interactive', scorm: 'Course', default: 'Activity',
  }
  const label = labels[modname] || labels.default
  return (
    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-slate-200 bg-white text-slate-600">
      {label}
    </span>
  )
}

export default function LearnCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params?.courseId as string
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [sections, setSections] = useState<any[]>([])
  const [courseInfo, setCourseInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]))
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null)

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const fetchContent = useCallback(async () => {
    if (!courseId) return
    setLoading(true)
    setError('')
    const token = Cookies.get('token')
    try {
      const res = await fetch(`/api/learn/${courseId}/content`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to load course content')
        return
      }
      setSections(data.sections || [])

      // Also grab course info from enrolled list for title/summary
      const enrolledRes = await fetch('/api/courses/moodle?enrolled=true', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const enrolledData = await enrolledRes.json()
      if (enrolledData.success && enrolledData.courses) {
        const found = enrolledData.courses.find((c: any) => String(c.id) === String(courseId))
        if (found) setCourseInfo(found)
      }
    } catch (err) {
      setError('Could not load course. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      router.push(`/sign-in?redirect=/learn/${courseId}`)
      return
    }
    fetchContent()
  }, [authLoading, isAuthenticated, fetchContent, courseId, router])

  // Compute stats
  const allModules = sections.flatMap(s => s.modules || []).filter((m: any) => m.modname !== 'label')
  const totalModules = allModules.length
  const completedModules = allModules.filter((m: any) => m.completiondata?.state === 1 || m.completiondata?.state === 2).length
  const progressPct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  const toggleSection = (idx: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const navigateToModule = (mod: any) => {
    setActiveModuleId(mod.id)
    router.push(`/learn/${courseId}/${mod.id}`)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#3462AE] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading your course...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <span className="text-5xl block mb-4">🔒</span>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Access Denied</h1>
          <p className="text-slate-500 mb-6">{error}</p>
          <Link href="/dashboard?activeTab=camps"
            className="inline-block px-6 py-3 bg-[#3462AE] hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Nav Bar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition focus:outline-none"
            title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {sidebarOpen ? '✕ Sidebar' : '☰ Sidebar'}
          </button>
          <span className="text-slate-300">|</span>
          <Link href="/dashboard?activeTab=camps"
            className="text-slate-500 hover:text-slate-900 transition flex items-center gap-1.5 text-sm font-medium shrink-0">
            <span>←</span>
            <span className="hidden sm:inline">My Courses</span>
          </Link>
          <span className="text-slate-300">/</span>
          <h1 className="text-slate-950 font-bold text-sm truncate">
            {courseInfo?.fullname || courseInfo?.shortname || `Course #${courseId}`}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Progress pill */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#3462AE] rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-slate-500 text-xs font-medium">{progressPct}%</span>
          </div>
          <span className="text-slate-500 text-xs">{completedModules}/{totalModules} done</span>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* ─── Sidebar: Section / Module List ─────────────────────────── */}
        {sidebarOpen && (
          <aside className="w-72 shrink-0 bg-slate-900 border-r border-slate-800 overflow-y-auto flex flex-col">
            {/* Course header in sidebar */}
            <div className="p-5 border-b border-slate-800">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#3462AE] mb-1">Your Course</div>
              <p className="text-white font-bold text-sm leading-snug">
                {courseInfo?.fullname || `Course #${courseId}`}
              </p>
              {courseInfo?.shortname && (
                <span className="mt-2 inline-block text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md">
                  {courseInfo.shortname}
                </span>
              )}
            </div>

            {/* Section / Module tree */}
            <div className="flex-1 overflow-y-auto py-3 space-y-1 px-2">
              {sections.map((section: any, sIdx: number) => {
                const visibleMods = (section.modules || []).filter((m: any) => m.visible !== 0 && m.uservisible !== false)
                if (visibleMods.length === 0 && !section.name) return null
                const isOpen = expandedSections.has(sIdx)

                return (
                  <div key={section.id} className="rounded-xl overflow-hidden">
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(sIdx)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-slate-800/60 transition group"
                    >
                      <span className="text-slate-300 text-xs font-bold uppercase tracking-wider truncate flex-1 group-hover:text-white transition">
                        {section.name || `Section ${sIdx + 1}`}
                      </span>
                      <span className={`text-slate-500 text-xs ml-2 transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                    </button>

                    {/* Module list */}
                    {isOpen && visibleMods.length > 0 && (
                      <div className="pl-2 pb-1 space-y-0.5">
                        {visibleMods.map((mod: any) => {
                          if (mod.modname === 'label') return null
                          const isDone = mod.completiondata?.state === 1 || mod.completiondata?.state === 2
                          const isActive = activeModuleId === mod.id
                          return (
                            <button
                              key={mod.id}
                              onClick={() => navigateToModule(mod)}
                              className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-xs transition ${
                                isActive
                                  ? 'bg-[#3462AE]/20 text-[#93b4f4]'
                                  : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <span className="mt-0.5 shrink-0">
                                {isDone
                                  ? <span className="text-emerald-400">✓</span>
                                  : <ModuleIcon modname={mod.modname} />
                                }
                              </span>
                              <span className="leading-snug">{mod.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </aside>
        )}

        {/* ─── Main Content Area ─────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto bg-white">
          {/* Hero banner */}
          <div className="bg-gradient-to-br from-slate-900 via-[#0f1e40] to-slate-900 px-6 md:px-12 py-12 md:py-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#3462AE] mb-3">AI Udaan Bootcamp</div>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-snug mb-4">
                {courseInfo?.fullname || `Course #${courseId}`}
              </h2>
              {courseInfo?.summary && (
                <div
                  className="text-slate-300 text-sm leading-relaxed max-w-2xl"
                  dangerouslySetInnerHTML={{ __html: courseInfo.summary }}
                />
              )}
              {/* Progress bar */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 text-xs font-medium">Your Progress</span>
                  <span className="text-[#3462AE] text-xs font-bold">{progressPct}% Complete</span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3462AE] to-blue-400 rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="text-slate-500 text-xs mt-2">{completedModules} of {totalModules} activities completed</p>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 space-y-8">
            {sections.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-5xl block mb-4">📭</span>
                <p className="text-slate-500">No content available yet. Check back soon!</p>
              </div>
            ) : (
              sections.map((section: any, sIdx: number) => {
                const visibleMods = (section.modules || []).filter((m: any) => m.visible !== 0 && m.uservisible !== false)
                if (visibleMods.length === 0 && !section.name) return null

                return (
                  <div key={section.id} className="space-y-3">
                    {/* Section heading */}
                    <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-[#3462AE]/10 flex items-center justify-center text-[#3462AE] font-black text-sm">
                        {sIdx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">
                          {section.name || `Section ${sIdx + 1}`}
                        </h3>
                        {section.summary && (
                          <div
                            className="text-slate-500 text-xs mt-0.5"
                            dangerouslySetInnerHTML={{ __html: section.summary }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Module cards */}
                    <div className="space-y-2">
                      {visibleMods.map((mod: any) => {
                        if (mod.modname === 'label') {
                          // Label: render as info banner
                          return (
                            <div key={mod.id} className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
                              <div
                                className="text-slate-700 text-sm"
                                dangerouslySetInnerHTML={{ __html: mod.description || mod.name }}
                              />
                            </div>
                          )
                        }

                        const isDone = mod.completiondata?.state === 1 || mod.completiondata?.state === 2

                        return (
                          <button
                            key={mod.id}
                            onClick={() => navigateToModule(mod)}
                            className="w-full text-left bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 hover:border-[#3462AE]/40 hover:shadow-md transition group"
                          >
                            {/* Completion status dot */}
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${
                              isDone
                                ? 'bg-emerald-50 border border-emerald-200'
                                : 'bg-slate-50 border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-200'
                            }`}>
                              {isDone
                                ? <span className="text-emerald-500 text-base">✓</span>
                                : <ModuleIcon modname={mod.modname} />
                              }
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-slate-900 text-sm group-hover:text-[#3462AE] transition truncate">
                                  {mod.name}
                                </span>
                                <ModulePill modname={mod.modname} />
                                {isDone && (
                                  <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full">
                                    DONE
                                  </span>
                                )}
                              </div>
                              {mod.description && (
                                <div
                                  className="text-slate-500 text-xs mt-1 line-clamp-1"
                                  dangerouslySetInnerHTML={{ __html: mod.description }}
                                />
                              )}
                            </div>

                            <span className="text-slate-400 group-hover:text-[#3462AE] transition text-sm shrink-0">→</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            )}

            {/* Footer CTA */}
            <div className="mt-12 bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center">
              <span className="text-3xl block mb-3">📱</span>
              <h4 className="font-bold text-slate-900">Continue on Mobile</h4>
              <p className="text-slate-500 text-sm mt-1 mb-4">Download the AI Udaan app for offline access to all your course materials.</p>
              <a
                href="https://play.google.com/store/apps/details?id=com.nighwantech.aiudaanbootcamp"
                className="inline-block px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition"
              >
                Download Android App
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
