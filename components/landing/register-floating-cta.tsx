'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function RegisterFloatingCTA() {
  const { t } = useLanguage()
  return (
    <>
      {/* Fixed floating CTA for mobile - appears between sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-8 left-4 right-4 md:hidden z-40 flex gap-2"
        style={{ maxWidth: 'calc(100% - 2rem)' }}
      >
        <Link href="/register" className="flex-1 min-w-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-3 text-sm font-bold rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all truncate"
          >
            {t('nav.register')} 🚀
          </motion.button>
        </Link>
      </motion.div>

      {/* Mid-section CTA for desktop (appears between Program Structure and AI SaaS) */}
      <section className="hidden md:block relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Cards container - side by side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left card - Why Register */}
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {t('home.secureYourSeat')}
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>{t('home.limitedSeatsFillingFast')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>{t('home.certificatePortfolio')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>{t('home.networkingExperts')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>{t('home.lifetimeAccess')}</span>
                  </li>
                </ul>
              </motion.div>

              {/* Right card - CTA Button */}
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center text-center"
              >
                <div className="text-5xl mb-6">🎓</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  {t('home.readyTransform')}
                </h3>
                <p className="text-slate-700 mb-8">
                  {t('home.joinHundreds')}
                </p>
                <Link href="/register" className="w-full">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-8 py-4 text-lg font-bold rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    {t('home.registerGetStarted')} 🚀
                  </motion.button>
                </Link>
                <p className="text-sm text-slate-600 mt-4">
                  ⏳ {t('home.seatsRemaining')}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
