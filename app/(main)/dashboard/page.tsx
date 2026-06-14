'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks'
import Link from 'next/link'
import Cookies from 'js-cookie'

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'events' | 'teams' | 'camps'>('events')

  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [allCourses, setAllCourses] = useState<any[]>([])
  const [loadingCourses, setLoadingCourses] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchMoodleData = async () => {
      setLoadingCourses(true)
      const token = Cookies.get('token')
      try {
        // 1. Fetch Enrolled Courses
        const enrolledRes = await fetch('/api/courses/moodle?enrolled=true', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (enrolledRes.ok) {
          const data = await enrolledRes.json()
          if (data.success && data.courses) {
            setEnrolledCourses(data.courses)
          }
        }

        // 2. Fetch All Courses
        const allRes = await fetch('/api/courses/moodle')
        if (allRes.ok) {
          const data = await allRes.json()
          if (data.success && data.courses) {
            setAllCourses(data.courses)
          }
        }
      } catch (err) {
        console.error('Failed to load Moodle courses', err)
      } finally {
        setLoadingCourses(false)
      }
    }

    fetchMoodleData()
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        <div className='text-center p-8 bg-white border border-slate-200 rounded-3xl max-w-md shadow-xl'>
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6 text-3xl">🔑</div>
          <h1 className='text-2xl font-bold mb-4 text-slate-900'>Please sign in to access Innovator Dashboard</h1>
          <p className="text-slate-500 text-sm mb-6">Gain access to your registered hackathons, teams, ideas, and upskilling camps.</p>
          <Link href='/sign-in' className="block w-full">
            <button className='w-full py-3 bg-[#3462AE] hover:bg-[#1548B7] text-white rounded-xl font-bold transition shadow-lg text-sm'>
              Go to Sign In
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const registeredEvents = [
    {
      id: '1',
      title: 'AI Global Hackathon 2026',
      status: 'In Progress',
      team: 'Quantum Crew',
      role: 'Team Leader',
      logo: 'https://hacktoskill.com/homePageH2s/assets/banner1.webp',
      progress: 65,
    },
    {
      id: '2',
      title: 'Smart City Hackfest',
      status: 'Registration Open',
      team: 'Not Formed',
      role: 'Individual',
      logo: 'https://hacktoskill.com/homePageH2s/assets/banner1.webp',
      progress: 0,
    }
  ]

  const myTeams = [
    {
      name: 'Quantum Crew',
      event: 'AI Global Hackathon 2026',
      members: ['You (Leader)', 'Rahul Sharma', 'Sneha Patel'],
      code: 'QCRW26'
    }
  ]



  return (
    <div className='min-h-screen bg-slate-50 py-10 px-4 md:px-8 lg:px-12'>
      <div className='max-w-7xl mx-auto'>
        {/* Welcome Header */}
        <div className='bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8'>
          <div>
            <span className='text-[10px] uppercase tracking-[0.25em] text-[#3462ae] font-bold'>Innovator Dashboard</span>
            <h1 className='text-3xl sm:text-4xl font-syne font-bold text-slate-900 mt-2'>
              Welcome, {user?.name || 'Innovator'}! 👋
            </h1>
            <p className='text-slate-500 text-sm mt-1'>Access your ongoing challenges, collaborate with teams, and upskill.</p>
          </div>
          <div className='flex gap-3'>
            <Link href='/#flagshipevents'>
              <button className='px-5 py-2.5 bg-[#3462AE] hover:bg-[#1548B7] text-white rounded-xl font-bold transition text-xs shadow-sm'>
                Explore Hackathons
              </button>
            </Link>
            <Link href='/#programs'>
              <button className='px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition text-xs shadow-sm'>
                Find Bootcamps
              </button>
            </Link>
          </div>
        </div>

        {/* Dashboard Tabs & Metrics Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>

          {/* Quick Info Sidebar */}
          <div className='space-y-6 lg:col-span-1'>
            <div className='bg-white border border-slate-200 rounded-3xl p-6 shadow-sm'>
              <h3 className='font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider'>My Profile</h3>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-lg text-[#3462AE] border border-slate-200 shrink-0'>
                  {(user?.name || 'I')[0]}
                </div>
                <div className="min-w-0">
                  <h4 className='font-bold text-slate-900 text-sm truncate'>{user?.name || 'Innovator'}</h4>
                  <p className='text-slate-500 text-xs truncate'>{user?.email}</p>
                </div>
              </div>

              {/* Dynamic Registration Metadata */}
              <div className='border-t border-slate-100 pt-4 pb-2 space-y-2 text-xs text-slate-600'>
                {user?.mobile && (
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-medium">Mobile Number</span>
                    <span className="font-bold text-slate-800">{user?.mobile}</span>
                  </div>
                )}
                {(user?.district || user?.state) && (
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-medium">Location</span>
                    <span className="font-bold text-slate-800">{user?.district ? `${user?.district}, ` : ''}{user?.state || ''}</span>
                  </div>
                )}
                {user?.class && (
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-medium">Education</span>
                    <span className="font-bold text-slate-800">{user?.class}</span>
                  </div>
                )}
                {user?.aiDomain && (
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-medium">Interested Track</span>
                    <span className="font-bold text-slate-800">{user?.aiDomain}</span>
                  </div>
                )}
                {user?.bootcampType && (
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-medium">Workshop Mode</span>
                    <span className="px-2 py-0.5 bg-[#3462AE]/10 text-[#3462AE] rounded-full font-bold uppercase text-[9px] inline-block mt-1">
                      {user?.bootcampType}
                    </span>
                  </div>
                )}
              </div>

              <div className='space-y-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-600'>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`w-full py-3 px-4 rounded-xl text-left flex justify-between items-center transition ${activeTab === 'events' ? 'bg-[#3462AE]/10 text-[#3462AE]' : 'hover:bg-slate-50'}`}
                >
                  <span>Registered Events</span>
                  <span className='bg-white border border-slate-200 px-2 py-0.5 rounded-full text-[10px]'>{registeredEvents.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('teams')}
                  className={`w-full py-3 px-4 rounded-xl text-left flex justify-between items-center transition ${activeTab === 'teams' ? 'bg-[#3462AE]/10 text-[#3462AE]' : 'hover:bg-slate-50'}`}
                >
                  <span>My Teams</span>
                  <span className='bg-white border border-slate-200 px-2 py-0.5 rounded-full text-[10px]'>{myTeams.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('camps')}
                  className={`w-full py-3 px-4 rounded-xl text-left flex justify-between items-center transition ${activeTab === 'camps' ? 'bg-[#3462AE]/10 text-[#3462AE]' : 'hover:bg-slate-50'}`}
                >
                  <span>Upskilling Camps</span>
                  <span className='bg-white border border-slate-200 px-2 py-0.5 rounded-full text-[10px]'>{enrolledCourses.length}</span>
                </button>

                <div className="pt-2 border-t border-slate-100 mt-2">
                  <button
                    onClick={logout}
                    className="w-full py-2.5 px-4 rounded-xl text-center bg-red-50 hover:bg-red-100 text-red-600 font-bold transition text-xs shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>🚪</span> Logout Account
                  </button>
                </div>
              </div>
            </div>

            <div className='bg-[#3462AE]/5 border border-[#3462AE]/10 rounded-3xl p-6 text-center'>
              <span className='text-3xl block mb-2'>📱</span>
              <h4 className='font-bold text-slate-900 text-sm'>Access via Mobile App</h4>
              <p className='text-slate-500 text-xs mt-1 mb-4'>Download the official AI Udaan app to access courses, quizzes, and videos offline.</p>
              <div className="flex flex-col gap-2">
                <a href="https://play.google.com/store/apps/details?id=com.nighwantech.aiudaanbootcamp" className="py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold">Download App (Android)</a>
                <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-bold">LMS Backend Sync: Active</span>
              </div>
            </div>
          </div>

          {/* Tab Content Display Area */}
          <div className='lg:col-span-3 space-y-6'>

            {activeTab === 'events' && (
              <div className='bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm'>
                <h3 className='font-bold text-slate-900 text-lg mb-6'>My Registered Hackathons</h3>

                {registeredEvents.length === 0 ? (
                  <div className='text-center py-12'>
                    <span className='text-4xl block mb-4'>🚀</span>
                    <h4 className='font-bold text-slate-900'>No registered hackathons yet</h4>
                    <p className='text-slate-500 text-xs mt-1'>Check out active Flagship Challenges on our homepage and sign up.</p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {registeredEvents.map((ev) => (
                      <div key={ev.id} className='border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#3462AE]/30 transition'>
                        <div className='flex items-center gap-4'>
                          <div className='w-16 h-10 relative rounded-lg overflow-hidden bg-slate-100 shrink-0'>
                            <img src={ev.logo} alt="Event thumbnail" className='object-cover w-full h-full' />
                          </div>
                          <div>
                            <h4 className='font-bold text-slate-900 text-sm sm:text-base'>{ev.title}</h4>
                            <div className='flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-slate-500'>
                              <span className='px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-full font-medium'>{ev.status}</span>
                              <span>•</span>
                              <span>Team: <strong className='text-slate-700'>{ev.team}</strong></span>
                              <span>•</span>
                              <span>Role: <strong>{ev.role}</strong></span>
                            </div>
                          </div>
                        </div>
                        <div className='w-full md:w-auto flex flex-col items-end gap-2'>
                          <span className='text-xs font-bold text-slate-400'>Submission: {ev.progress}%</span>
                          <div className='w-full md:w-36 h-2 bg-slate-100 rounded-full overflow-hidden'>
                            <div className='h-full bg-[#3462AE]' style={{ width: `${ev.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'teams' && (
              <div className='bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm'>
                <h3 className='font-bold text-slate-900 text-lg mb-6'>Collaborative Teams</h3>

                {myTeams.map((team, index) => (
                  <div key={index} className='border border-slate-200 rounded-2xl p-5 space-y-4'>
                    <div className='flex justify-between items-center border-b border-slate-100 pb-3'>
                      <div>
                        <h4 className='font-bold text-slate-900 text-base'>{team.name}</h4>
                        <p className='text-slate-500 text-xs mt-0.5'>Event: {team.event}</p>
                      </div>
                      <span className='px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#3462AE]'>
                        Code: {team.code}
                      </span>
                    </div>
                    <div>
                      <h5 className='text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider'>Team Members</h5>
                      <div className='flex flex-wrap gap-2'>
                        {team.members.map((member, i) => (
                          <span key={i} className='px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-600'>
                            👤 {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'camps' && (
              <div className='space-y-6'>
                {/* Enrolled Courses */}
                <div className='bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm'>
                  <h3 className='font-bold text-slate-900 text-lg mb-6'>My Enrolled Courses</h3>

                  {loadingCourses ? (
                    <div className="py-8 text-center text-sm text-slate-400">Loading your courses...</div>
                  ) : enrolledCourses.length === 0 ? (
                    <div className='text-center py-12'>
                      <span className='text-4xl block mb-4'>📚</span>
                      <h4 className='font-bold text-slate-900'>No courses enrolled yet</h4>
                      <p className='text-slate-500 text-xs mt-1'>Enroll in any of the courses below to start learning.</p>
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {enrolledCourses.map((camp, index) => (
                        <div key={index} className='p-5 border border-slate-200 rounded-2xl bg-slate-50/50 hover:border-[#3462AE]/30 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                          <div>
                            <h4 className='font-bold text-slate-900 text-sm sm:text-base'>{camp.fullname}</h4>
                            <p className='text-slate-500 text-xs mt-1'>Course Code: <strong className="text-slate-700">{camp.shortname}</strong></p>
                          </div>
                          <a
                            href={`https://moodle.aiudaanbootcamp.com/course/view.php?id=${camp.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className='px-4 py-2 bg-[#3462AE] hover:bg-[#1548B7] text-white rounded-xl text-xs font-bold transition shadow-sm'
                          >
                            Go to Class ↗
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Courses for Payment/Registration */}
                <div className='bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm'>
                  <h3 className='font-bold text-slate-900 text-lg mb-6'>Available LMS Courses</h3>

                  {loadingCourses ? (
                    <div className="py-8 text-center text-sm text-slate-400">Loading catalog...</div>
                  ) : allCourses.length === 0 ? (
                    <div className='text-center py-12 text-slate-400 text-sm'>No courses available in catalog.</div>
                  ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {allCourses.map((camp, index) => {
                        const isEnrolled = enrolledCourses.some(ec => ec.id === camp.id)
                        return (
                          <div key={index} className='border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition bg-white'>
                            <div>
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#32B7EC]">LMS CAMPUS</span>
                              <h4 className='font-bold text-slate-900 text-sm sm:text-base mt-1'>{camp.fullname}</h4>
                              <p className='text-slate-500 text-xs mt-1 line-clamp-2' dangerouslySetInnerHTML={{ __html: camp.summary || 'No description available.' }} />
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-900">₹499 (Online Course)</span>
                              {isEnrolled ? (
                                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-3 py-1.5 rounded-full font-bold">
                                  ✓ Enrolled
                                </span>
                              ) : (
                                <Link href="/courses">
                                  <button className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition">
                                    Register & Enrol
                                  </button>
                                </Link>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  )
}