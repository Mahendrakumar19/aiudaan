/**
 * Checkout Page
 * /app/checkout/page.tsx
 * 
 * Initializes Razorpay payment and handles verification
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { RegistrationData, PaymentVerificationRequest } from '@/types/payment'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<RegistrationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Retrieve registration data from localStorage
    const savedData = localStorage.getItem('registrationData')
    if (!savedData) {
      router.push('/register')
      return
    }

    try {
      const data = JSON.parse(savedData) as RegistrationData
      setUserData(data)
    } catch (error) {
      console.error('Error parsing registration data:', error)
      router.push('/register')
    }
  }, [router])

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => {
      console.log('Razorpay script loaded')
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const createOrder = async () => {
    if (!userData) return

    setIsLoading(true)
    setError('')

    try {
      // Call backend to create order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData,
          plan: userData.plan,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create order')
      }

      initializeRazorpay(data)
    } catch (err: any) {
      console.error('Error creating order:', err)
      setError(err.message || 'Failed to initialize payment')
    } finally {
      setIsLoading(false)
    }
  }

  const initializeRazorpay = (data: any) => {
    if (!window.Razorpay) {
      setError('Payment service not available')
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: data.orderId,
      amount: data.amount * 100, // Convert to paise
      currency: data.currency,
      name: 'AI Udaan Bootcamp',
      description: `Registration - ${data.planDetails.name}`,
      prefill: {
        name: userData?.name,
        email: userData?.email,
        contact: userData?.phone,
      },
      handler: handlePaymentSuccess,
      modal: {
        ondismiss: () => {
          console.log('Payment modal closed')
          setError('Payment cancelled')
        },
      },
    }

    const razorpay = new window.Razorpay(options)
    razorpay.on('payment.failed', handlePaymentFailure)
    razorpay.open()
  }

  const handlePaymentSuccess = async (response: any) => {
    console.log('Payment successful:', response)
    setIsLoading(true)

    try {
      // Verify payment on backend
      const verificationData: PaymentVerificationRequest = {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        userData: userData!,
      }

      const verifyResponse = await fetch('/api/payments/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationData),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyData.success) {
        throw new Error(verifyData.message || 'Payment verification failed')
      }

      console.log('Payment verified successfully')

      // Clear localStorage
      localStorage.removeItem('registrationData')

      // Redirect to success page with query params
      const params = new URLSearchParams({
        name: userData?.name || '',
        email: userData?.email || '',
        mobile: userData?.phone || '',
        orderId: response.razorpay_order_id,
        registrationId: verifyData.registrationId,
      })

      router.push(`/success?${params.toString()}`)
    } catch (err: any) {
      console.error('Payment verification error:', err)
      setError(err.message || 'Payment verification failed')
      // Still redirect to failure but user can retry
      router.push('/failure')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentFailure = (error: any) => {
    console.error('Payment failed:', error)
    setError(`Payment failed: ${error.description}`)
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated gradients */}
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
            Complete Your Registration
          </h1>
          <p className="text-lg text-slate-300">
            Secure payment via Razorpay
          </p>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl mb-6"
        >
          {/* Registration Details */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Registration Summary</h2>

            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-slate-300">Name</span>
              <span className="text-white font-semibold">{userData.name}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-slate-300">Email</span>
              <span className="text-white font-semibold">{userData.email}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-slate-300">Phone</span>
              <span className="text-white font-semibold">+91 {userData.phone}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-slate-300">Plan</span>
              <span className="text-white font-semibold">
                {userData.plan === 'standard'
                  ? 'With Accommodation'
                  : 'Without Accommodation'}
              </span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t-2 border-cyan-400/30">
              <span className="text-lg font-bold text-white">Amount to Pay</span>
              <span className="text-2xl font-black text-cyan-400">
                ₹{userData.plan === 'standard' ? '2,499' : '999'}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Payment Button */}
          <button
            onClick={createOrder}
            disabled={isLoading}
            className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
          >
            {isLoading ? 'Processing...' : 'Pay Now with Razorpay'}
          </button>

          {/* Security Info */}
          <p className="text-xs text-slate-400 text-center mt-6">
            🔒 Secure payment powered by Razorpay. Your data is encrypted and safe.
          </p>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-slate-400 text-sm"
        >
          Having issues? Contact us at{' '}
          <a href="mailto:info@aiudaanbootcamp.com" className="text-cyan-400 hover:underline">
            info@aiudaanbootcamp.com
          </a>
        </motion.p>
      </div>
    </div>
  )
}
