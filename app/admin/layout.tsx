'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // If the user is on the login page itself, bypass verification
    if (pathname === '/admin') {
      setAuthorized(true)
      return
    }

    const email = localStorage.getItem('adminEmail')
    const password = localStorage.getItem('adminPassword')
    const moodleToken = localStorage.getItem('moodleToken')

    if (!email || (!password && !moodleToken)) {
      router.push('/admin')
      return
    }

    // CMS Dashboard routes (site administration) require hardcoded administrator account credentials
    if (pathname && pathname.startsWith('/admin/cms-dashboard')) {
      if (email === 'admin@aiudaanbootcamp.com') {
        setAuthorized(true)
      } else {
        alert('Access Denied: CMS Dashboard requires central administrator credentials.')
        router.push('/admin/dashboard')
      }
    } else {
      // General dashboard / LMS routes can be accessed by both Moodle administrators and website admin
      setAuthorized(true)
    }
  }, [router, pathname])

  if (!authorized) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#3462ae] mx-auto mb-4'></div>
          <p className='text-slate-500 text-sm font-medium'>Authenticating secure session...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
