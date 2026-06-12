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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-slate-600 shadow-sm">
          Loading your registration...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-80" />
        <div className="absolute -bottom-28 -left-24 w-72 h-72 bg-amber-50 rounded-full blur-3xl opacity-80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500 shadow-sm">
            Secure checkout
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 mb-4 mt-5">
            Complete your registration
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Review your details and finish payment with Razorpay. This checkout is intentionally calm, clear, and easy to complete on mobile.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: 'easeOut' }}
          className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-[0_16px_50px_rgba(15,23,42,0.06)] mb-6"
        >
          <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-8 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-blue font-black">₹</div>
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Registration summary</h2>
                  <p className="text-sm text-slate-500">Your plan and personal details</p>
                </div>
              </div>

              <div className="space-y-4 rounded-[1.5rem] bg-slate-50 border border-slate-200 p-5">
                <div className="flex justify-between items-center gap-4 pb-4 border-b border-slate-200">
                  <span className="text-slate-500">Name</span>
                  <span className="text-slate-950 font-semibold text-right">{userData.name}</span>
                </div>

                <div className="flex justify-between items-center gap-4 pb-4 border-b border-slate-200">
                  <span className="text-slate-500">Email</span>
                  <span className="text-slate-950 font-semibold text-right break-all">{userData.email}</span>
                </div>

                <div className="flex justify-between items-center gap-4 pb-4 border-b border-slate-200">
                  <span className="text-slate-500">Phone</span>
                  <span className="text-slate-950 font-semibold">+91 {userData.phone}</span>
                </div>

                <div className="flex justify-between items-center gap-4 pb-4 border-b border-slate-200">
                  <span className="text-slate-500">Plan</span>
                  <span className="text-slate-950 font-semibold text-right">
                    {userData.plan === 'standard' ? 'With Accommodation' : 'Without Accommodation'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-bold text-slate-950">Amount to pay</span>
                  <span className="text-3xl font-black text-brand-blue">
                    ₹{userData.plan === 'standard' ? '2,499' : '999'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.5rem] bg-white border border-slate-200 p-5 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">Checkout flow</h3>
                <div className="mt-4 space-y-3">
                  {[
                    'Confirm your details',
                    'Open Razorpay payment',
                    'Verify and redirect to success',
                  ].map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700">0{index + 1}</div>
                      <span className="text-sm text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm leading-relaxed">
                  {error}
                </div>
              )}

              <button
                onClick={createOrder}
                disabled={isLoading}
                className="w-full px-6 py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-brand-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-[0_14px_30px_rgba(37,99,235,0.18)]"
              >
                {isLoading ? 'Processing payment...' : 'Pay now with Razorpay'}
              </button>

              <p className="text-xs text-slate-500 text-center leading-relaxed">
                Secure payment powered by Razorpay. Your details are encrypted and your registration remains protected.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-slate-500 text-sm mt-6"
        >
          Having issues? Contact us at{' '}
          <a href="mailto:info@aiudaanbootcamp.com" className="text-brand-blue hover:underline">
            info@aiudaanbootcamp.com
          </a>
        </motion.p>
      </div>
    </div>
  )
}
