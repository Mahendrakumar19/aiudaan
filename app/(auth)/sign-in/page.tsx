'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login, loading } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    }
  }

  return (
    <div className='min-h-[95vh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden'>
      {/* Premium Background Elements */}
      <div className="bg-mesh" />
      <div className="grid-lines" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-syne text-2xl font-black tracking-tight bg-gradient-to-r from-[#3462ae] to-[#1548b7] bg-clip-text text-transparent">
              AI UDAAN
            </span>
          </Link>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full glass p-8 md:p-10 rounded-3xl relative overflow-hidden'
        >
          {/* Header */}
          <div className='mb-8 text-center'>
            <h1 className='text-3xl font-extrabold text-slate-900 font-syne tracking-tight mb-2'>
              Welcome Back
            </h1>
            <p className='text-slate-500 text-sm'>
              Sign in to access your course cohorts and dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2'>
                Email or Username
              </label>
              <input
                type='text'
                placeholder='Enter your email or Moodle username'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#3462ae] transition duration-200 text-slate-900 placeholder:text-slate-400 bg-white/80'
              />
            </div>

            <div>
              <label className='block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#3462ae] transition duration-200 text-slate-900 placeholder:text-slate-400 bg-white/80 pr-12'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none text-xs font-bold tracking-wider'
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold'
              >
                {error}
              </motion.div>
            )}

            {/* CTA Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-[#3462ae] to-[#1548b7] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Navigation Link */}
          <div className='mt-8 pt-6 border-t border-slate-100 text-center'>
            <p className='text-slate-500 text-sm'>
              Don't have an account?{' '}
              <Link href='/sign-up' className='font-bold text-[#3462ae] hover:underline underline-offset-4 transition'>
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}