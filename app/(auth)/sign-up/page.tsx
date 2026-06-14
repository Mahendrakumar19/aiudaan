'use client'

import { useState, FormEvent, useEffect } from 'react'
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
  const [timestamp, setTimestamp] = useState('')
  const coordinates = '25°04′N 85°00′E' // AI Udaan region
  const { register, loading } = useAuth()

  // Dynamic timestamp updates (UTC)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const utcStr = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      setTimestamp(utcStr)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Mouse tracking for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      document.documentElement.style.setProperty('--mouse-x', `${x}%`)
      document.documentElement.style.setProperty('--mouse-y', `${y}%`)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

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
      setError('You must accept the AI Udaan Field Protocol terms')
      return
    }

    try {
      await register(name, email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  // Active status indicators based on input fields filled status
  const isNameActive = name.length > 0
  const isEmailActive = email.length > 0
  const isPasswordActive = password.length > 5
  const isConfirmActive = confirmPassword.length > 0 && confirmPassword === password

  return (
    <div className='min-h-[90vh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden cyber-auth-body font-mono select-none'>
      {/* Decorative Interactive Background Layers */}
      <div className="cyber-bg" />
      <div className="cyber-noise" />
      <div className="cyber-topo" />

      {/* Sci-Fi Top Grid and Coordinates Area */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start text-[10px] text-[#39f0d9]/60 tracking-widest z-20">
        <div className="flex flex-col gap-1 border-l-2 border-[#39f0d9]/40 pl-3">
          <span>COORDINATES: {coordinates}</span>
          <span>SYSTEM: AI UDAAN SECURE NODE</span>
        </div>
        <div className="flex flex-col gap-1 text-right border-r-2 border-[#39f0d9]/40 pr-3">
          <span>TIMESTAMP: {timestamp || 'LOADING...'}</span>
          <span>STATUS: SECURE TERMINAL</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='w-full max-w-md cyber-glass-panel p-8 md:p-10 relative z-10'
      >
        {/* Topographic Scanner Line Animation */}
        <div className="cyber-scanner-line" />

        {/* Clearances Stamp */}
        <div className="absolute top-6 right-6">
          <span className="cyber-stamp">LEVEL 1 CADET</span>
        </div>

        {/* Header */}
        <div className='mb-6 pt-4'>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#39f0d9] font-bold mb-2">
            OPERATIVE REGISTRATION
          </div>
          <h1 className='text-2xl font-bold text-white tracking-wider uppercase' data-text="REQUEST ACCESS">
            REQUEST ACCESS
          </h1>
          <p className='text-slate-400 text-xs mt-2 font-sans'>
            Register operative node on the secure learning mainframe database.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-[10px] font-bold text-[#39f0d9]/80 uppercase tracking-widest mb-1.5'>
              OPERATIVE FULL NAME
            </label>
            <div className='relative'>
              <span className='cyber-input-prefix'>&gt;</span>
              <input
                type='text'
                placeholder='SURNAME, GIVEN NAME'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='cyber-input'
              />
            </div>
          </div>

          <div>
            <label className='block text-[10px] font-bold text-[#39f0d9]/80 uppercase tracking-widest mb-1.5'>
              FIELD EMAIL ADDRESS
            </label>
            <div className='relative'>
              <span className='cyber-input-prefix'>#</span>
              <input
                type='email'
                placeholder='SECURE EMAIL ADDRESS'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='cyber-input'
              />
            </div>
          </div>

          <div>
            <label className='block text-[10px] font-bold text-[#39f0d9]/80 uppercase tracking-widest mb-1.5'>
              CREATE SECURITY CODE
            </label>
            <div className='relative'>
              <span className='cyber-input-prefix secure'>#</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='MIN 6 CHARS PASSWORD'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='cyber-input pr-12'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-[#39f0d9]/60 hover:text-[#39f0d9] focus:outline-none text-[9px] font-bold tracking-widest uppercase border border-[#39f0d9]/20 px-2 py-0.5 rounded bg-[#0a0d14]'
              >
                {showPassword ? 'HIDE' : 'VIEW'}
              </button>
            </div>
          </div>

          <div>
            <label className='block text-[10px] font-bold text-[#39f0d9]/80 uppercase tracking-widest mb-1.5'>
              CONFIRM ACCESS CODE
            </label>
            <div className='relative'>
              <span className='cyber-input-prefix secure'>#</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='RE-ENTER PASSWORD'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='cyber-input'
              />
            </div>
          </div>

          {/* Protocol Acceptance */}
          <div className="flex items-start gap-2.5 text-[10px] tracking-wide text-slate-300 leading-normal font-sans py-2">
            <div
              className={`cyber-toggle mt-0.5 flex-shrink-0 ${protocolAccepted ? 'checked' : ''}`}
              onClick={() => setProtocolAccepted(!protocolAccepted)}
            >
              {protocolAccepted && <span className="text-[10px] text-slate-900 font-bold">✓</span>}
            </div>
            <span>
              I acknowledge the <span className="text-[#39f0d9] font-mono">AI Udaan Field Protocol</span> and accept security terms for premium cohorts.
            </span>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='p-4 bg-red-950/40 border border-red-500/30 rounded-lg text-red-400 text-xs font-semibold'
            >
              ⚠️ STACK ERROR: {error.toUpperCase()}
            </motion.div>
          )}

          {/* Glowing Premium Cyber Onboarding Button */}
          <button
            type='submit'
            disabled={loading}
            className='cyber-btn transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2'
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 border border-[#39f0d9] border-t-transparent rounded-full animate-spin" />
                CREATING NODE...
              </span>
            ) : (
              'INITIALIZE CLEARANCE'
            )}
            
            {/* Embedded Active Indicators */}
            <div className="absolute bottom-2 right-3 flex gap-1.5 z-20">
              <div className={`cyber-indicator ${isNameActive ? 'active' : ''}`} />
              <div className={`cyber-indicator ${isEmailActive ? 'active' : ''}`} />
              <div className={`cyber-indicator ${isPasswordActive && isConfirmActive ? 'active' : ''}`} />
              <div className={`cyber-indicator ${loading ? 'active' : ''}`} />
            </div>
          </button>
        </form>

        {/* Terms Links */}
        <p className='text-slate-400 text-[9px] text-center mt-4 leading-normal font-sans'>
          By signing up, you agree to our{' '}
          <Link href="/terms-and-conditions" className="hover:underline text-[#39f0d9]">Terms of Service</Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="hover:underline text-[#39f0d9]">Privacy Policy</Link>
        </p>

        {/* Sign In Link */}
        <div className='mt-6 pt-5 border-t border-[#39f0d9]/10 text-center font-sans'>
          <p className='text-slate-400 text-xs'>
            Operative already node registered?{' '}
            <Link href='/sign-in' className='font-bold text-[#39f0d9] hover:underline underline-offset-4 tracking-wider transition'>
              AUTHENTICATE NODE
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}