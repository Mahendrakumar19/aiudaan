'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUpVariants } from '@/lib/animationVariants'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { useLanguage } from '@/lib/i18n/LanguageContext'

function SuccessContent() {
  const searchParams = useSearchParams()
  const name = searchParams?.get('name') || 'Learner'
  const email = searchParams?.get('email') || ''
  const mobile = searchParams?.get('mobile') || ''
  const bootcampType = searchParams?.get('bootcampType') || 'online'
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'standard' | 'online' | null>(null)
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const { addToast } = useToast()
  const { t } = useLanguage()

  const allPlans = {
    offline: [
      {
        id: 'basic',
        name: t('success.withoutAccommodation'),
        price: 999,
        duration: '₹999',
        descriptionKey: 'success.liteDescription',
      },
      {
        id: 'standard',
        name: t('success.withAccommodation'),
        price: 2499,
        duration: '₹2,499',
        descriptionKey: 'success.plusDescription',
      },
    ],
    online: [
      {
        id: 'online',
        name: t('success.onlineBootcamp') || 'Online Bootcamp',
        price: 499,
        duration: '₹499',
        descriptionKey: 'success.onlineDescription',
      },
    ],
  }

  const plans = bootcampType === 'online' ? allPlans.online : allPlans.offline

  const handlePayment = async (plan: 'basic' | 'standard' | 'online') => {
    setSelectedPlan(plan)
    setIsPaymentProcessing(true)
    try {
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email, name, mobile, bootcampType }),
      })
      const orderData = await orderResponse.json()
      if (!orderResponse.ok) throw new Error(orderData.message)
      const { orderId, amount } = orderData
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)
      script.onload = () => {
        const razorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
          amount,
          currency: 'INR',
          name: 'AI Udaan Bootcamp',
          description: `Registration Fee`,
          order_id: orderId,
          prefill: { name, email, contact: mobile },
          handler: async (response: any) => {
            try {
              const verifyResponse = await fetch('/api/payments/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...response, email, name, mobile, plan, bootcampType }),
              })
              if (!verifyResponse.ok) throw new Error('Verification failed')
              setPaymentCompleted(true)
              addToast('Payment successful!', 'success')
            } catch (e) {
              addToast('Verification failed', 'error')
            } finally {
              setIsPaymentProcessing(false)
            }
          },
          theme: { color: '#004AAD' },
        }
        new (window as any).Razorpay(razorpayOptions).open()
      }
    } catch (error: any) {
      addToast(error.message, 'error')
      setIsPaymentProcessing(false)
    }
  }

  if (paymentCompleted) {
    return (
      <div className="min-h-screen relative flex items-center justify-center py-20 px-4">
        <div className="bg-mesh" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-12 rounded-[3rem] text-center max-w-xl border-green-500/20">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
             <span className="text-4xl">✅</span>
          </div>
          <h1 className="font-syne text-4xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-text-secondary mb-8">Welcome aboard, {name}! Your registration for AI Udaan Bootcamp is now fully confirmed.</p>
          <div className="flex flex-col gap-4">
            <a href="https://chat.whatsapp.com/JClGBQQiPW00xf0YkFWjk7" target="_blank" className="btn-primary">Join WhatsApp Group</a>
            <Link href="/" className="glass py-4 rounded-xl font-bold">Back to Home</Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center py-20 px-4">
      <div className="bg-mesh" />
      <div className="grid-lines" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl glass p-10 md:p-16 rounded-[3rem]">
        <div className="text-center mb-12">
           <div className="text-4xl mb-4">🎉</div>
           <h1 className="font-syne text-4xl md:text-5xl font-bold mb-2">Registration <span className="brand-gradient-text">Successful</span></h1>
           <p className="text-text-secondary">Almost there! Select your plan and complete payment to secure your seat.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedPlan(plan.id as any)}
              className={`glass p-8 rounded-3xl border-2 transition-all cursor-pointer ${selectedPlan === plan.id ? 'border-brand-cyan bg-brand-cyan/5' : 'border-white/5'}`}
            >
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-black mb-4 orange-gradient-text">{plan.duration}</div>
              <p className="text-text-secondary text-sm mb-8 leading-relaxed">{t(plan.descriptionKey)}</p>
              <button 
                onClick={() => handlePayment(plan.id as any)}
                disabled={isPaymentProcessing}
                className="btn-primary w-full py-3.5 text-sm"
              >
                {isPaymentProcessing && selectedPlan === plan.id ? 'Processing...' : 'Pay & Confirm'}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h4 className="font-bold mb-4 text-brand-cyan">Your Details</h4>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <span className="text-text-secondary">Name:</span> <span className="font-bold">{name}</span>
            <span className="text-text-secondary">Email:</span> <span className="font-bold truncate">{email}</span>
            <span className="text-text-secondary">Type:</span> <span className="font-bold capitalize">{bootcampType}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-deep flex items-center justify-center text-white">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
