'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-20'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='glass-container p-8 w-full max-w-md'
      >
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='heading-2 mb-2'>Welcome Back</h1>
          <p className='text-white/60'>Sign in to your AI Learn NG account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            label='Email or Username'
            type='text'
            placeholder='Enter your Email or Username'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error ? 'Invalid credentials' : undefined}
          />
          <Input
            label='Password'
            type='password'
            placeholder='••••••••'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className='p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm'>
              {error}
            </div>
          )}

          <Button
            type='submit'
            isLoading={loading}
            className='w-full'
          >
            Sign In
          </Button>
        </form>

        {/* Forgot Password */}
        <div className='mt-4 text-center'>
          <a href='#' className='text-primary-400 hover:text-primary-300 text-sm'>
            Forgot password?
          </a>
        </div>

        {/* Divider */}
        <div className='my-6 flex items-center gap-4'>
          <div className='flex-1 h-px bg-white/10'></div>
          <span className='text-white/50 text-sm'>or</span>
          <div className='flex-1 h-px bg-white/10'></div>
        </div>

        {/* Social Login */}
        <div className='space-y-3'>
          <button type='button' className='w-full glass-button-secondary'>
            Continue with Google
          </button>
          <button type='button' className='w-full glass-button-secondary'>
            Continue with GitHub
          </button>
        </div>

        {/* Sign Up Link */}
        <div className='mt-6 text-center'>
          <p className='text-white/60'>
            Don't have an account?{' '}
            <Link href='/sign-up' className='text-primary-400 hover:text-primary-300'>
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}