'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function EnquireCTA() {
  const router = useRouter()
  const { t } = useLanguage()

  const handleClick = () => {
    router.push('/enquire')
  }

  return (
    <section id="questions" className="relative py-20 px-4 w-full max-w-full overflow-x-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="w-full h-full bg-gradient-to-b from-blue-50 via-transparent to-purple-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl mx-auto text-center relative z-10"
      >
        <h2 className="text-3xl md:text-4xl font-black mb-6">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('contact.haveQuestions')}
          </span>
        </h2>

        <p className="text-slate-700 text-lg mb-10">
          {t('contact.doubtHelp')}
        </p>

        <motion.button
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="relative inline-block"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />

          {/* Button */}
          <div className="relative px-10 py-4 rounded-full font-bold text-lg text-white bg-blue-600 hover:bg-blue-700 hover:shadow-2xl transition-all duration-300 flex items-center gap-2 group">
            Enquire Now
            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </motion.button>

        <p className="text-slate-600 text-sm mt-8">
          {t('contact.joinStudents')}
        </p>

        {/* Contact Information */}
        <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex items-center gap-3 bg-slate-100 border border-slate-300 rounded-lg px-6 py-4 hover:bg-slate-200 transition-all duration-300">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm text-slate-600">{t('contact.emailLabel')}</p>
              <a href="mailto:info@aiudaanbootcamp.com" className="text-slate-900 font-semibold hover:text-blue-600 transition">
                info@aiudaanbootcamp.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-100 border border-slate-300 rounded-lg px-6 py-4 hover:bg-slate-200 transition-all duration-300">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm text-slate-600">{t('contact.phoneLabel')}</p>
              <a href="tel:+919934044018" className="text-slate-900 font-semibold hover:text-blue-600 transition">
                +91 9934044018
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
