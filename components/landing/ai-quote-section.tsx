'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function AIQuoteSection() {
  const { t } = useLanguage()
  return (
    <section className='relative py-12 sm:py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden'>
      <div className='mx-auto max-w-4xl'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='relative'
        >
          {/* Glow background */}
          <div className='hidden' />

          {/* Content */}
          <div className='relative bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-lg'>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className='text-center'
            >
              <p className='text-lg sm:text-2xl md:text-3xl lg:text-5xl font-bold leading-relaxed mb-6 sm:mb-8'>
                <span className='bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent'>
                  {t('home.quotePrefix')}
                </span>
                <br />
                <span className='text-slate-900'>
                  {t('home.quoteSuffix')}
                </span>
              </p>

              <p className='text-base sm:text-lg md:text-2xl text-slate-600'>
                {t('home.quoteCta')}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
