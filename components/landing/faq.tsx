'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: 'faq.q1',
    answer: 'faq.a1',
  },
  {
    question: 'faq.q2',
    answer: 'faq.a2',
  },
  {
    question: 'faq.q3',
    answer: 'faq.a3',
  },
  {
    question: 'faq.q4',
    answer: 'faq.a4',
  },
  {
    question: 'faq.q5',
    answer: 'faq.a5',
  },
]

export function FAQ() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id='faq' className='relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden'>
      {/* Background gradient */}
      <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      </div>

      <div className='mx-auto max-w-3xl relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className='text-center mb-12'
        >
          <h2 className='text-4xl md:text-5xl font-black text-white mb-4 leading-tight'>
            {t('faq.title')}
          </h2>
          <p className='text-lg text-slate-300'>
            {t('faq.subtitle')}
          </p>
        </motion.div>

        <div className='space-y-4'>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='border border-white/10 rounded-xl overflow-hidden bg-slate-900/50 backdrop-blur-xl shadow-xl hover:shadow-cyan-500/5 transition-shadow'
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className='w-full flex items-center justify-between p-4 sm:p-6 hover:bg-slate-800/50 transition-colors'
              >
                <h3 className='text-left text-base sm:text-lg font-semibold text-white pr-4'>
                  {t(faq.question)}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className='flex-shrink-0'
                >
                  <ChevronDownIcon className='w-5 h-5 text-cyan-400' />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className='border-t border-white/10'
                  >
                    <p className='p-4 sm:p-6 text-slate-300 text-base leading-relaxed'>
                      {t(faq.answer)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className='mt-12 text-center'
        >
          <p className='text-slate-300 mb-4'>
            {t('faq.notFound')}
          </p>
          <a
            href='/register'
            className='inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-purple-600 shadow-lg hover:shadow-cyan-500/25 transition-all'
          >
            Register Now
          </a>
        </motion.div>
      </div>
    </section>
  )
}
