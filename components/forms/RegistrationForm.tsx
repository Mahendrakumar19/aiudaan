'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/useToast'
import { fadeUpVariants } from '@/lib/animationVariants'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { stateDistrictMap, states } from '@/lib/state-district-map'

interface FormData {
  name: string
  mobile: string
  email: string
  address: string
  state: string
  district: string
  class: string
  aiDomain: string
  otherAiDomain: string
  source: string
  interest: string
  bootcampType: string
}

interface FormErrors {
  [key: string]: string
}

interface RegistrationFormProps {
  onSuccess?: () => void
  isModal?: boolean
}

export function RegistrationForm({ onSuccess, isModal = false }: RegistrationFormProps = {}) {
  const { addToast } = useToast()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    name: '',
    mobile: '',
    email: '',
    address: '',
    state: '',
    district: '',
    class: '',
    aiDomain: '',
    otherAiDomain: '',
    source: '',
    interest: '',
    bootcampType: 'online', // Default to online
  })
  const [otpSent, setOtpSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState('')

  const availableDistricts = useMemo(() => {
    return formData.state ? stateDistrictMap[formData.state] || [] : []
  }, [formData.state])

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validateMobile = (mobile: string) => /^\d{10}$/.test(mobile.replace(/\D/g, ''))

  const sendOTP = async () => {
    setOtpError('')
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setOtpError(t('errors.invalidEmail'))
      return
    }
    setOtpLoading(true)
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      })
      if (!response.ok) throw new Error('Failed to send OTP')
      setOtpSent(true)
      addToast(t('register.otpSentSuccess'), 'success')
    } catch (error) {
      setOtpError(t('register.failedSendOTP'))
    } finally {
      setOtpLoading(false)
    }
  }

  const verifyOTP = async () => {
    setOtpError('')
    if (!otp.trim()) return
    setOtpLoading(true)
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      })
      if (!response.ok) throw new Error('Invalid OTP')
      setEmailVerified(true)
      addToast(t('register.otpVerified'), 'success')
    } catch (error) {
      setOtpError(t('register.invalidOTP'))
    } finally {
      setOtpLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'email') {
      setEmailVerified(false)
      setOtpSent(false)
    }
    setFormData(prev => ({ ...prev, [name]: value, ...(name === 'state' ? { district: '' } : {}) }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailVerified) {
      addToast('Please verify your email first', 'error')
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error('Registration failed')
      addToast(t('register.registrationSuccessful'), 'success')
      if (onSuccess) onSuccess()
      window.location.href = `/success?name=${formData.name}&email=${formData.email}`
    } catch (error) {
      addToast(t('errors.somethingWrong'), 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`w-full max-w-4xl mx-auto ${isModal ? '' : 'py-12 px-6'}`}>
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeUpVariants}
        className={`${isModal ? '' : 'glass p-8 md:p-12 rounded-[2.5rem] border-white/10'}`}
      >
        <div className="text-center mb-10">
          <h2 className="font-syne text-3xl md:text-4xl font-bold mb-3">
            Join the <span className="brand-gradient-text">AI Revolution</span>
          </h2>
          <p className="text-text-secondary">Fill in the details to secure your spot for the 8-9 May batch.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:border-brand-cyan outline-none transition-all"
              />
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Mobile Number *</label>
              <input
                type="tel"
                name="mobile"
                required
                value={formData.mobile}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:border-brand-cyan outline-none transition-all"
              />
            </div>

            {/* Email & OTP */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-200">Email Address *</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  name="email"
                  required
                  disabled={emailVerified}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:border-brand-cyan outline-none transition-all disabled:opacity-50"
                />
                {!emailVerified && (
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={otpLoading || !formData.email}
                    className="btn-primary py-3 px-6 text-sm"
                  >
                    {otpLoading ? 'Sending...' : otpSent ? 'Resend OTP' : 'Verify Email'}
                  </button>
                )}
                {emailVerified && (
                  <div className="px-6 py-3.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-bold flex items-center gap-2">
                    ✓ Verified
                  </div>
                )}
              </div>
              {otpSent && !emailVerified && (
                <div className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="flex-1 bg-brand-blue/10 border border-brand-blue/30 rounded-xl px-4 py-3.5 focus:border-brand-cyan outline-none"
                  />
                  <button
                    type="button"
                    onClick={verifyOTP}
                    className="btn-orange py-3 px-6 text-sm"
                  >
                    {otpLoading ? 'Verifying...' : 'Confirm OTP'}
                  </button>
                </div>
              )}
              {otpError && <p className="text-red-400 text-xs mt-1">{otpError}</p>}
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">State *</label>
              <select
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:border-brand-cyan outline-none transition-all appearance-none"
              >
                <option value="" className="bg-bg-deep">Select State</option>
                {states.map(s => <option key={s} value={s} className="bg-bg-deep">{s}</option>)}
              </select>
            </div>

            {/* District */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">District *</label>
              <select
                name="district"
                required
                disabled={!formData.state}
                value={formData.district}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:border-brand-cyan outline-none transition-all appearance-none disabled:opacity-50"
              >
                <option value="" className="bg-bg-deep">Select District</option>
                {availableDistricts.map(d => <option key={d} value={d} className="bg-bg-deep">{d}</option>)}
              </select>
            </div>

            {/* Class */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Education *</label>
              <select
                name="class"
                required
                value={formData.class}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:border-brand-cyan outline-none transition-all appearance-none"
              >
                <option value="" className="bg-bg-deep">Highest Qualification</option>
                {['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Others'].map(o => <option key={o} value={o} className="bg-bg-deep">{o}</option>)}
              </select>
            </div>

            {/* Interest Area */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Interested Track *</label>
              <select
                name="aiDomain"
                required
                value={formData.aiDomain}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:border-brand-cyan outline-none transition-all appearance-none"
              >
                <option value="" className="bg-bg-deep">Choose Domain</option>
                {['AI Filmmaking', 'AI Web App Development', 'AI-Powered Digital Marketing', 'AI Automation', 'Prompt Engineering'].map(o => <option key={o} value={o} className="bg-bg-deep">{o}</option>)}
              </select>
            </div>
          </div>

          {/* Bootcamp Type */}
          <div className="space-y-4 pt-4">
            <label className="text-sm font-semibold text-slate-200">Workshop Mode *</label>
            <div className="grid grid-cols-2 gap-4">
              {['online', 'offline'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, bootcampType: type }))}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                    formData.bootcampType === type 
                    ? 'border-brand-cyan bg-brand-cyan/5 text-white shadow-lg shadow-brand-cyan/10' 
                    : 'border-white/10 bg-white/5 text-text-secondary hover:border-white/20'
                  }`}
                >
                  <span className="font-bold capitalize">{type} Batch</span>
                  <span className="text-[10px] opacity-60">{type === 'online' ? '8-9 May 2026' : 'Upcoming in Patna'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-orange w-full py-5 text-xl font-black uppercase tracking-wider"
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                'Secure My Spot Now'
              )}
            </button>
            <p className="text-center text-[10px] text-text-secondary mt-4 opacity-60">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
