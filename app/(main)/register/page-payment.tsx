/**
 * Registration Page
 * /app/(main)/register/page.tsx
 * 
 * Collects user information and plan selection
 * Stores data in localStorage and redirects to checkout
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PAYMENT_PLANS } from '@/lib/razorpay-utils'

interface FormData {
  name: string
  email: string
  phone: string
  plan: 'basic' | 'standard'
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  plan?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    plan: 'basic',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone.replace(/\D/g, ''))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }

    if (!formData.plan) {
      newErrors.plan = 'Please select a plan'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handlePlanChange = (plan: 'basic' | 'standard') => {
    setFormData((prev) => ({
      ...prev,
      plan,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Store registration data in localStorage
      localStorage.setItem('registrationData', JSON.stringify(formData))

      // Redirect to checkout
      router.push('/checkout')
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ plan: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated gradient backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Join AI Udaan
          </h1>
          <p className="text-lg text-slate-300">
            Register for the 2-Day Bootcamp and Master AI Tools
          </p>
        </motion.div>

        {/* Registration Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition-all"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition-all"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                Phone Number (10 digits) *
              </label>
              <div className="flex items-center">
                <span className="px-4 py-3 bg-white/5 border border-r-0 border-white/10 rounded-l-lg text-white text-sm font-semibold">
                  +91
                </span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  maxLength={10}
                  className="flex-1 px-4 py-3 rounded-r-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition-all"
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Plan Selection */}
            <div>
              <label className="block text-sm font-semibold text-white mb-4">
                Select Plan *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(PAYMENT_PLANS).map(([key, plan]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handlePlanChange(key as 'basic' | 'standard')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.plan === key
                        ? 'border-cyan-400 bg-cyan-400/10 ring-2 ring-cyan-400/50'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-white">{plan.name}</h3>
                        <p className="text-sm text-slate-300 mt-1">
                          {plan.description}
                        </p>
                      </div>
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        formData.plan === key
                          ? 'border-cyan-400 bg-cyan-400'
                          : 'border-white/30'
                      }`}>
                        {formData.plan === key && (
                          <span className="text-white text-sm font-bold">✓</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xl font-black text-cyan-400 mt-2">
                      ₹{plan.price}
                    </p>
                    <ul className="text-xs text-slate-300 mt-2 space-y-1">
                      {plan.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx}>✓ {feature}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
              {errors.plan && (
                <p className="text-red-400 text-sm mt-2">{errors.plan}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 mt-8 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Processing...' : 'Continue to Payment'}
            </button>

            {/* Terms */}
            <p className="text-xs text-slate-400 text-center">
              By registering, you agree to our{' '}
              <Link href="/terms-and-conditions" className="text-cyan-400 hover:underline">
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="text-cyan-400 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-slate-400 text-sm mt-8"
        >
          Questions? Contact us at{' '}
          <a href="mailto:info@aiudaanbootcamp.com" className="text-cyan-400 hover:underline">
            info@aiudaanbootcamp.com
          </a>
        </motion.p>
      </div>
    </div>
  )
}
