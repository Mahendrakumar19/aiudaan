'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const demoPoints = [
  'Real-time AI content creation',
  'Resume generator demo',
  'Full workflow demonstration'
]

export function LiveDemo() {
  const { t } = useLanguage()
  return (
    <section className="relative py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight">
            {t('home.live')}
            <span className='block bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent'>
              {t('home.demo')}
            </span>
          </h2>
          <p className="text-2xl text-slate-300">{t('home.seePower')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='relative group'
        >
          <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-3xl opacity-50' />
          <div className='relative backdrop-blur-xl bg-slate-900/50 border border-white/10 rounded-2xl p-10 shadow-2xl shadow-cyan-500/5'>
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-pink-500/10 border border-white/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-md"
              >
                🎥
              </motion.div>
              <h3 className="text-3xl font-bold text-white">Interactive {t('home.liveSession')}</h3>
            </div>

            <div className="space-y-3">
              {demoPoints.map((point, index) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-3 backdrop-blur-lg bg-slate-800/50 border border-white/10 rounded-xl hover:border-cyan-400/30 shadow-md transition"
                >
                  <span className='w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 flex-shrink-0' />
                  <span className="text-white font-medium">{point}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}