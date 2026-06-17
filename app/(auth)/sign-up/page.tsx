'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [protocolAccepted, setProtocolAccepted] = useState(false)
  const [error, setError] = useState('')
  const { register, loading } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!protocolAccepted) {
      setError('You must accept the terms and conditions')
      return
    }

    try {
      await register(name, email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
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
          <div className='mb-6 text-center'>
            <h1 className='text-3xl font-extrabold text-slate-900 font-syne tracking-tight mb-2'>
              Create Account
            </h1>
            <p className='text-slate-500 text-sm'>
              Register to start your learning journey with AI Udaan.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5'>
                Full Name
              </label>
              <input
                type='text'
                placeholder='Enter your full name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#3462ae] transition duration-200 text-slate-900 placeholder:text-slate-400 bg-white/80'
              />
            </div>

            <div>
              <label className='block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5'>
                Email Address
              </label>
              <input
                type='email'
                placeholder='Enter your email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#3462ae] transition duration-200 text-slate-900 placeholder:text-slate-400 bg-white/80'
              />
            </div>

            <div>
              <label className='block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='At least 6 characters'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#3462ae] transition duration-200 text-slate-900 placeholder:text-slate-400 bg-white/80 pr-12'
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

            <div>
              <label className='block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5'>
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Re-enter your password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#3462ae] transition duration-200 text-slate-900 placeholder:text-slate-400 bg-white/80'
              />
            </div>

            {/* Protocol Acceptance */}
            <div className="flex items-start gap-2.5 text-xs text-slate-600 leading-normal py-2 select-none cursor-pointer" onClick={() => setProtocolAccepted(!protocolAccepted)}>
              <div className={`w-4 h-4 border border-slate-300 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition ${protocolAccepted ? 'bg-[#3462ae] border-[#3462ae]' : 'bg-white'}`}>
                {protocolAccepted && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span>
                I agree to the <span className="font-bold text-[#3462ae]">AI Udaan Terms</span> and accept enrollment guidelines.
              </span>
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
              className='w-full py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-[#3462ae] to-[#1548b7] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2'
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Terms Links */}
          <p className='text-slate-400 text-[10px] text-center mt-4 leading-normal'>
            By signing up, you agree to our{' '}
            <Link href="/terms-and-conditions" className="hover:underline text-[#3462ae] font-semibold">Terms of Service</Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="hover:underline text-[#3462ae] font-semibold">Privacy Policy</Link>.
          </p>

          {/* Sign In Link */}
          <div className='mt-6 pt-5 border-t border-slate-100 text-center'>
            <p className='text-slate-500 text-sm'>
              Already have an account?{' '}
              <Link href='/sign-in' className='font-bold text-[#3462ae] hover:underline underline-offset-4 transition'>
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}