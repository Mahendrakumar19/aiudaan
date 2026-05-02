'use client'

import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animationVariants'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const activities = [
  'Create resume',
  'Create social media post',
  'AI content creation'
]

export function StudentActivity() {
  const { t } = useLanguage()
  return (
    <section className='relative py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden'>
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight">
            {t('home.student')}
            <span className='block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
              {t('home.activity')}
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='relative group'
        >
          <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur-3xl opacity-50' />
          <div className='relative backdrop-blur-xl bg-slate-900/50 border border-white/10 rounded-2xl p-10 shadow-2xl shadow-purple-500/5'>
            <div className="text-center mb-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-md"
              >
                🎯
              </motion.div>
              <h3 className="text-3xl font-bold text-white">{t('home.handsOnLearning')}</h3>
            </div>

            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-3"
            >
              {activities.map((activity) => (
                <motion.div
                  key={activity}
                  variants={staggerItemVariants}
                  className="flex items-center gap-3 text-slate-300 p-3 backdrop-blur-lg bg-slate-800/50 border border-white/10 rounded-lg hover:border-purple-400/30 shadow-md transition"
                >
                  <span className='w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex-shrink-0' />
                  <span className="font-medium capitalize">{activity}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}