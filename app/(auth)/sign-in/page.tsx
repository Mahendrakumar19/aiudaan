'use client'

import { useState, FormEvent, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [stealthLogin, setStealthLogin] = useState(false)
  const [error, setError] = useState('')
  const [timestamp, setTimestamp] = useState('')
  const coordinates = '25°04′N 85°00′E' // AI Udaan region
  const { login, loading } = useAuth()

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

  // Mouse tracking for the spotlight effect
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

  // Active status indicators based on input fields filled status
  const isEmailActive = email.length > 0
  const isPasswordActive = password.length > 0

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
          <span className="cyber-stamp">LEVEL 3 ACCESS</span>
        </div>

        {/* Header */}
        <div className='mb-8 pt-4'>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#39f0d9] font-bold mb-2">
            OPERATIVE IDENTIFICATION
          </div>
          <h1 className='text-2xl font-bold text-white tracking-wider uppercase' data-text="SECURE LOGIN">
            SECURE LOGIN
          </h1>
          <p className='text-slate-400 text-xs mt-2 font-sans'>
            Decrypt credential nodes to access your cohort terminal dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-[10px] font-bold text-[#39f0d9]/80 uppercase tracking-widest mb-2'>
              OPERATIVE EMAIL / USERNAME
            </label>
            <div className='relative'>
              <span className='cyber-input-prefix'>&gt;</span>
              <input
                type='text'
                placeholder='SECURE ID / EMAIL'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='cyber-input'
              />
            </div>
          </div>

          <div>
            <label className='block text-[10px] font-bold text-[#39f0d9]/80 uppercase tracking-widest mb-2'>
              CLEARANCE ACCESS CODE
            </label>
            <div className='relative'>
              <span className='cyber-input-prefix secure'>#</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='PASSWORD HASH'
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

          {/* Form Options */}
          <div className="flex items-center justify-between text-xs tracking-wider">
            <div
              className="flex items-center gap-2 cursor-pointer text-[#39f0d9]/70 hover:text-[#39f0d9] transition"
              onClick={() => setStealthLogin(!stealthLogin)}
            >
              <div className={`cyber-toggle ${stealthLogin ? 'checked' : ''}`}>
                {stealthLogin && <span className="text-[10px] text-slate-900 font-bold">✓</span>}
              </div>
              <span className="text-[10px] font-sans">Enable Stealth Session</span>
            </div>
            
            <a href='#' className='text-[10px] text-[#39f0d9]/70 hover:text-[#39f0d9] transition underline-offset-4 hover:underline'>
              Recover Code
            </a>
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

          {/* Glowing Premium Cyber Authentication Button */}
          <button
            type='submit'
            disabled={loading}
            className='cyber-btn transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 border border-[#39f0d9] border-t-transparent rounded-full animate-spin" />
                AUTHENTICATING NODE...
              </span>
            ) : (
              'INITIALIZE CLEARANCE'
            )}
            
            {/* Embedded Active Indicators */}
            <div className="absolute bottom-2 right-3 flex gap-1.5 z-20">
              <div className={`cyber-indicator ${isEmailActive ? 'active' : ''}`} />
              <div className={`cyber-indicator ${isPasswordActive ? 'active' : ''}`} />
              <div className={`cyber-indicator ${loading ? 'active' : ''}`} />
            </div>
          </button>
        </form>

        {/* Footer Navigation Link */}
        <div className='mt-8 pt-6 border-t border-[#39f0d9]/10 text-center font-sans'>
          <p className='text-slate-400 text-xs'>
            No field credentials node?{' '}
            <Link href='/sign-up' className='font-bold text-[#39f0d9] hover:underline underline-offset-4 tracking-wider transition'>
              REGISTER ACCESS REQUEST
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}