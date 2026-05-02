'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/useToast'
import { fadeUpVariants } from '@/lib/animationVariants'
import { useEffect } from 'react';

interface EnquiryFormData {
  name: string
  email: string
  phone: string
  message: string
}

interface FormErrors {
  [key: string]: string
}

export function EnquiryForm() {
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<EnquiryFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [utmParams, setUtmParams] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const utm = {
      source: urlParams.get('utm_source'),
      medium: urlParams.get('utm_medium'),
      campaign: urlParams.get('utm_campaign'),
      term: urlParams.get('utm_term'),
      content: urlParams.get('utm_content'),
    };
    setUtmParams(utm);
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    return /^\d{10}$/.test(phone.replace(/\D/g, ''))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      addToast('Please fill all required fields correctly', 'error', 4000)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          utmParams,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        addToast(data.message || 'Failed to submit enquiry', 'error', 4000)
        return
      }

      addToast('Enquiry submitted successfully! 🚀', 'success', 4000)

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      })

      // Redirect to success page
      setTimeout(() => {
        const params = new URLSearchParams({
          name: formData.name,
          email: formData.email,
          type: 'enquiry',
        })
        if (typeof window !== 'undefined' && window.location) {
          window.location.href = `/success?${params.toString()}`
        }
      }, 1500)
    } catch (error) {
      console.error('Enquiry error:', error)
      addToast('Something went wrong. Please try again.', 'error', 4000)
    } finally {
      setIsLoading(false)
    }
  }

  const inputContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-4xl relative z-10"
      >
        {/* Header */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Join AI Udaan Bootcamp 2026
            </span>
          </h1>

          <p className="text-gray-400 text-lg">
            Fill your details and secure your seat in this exclusive program
          </p>
        </motion.div>

        {/* Premium Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(139,92,246,0.2)]"
        >
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <motion.div
              custom={0}
              variants={inputContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="block mb-2 text-lg font-medium text-gray-300">
                Full Name <span className="text-red-400">*</span>
              </label>
              <motion.input
                whileHover={{ y: -1 }}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 transition-all duration-300 ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </motion.div>

            {/* Email */}
            <motion.div
              custom={1}
              variants={inputContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="block mb-2 text-lg font-medium text-gray-300">
                Email <span className="text-red-400">*</span>
              </label>
              <motion.input
                whileHover={{ y: -1 }}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 transition-all duration-300 ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </motion.div>

            {/* Phone Number */}
            <motion.div
              custom={2}
              variants={inputContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="block mb-2 text-lg font-medium text-gray-300">
                Mobile Number <span className="text-red-400">*</span>
              </label>
              <motion.input
                whileHover={{ y: -1 }}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10 digit phone number"
                className={`w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 transition-all duration-300 ${
                  errors.phone ? 'border-red-500' : ''
                }`}
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </motion.div>

            {/* Message (Optional) */}
            <motion.div
              custom={3}
              variants={inputContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="block mb-2 text-lg font-medium text-gray-300">
                Message <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <motion.textarea
                whileHover={{ y: -1 }}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us anything else you'd like to share..."
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 transition-all duration-300 resize-none"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              custom={4}
              variants={inputContainerVariants}
              initial="hidden"
              animate="visible"
              className="pt-2"
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-500 hover:bg-cyan-600 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] text-white"
              >
                <div className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit</span>
                      <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </div>
              </motion.button>
            </motion.div>

            {/* Footer text */}
            <motion.p
              custom={5}
              variants={inputContainerVariants}
              initial="hidden"
              animate="visible"
              className="text-center text-gray-400 text-xs"
            >
              Your data is safe with us. We'll never spam you.
            </motion.p>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}
