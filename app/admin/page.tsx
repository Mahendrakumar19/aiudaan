'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect immediately if already authenticated
  useEffect(() => {
    const savedEmail = localStorage.getItem('adminEmail')
    const savedPassword = localStorage.getItem('adminPassword')
    if (savedEmail && savedPassword) {
      router.push('/admin/dashboard')
    }
  }, [router])

  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.status === 401) {
        setError('Invalid email or password')
        return
      }

      if (!response.ok) throw new Error('Login failed')

      const result = await response.json()
      if (result.success) {
        localStorage.setItem('adminEmail', email)
        localStorage.setItem('adminPassword', password)
        router.push('/admin/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className='bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl max-w-md w-full'
      >
        <div className='text-center mb-8'>
          <div className="w-14 h-14 bg-[#3462ae]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className='text-2xl font-bold text-slate-900 font-syne'>Organizer Portal</h1>
          <p className='text-slate-500 mt-2 text-sm'>AI Udaan Bootcamp Admin</p>
        </div>

        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2'>
              Email or Username
            </label>
            <input
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='admin@aiudaanbootcamp.com or username'
              className='w-full px-4 py-3 border border-slate-200 text-black rounded-xl focus:ring-2 focus:ring-[#3462ae] focus:border-transparent transition'
              required
            />
          </div>

          <div>
            <label className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter password'
              className='w-full px-4 py-3 border text-black border-slate-200 rounded-xl focus:ring-2 focus:ring-[#3462ae] focus:border-transparent transition'
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200'
            >
              ⚠️ {error}
            </motion.div>
          )}

          <button
            type='submit'
            disabled={loading}
            className='w-full px-4 py-3 bg-[#3462ae] hover:bg-[#1548b7] text-white font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md'
          >
            {loading ? '🔄 Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <p className='text-xs text-slate-400 text-center mt-6'>
          💡 Authorized administrators and organizers only
        </p>
      </motion.div>
    </div>
  )
}
