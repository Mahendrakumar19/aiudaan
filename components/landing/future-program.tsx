'use client'

import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animationVariants'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const futureFeatures = [
  'Advanced AI techniques',
  'Automation workflows',
  'Freelancing strategies'
]

export function FutureProgram() {
  const { t } = useLanguage()
  return (
    <section className="relative py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight">
            {t('home.future')}
            <span className='block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
              {t('home.program')}
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
          <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl blur-3xl opacity-50' />
          <div className='relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-xl shadow-cyan-500/5'>
            <div className="text-center mb-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-md"
              >
                🚀
              </motion.div>
              <h3 className="text-3xl font-bold text-white">AI Udaan {t('home.advancedProgram')}</h3>
            </div>

            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-3"
            >
              {futureFeatures.map((feature) => (
                <motion.div
                  key={feature}
                  variants={staggerItemVariants}
                  className="flex items-center gap-3 text-slate-300 p-3 backdrop-blur-xl bg-slate-800/50 border border-white/10 rounded-lg hover:border-cyan-400/30 shadow-md transition"
                >
                  <span className='w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex-shrink-0' />
                  <span className="font-medium capitalize">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}