/**
 * Payment Failure Page
 * /app/failure/page.tsx
 */

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function FailurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex items-center justify-center py-20 px-4">
      {/* Animated gradient backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-500/20 to-red-500/20 rounded-full blur-3xl opacity-60" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-2xl relative z-10 text-center"
      >
        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-16 shadow-2xl">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full opacity-75 blur-lg" />
              <div className="relative w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-4xl">✕</span>
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Payment Failed
          </h1>

          {/* Description */}
          <p className="text-xl text-slate-300 mb-8">
            Unfortunately, your payment could not be processed. Please try again or contact our support team.
          </p>

          {/* Reasons */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8 text-left">
            <p className="text-sm font-semibold text-slate-300 mb-4">
              Common reasons for payment failure:
            </p>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>✓ Insufficient funds in your account</li>
              <li>✓ Incorrect card or bank details</li>
              <li>✓ Payment gateway timeout</li>
              <li>✓ Network connectivity issues</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/register"
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all inline-block"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="px-8 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all inline-block"
            >
              Go Home
            </Link>
          </div>

          {/* Support */}
          <p className="text-slate-400">
            Still having issues?{' '}
            <a
              href="mailto:info@aiudaanbootcamp.com"
              className="text-cyan-400 hover:underline font-semibold"
            >
              Contact Support
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
