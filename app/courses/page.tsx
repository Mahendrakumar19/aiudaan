'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks'


export default function CoursesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/courses/moodle')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.courses) {
          setCourses(data.courses)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load Moodle courses', err)
        setLoading(false)
      })
  }, [])

  const handleBuyNow = (course: any) => {
    // Save selection to local storage
    localStorage.setItem('checkoutCourse', JSON.stringify({
      id: course.id,
      title: course.fullname,
      shortname: course.shortname,
      summary: course.summary || '',
      price: 499 // Moodle course standard price
    }))

    if (isAuthenticated) {
      router.push('/checkout')
    } else {
      // Prompt auth check gateway: redirect to sign-in page with return URL
      router.push('/sign-in?redirect=/checkout')
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden py-20 px-4 md:px-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-gradient-to-b from-[#3462ae]/5 to-transparent rounded-full blur-3xl opacity-70" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#3462ae] font-bold">LMS Storefront</span>
          <h1 className="font-syne text-4xl sm:text-6xl font-black text-slate-900 mt-3">
            Explore AI Udaan Courses
          </h1>
          <p className="text-slate-500 mt-4 leading-relaxed">
            Gain immediate access to premium, structured certifications hosted on our connected learning management system. Register, complete payment, and begin learning.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="border border-slate-200 rounded-3xl p-6 h-[280px] bg-white animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl">
            <span className="text-4xl block mb-4">📚</span>
            <h3 className="font-bold text-slate-900 text-lg">No courses found</h3>
            <p className="text-slate-500 text-sm mt-1">Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition duration-300"
              >
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      {course.shortname}
                    </span>
                    <span className="text-lg font-black text-[#3462ae]">₹499</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl mt-4 leading-snug">
                    {course.fullname}
                  </h3>
                  <div 
                    className="text-slate-500 text-xs mt-3 leading-relaxed line-clamp-3" 
                    dangerouslySetInnerHTML={{ __html: course.summary || 'Unlock structured, certification-driven technical upskilling on AI Udaan.' }}
                  />
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <button
                    onClick={() => handleBuyNow(course)}
                    className="w-full py-3.5 bg-[#3462AE] hover:bg-[#1548B7] text-white rounded-2xl font-bold transition flex items-center justify-center gap-2 text-sm shadow-md"
                  >
                    Buy Now & Enroll
                    <span>→</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
