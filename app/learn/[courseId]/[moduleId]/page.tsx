'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useAuth } from '@/hooks'

// ─── Renderers ────────────────────────────────────────────────────────────────

function VideoPlayer({ src, title }: { src: string; title: string }) {
  // Detect YouTube / external video
  const isYoutube = src.includes('youtube.com') || src.includes('youtu.be')
  const isVimeo = src.includes('vimeo.com')

  if (isYoutube) {
    let embedId = ''
    if (src.includes('youtu.be/')) embedId = src.split('youtu.be/')[1]?.split('?')[0]
    else embedId = new URLSearchParams(src.split('?')[1]).get('v') || ''
    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full rounded-2xl"
          src={`https://www.youtube-nocookie.com/embed/${embedId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (isVimeo) {
    const vimeoId = src.split('vimeo.com/')[1]?.split('?')[0]
    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full rounded-2xl"
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  // Native video (proxied through our server)
  return (
    <video
      controls
      className="w-full rounded-2xl bg-black max-h-[520px]"
      title={title}
    >
      <source src={src} />
      Your browser does not support the video tag.
    </video>
  )
}

function PDFViewer({ src, filename }: { src: string; filename: string }) {
  return (
    <div className="space-y-3">
      <iframe
        src={`${src}#toolbar=1`}
        className="w-full rounded-2xl border border-slate-200"
        style={{ height: '70vh', minHeight: '500px' }}
        title={filename}
      />
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-[#3462AE] hover:underline font-medium"
      >
        <span>⬇</span> Download PDF
      </a>
    </div>
  )
}

function ImageViewer({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="max-w-full rounded-2xl shadow-lg" />
    </div>
  )
}

function ContentRenderer({ mod, detail }: { mod: any; detail: any }) {
  const contents: any[] = mod.contents || []

  // ── Page / Reading ──────────────────────────────────────────────
  if (mod.modname === 'page') {
    const content = detail?.content || mod.description || ''
    return (
      <article
        className="prose prose-slate max-w-none text-slate-800 leading-relaxed
          prose-headings:text-slate-900 prose-headings:font-bold
          prose-a:text-[#3462AE] prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-pre:bg-slate-900 prose-pre:text-slate-100
          prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  // ── Label / Info ─────────────────────────────────────────────────
  if (mod.modname === 'label') {
    return (
      <div
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: mod.description || mod.name }}
      />
    )
  }

  // ── URL ──────────────────────────────────────────────────────────
  if (mod.modname === 'url') {
    const externalUrl = detail?.externalurl || mod.url || ''
    const isVideo = externalUrl.includes('youtube') || externalUrl.includes('youtu.be') || externalUrl.includes('vimeo')
    if (isVideo) {
      return <VideoPlayer src={externalUrl} title={mod.name} />
    }
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
        <span className="text-5xl block mb-4">🔗</span>
        <h3 className="font-bold text-slate-900 mb-2">{mod.name}</h3>
        <p className="text-slate-500 text-sm mb-5">{detail?.intro || 'This resource opens in a new tab.'}</p>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-[#3462AE] hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition"
        >
          Open Resource →
        </a>
      </div>
    )
  }

  // ── Resource (File) ──────────────────────────────────────────────
  if (mod.modname === 'resource') {
    const files = contents.length > 0 ? contents : (detail?.contentfiles || [])
    if (files.length === 0) return <p className="text-slate-500">No files attached.</p>

    return (
      <div className="space-y-4">
        {files.map((file: any, i: number) => {
          const mime = file.mimetype || ''
          const isVideo = mime.startsWith('video/') || /\.(mp4|webm|ogg|mov)$/i.test(file.filename || '')
          const isPDF = mime === 'application/pdf' || /\.pdf$/i.test(file.filename || '')
          const isImage = mime.startsWith('image/')
          const proxyUrl = file.fileurl // already proxied by our API

          if (isVideo) return <VideoPlayer key={i} src={proxyUrl} title={file.filename || mod.name} />
          if (isPDF) return <PDFViewer key={i} src={proxyUrl} filename={file.filename || mod.name} />
          if (isImage) return <ImageViewer key={i} src={proxyUrl} alt={file.filename || mod.name} />

          // Generic download card
          return (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="w-12 h-12 bg-[#3462AE]/10 rounded-xl flex items-center justify-center text-2xl">📄</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate text-sm">{file.filename || 'File'}</p>
                <p className="text-slate-500 text-xs mt-0.5">{mime || 'Document'}</p>
              </div>
              <a
                href={proxyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-4 py-2 bg-[#3462AE] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
              >
                Download
              </a>
            </div>
          )
        })}
      </div>
    )
  }

  // ── Folder ───────────────────────────────────────────────────────
  if (mod.modname === 'folder') {
    const files = contents.length > 0 ? contents : []
    return (
      <div className="space-y-3">
        <p className="text-slate-600 text-sm">{detail?.intro || 'Files in this folder:'}</p>
        {files.map((file: any, i: number) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xl">📎</span>
            <span className="flex-1 text-sm text-slate-800 truncate">{file.filename}</span>
            <a
              href={file.fileurl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#3462AE] font-bold hover:underline"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    )
  }

  // ── Quiz ─────────────────────────────────────────────────────────
  if (mod.modname === 'quiz') {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-8 text-center">
        <span className="text-5xl block mb-4">🧩</span>
        <h3 className="font-bold text-slate-900 text-lg mb-2">{mod.name}</h3>
        <p className="text-slate-600 text-sm mb-2">{detail?.intro || 'Complete this quiz to test your understanding.'}</p>
        {detail?.timelimit > 0 && (
          <p className="text-purple-700 text-xs font-bold mb-4">⏱ Time Limit: {Math.floor(detail.timelimit / 60)} min</p>
        )}
        {detail?.attempts && (
          <p className="text-slate-500 text-xs mb-4">Attempts: {detail.attempts} / {detail.attempts === 0 ? '∞' : detail.attempts}</p>
        )}
        <div className="mt-2 text-slate-500 text-xs bg-white border border-purple-200 rounded-xl px-4 py-3">
          Quizzes are completed within this learning portal. Your scores are tracked automatically.
        </div>
      </div>
    )
  }

  // ── Assignment ───────────────────────────────────────────────────
  if (mod.modname === 'assign') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8">
        <span className="text-5xl block mb-4">📋</span>
        <h3 className="font-bold text-slate-900 text-lg mb-2">{mod.name}</h3>
        {detail?.intro && (
          <div className="prose prose-sm prose-slate max-w-none mt-2 mb-4"
            dangerouslySetInnerHTML={{ __html: detail.intro }} />
        )}
        {detail?.duedate && detail.duedate > 0 && (
          <p className="text-rose-700 text-xs font-bold">
            📅 Due: {new Date(detail.duedate * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
      </div>
    )
  }

  // ── Forum ────────────────────────────────────────────────────────
  if (mod.modname === 'forum') {
    return (
      <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-8 text-center">
        <span className="text-5xl block mb-4">💬</span>
        <h3 className="font-bold text-slate-900 text-lg mb-2">{mod.name}</h3>
        <p className="text-slate-600 text-sm">{detail?.intro || 'Join the discussion in this forum.'}</p>
      </div>
    )
  }

  // ── Fallback ─────────────────────────────────────────────────────
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
      <span className="text-5xl block mb-4">📌</span>
      <h3 className="font-bold text-slate-900 mb-2">{mod.name}</h3>
      {mod.description && (
        <div className="prose prose-sm prose-slate max-w-none text-center mx-auto"
          dangerouslySetInnerHTML={{ __html: mod.description }} />
      )}
    </div>
  )
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function ModuleViewerPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params?.courseId as string
  const moduleId = params?.moduleId as string
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [data, setData] = useState<{ module: any; sectionName: string; detail: any } | null>(null)
  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchModule = useCallback(async () => {
    if (!courseId || !moduleId) return
    setLoading(true)
    setError('')
    const token = Cookies.get('token')
    try {
      const [modRes, sectionsRes] = await Promise.all([
        fetch(`/api/learn/${courseId}/module/${moduleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/learn/${courseId}/content`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])
      const modData = await modRes.json()
      const sectData = await sectionsRes.json()

      if (!modRes.ok || !modData.success) {
        setError(modData.message || 'Failed to load module')
        return
      }
      setData(modData)
      if (sectData.success) setSections(sectData.sections || [])
    } catch {
      setError('Could not load content.')
    } finally {
      setLoading(false)
    }
  }, [courseId, moduleId])

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      router.push(`/sign-in?redirect=/learn/${courseId}/${moduleId}`)
      return
    }
    fetchModule()
  }, [authLoading, isAuthenticated, fetchModule, courseId, moduleId, router])

  // Compute prev/next navigation
  const allMods = sections
    .flatMap(s => (s.modules || []).filter((m: any) => m.modname !== 'label' && m.visible !== 0))
  const currentIdx = allMods.findIndex((m: any) => String(m.id) === String(moduleId))
  const prevMod = currentIdx > 0 ? allMods[currentIdx - 1] : null
  const nextMod = currentIdx < allMods.length - 1 ? allMods[currentIdx + 1] : null

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#3462AE] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading content...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <span className="text-5xl block mb-4">⚠️</span>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Could not load</h1>
          <p className="text-slate-500 mb-5">{error}</p>
          <Link href={`/learn/${courseId}`}
            className="px-5 py-2.5 bg-[#3462AE] text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition">
            Back to Course
          </Link>
        </div>
      </div>
    )
  }

  const mod = data?.module
  const detail = data?.detail

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Top Nav ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 flex items-center gap-3 px-4 md:px-6 py-3">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
        >
          ☰
        </button>

        <Link href={`/learn/${courseId}`} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm transition">
          <span>←</span>
          <span className="hidden sm:inline">Course</span>
        </Link>
        <span className="text-slate-300">/</span>
        <h1 className="font-bold text-slate-900 text-sm truncate flex-1">
          {mod?.name || 'Loading...'}
        </h1>

        {/* Module type tag */}
        {mod?.modname && (
          <span className="hidden sm:inline text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
            {mod.modname}
          </span>
        )}
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Mobile Sidebar Overlay ─────────────────────────────────── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <aside className={`
          fixed md:relative top-0 left-0 h-full z-40 md:z-auto
          w-72 bg-slate-900 border-r border-slate-800
          flex flex-col overflow-y-auto
          transform transition-transform md:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* Sidebar header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <Link
              href={`/learn/${courseId}`}
              className="text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition"
            >
              ← All Sections
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500 hover:text-slate-300 text-xl">
              ✕
            </button>
          </div>

          {/* Section / module list */}
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
            {sections.map((section: any, sIdx: number) => {
              const visibleMods = (section.modules || []).filter((m: any) => m.visible !== 0 && m.modname !== 'label')
              if (visibleMods.length === 0) return null
              return (
                <div key={section.id}>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-2">
                    {section.name || `Section ${sIdx + 1}`}
                  </p>
                  {visibleMods.map((m: any) => {
                    const isActive = String(m.id) === String(moduleId)
                    const isDone = m.completiondata?.state === 1 || m.completiondata?.state === 2
                    return (
                      <Link
                        key={m.id}
                        href={`/learn/${courseId}/${m.id}`}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-xs transition mb-0.5 ${
                          isActive
                            ? 'bg-[#3462AE]/20 text-[#93b4f4]'
                            : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="mt-0.5 shrink-0">
                          {isDone ? <span className="text-emerald-400">✓</span> : '○'}
                        </span>
                        <span className="leading-snug">{m.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </aside>

        {/* ── Content Area ──────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
            {/* Breadcrumb */}
            {data?.sectionName && (
              <div className="text-slate-400 text-xs mb-6 flex items-center gap-2">
                <Link href={`/learn/${courseId}`} className="hover:text-[#3462AE] transition">Course</Link>
                <span>›</span>
                <span>{data.sectionName}</span>
              </div>
            )}

            {/* Module title */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug">
                {mod?.name}
              </h2>
              {mod?.description && mod.modname !== 'page' && mod.modname !== 'label' && (
                <div
                  className="text-slate-600 text-sm mt-3 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: mod.description }}
                />
              )}
            </div>

            {/* Main content */}
            {mod && <ContentRenderer mod={mod} detail={detail} />}

            {/* ── Prev / Next navigation ─────────────────────────────── */}
            <div className="mt-12 flex items-center justify-between gap-4">
              {prevMod ? (
                <Link
                  href={`/learn/${courseId}/${prevMod.id}`}
                  className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-[#3462AE]/30 hover:bg-blue-50/50 transition group max-w-[48%]"
                >
                  <span className="text-slate-400 group-hover:text-[#3462AE] transition shrink-0">←</span>
                  <div className="text-left min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Previous</p>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-[#3462AE] transition truncate">{prevMod.name}</p>
                  </div>
                </Link>
              ) : <div />}

              {nextMod ? (
                <Link
                  href={`/learn/${courseId}/${nextMod.id}`}
                  className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-[#3462AE]/30 hover:bg-blue-50/50 transition group max-w-[48%] ml-auto"
                >
                  <div className="text-right min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next</p>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-[#3462AE] transition truncate">{nextMod.name}</p>
                  </div>
                  <span className="text-slate-400 group-hover:text-[#3462AE] transition shrink-0">→</span>
                </Link>
              ) : (
                <Link
                  href={`/learn/${courseId}`}
                  className="flex items-center gap-2 px-5 py-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl hover:bg-emerald-100 transition ml-auto"
                >
                  <span className="text-emerald-600 text-sm font-bold">🎉 Back to Course</span>
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
