'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function AboutOrganizerRight() {
  const { t } = useLanguage()
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className='flex items-center justify-center'
    >
      <div className='relative w-full max-w-md z-10'>
        {/* Glow backdrop */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl blur-3xl pointer-events-none' />
        
        {/* Card */}
        <div className='relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden space-y-6 z-20'>
          <div className='relative w-full h-64 rounded-xl overflow-hidden'>
            <Image
              src='/images/college.jpeg'
              alt='Buddha Institute of Technology'
              fill
              className='object-cover'
              loading='lazy'
              sizes='(max-width: 768px) 100vw, 448px'
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              try {
                if (typeof window !== 'undefined' && window.open) {
                  window.open('https://maps.app.goo.gl/QDo2bbL8TccbWUoA7', '_blank')
                }
              } catch (error) {
                console.error('Error opening map:', error)
              }
            }}
            className='block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl text-center transition-all duration-300 cursor-pointer'
          >
            🗺️ {t('about.directions')}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
