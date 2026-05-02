'use client'

import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animationVariants'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const useCases = [
  'Homework help',
  'Resume creation',
  'Social media content',
  'Business presentations',
  'Personal branding'
]

export function UseCases() {
  const { t } = useLanguage()
  return (
    <section className='relative py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden'>
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight">
            {t('home.realWorld')}
            <span className='block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'>
              {t('home.useCases')}
            </span>
          </h2>
          <p className="text-2xl text-slate-300">{t('home.applyAiSkills')}</p>
        </motion.div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {useCases.map((useCase) => (
            <motion.div
              key={useCase}
              variants={staggerItemVariants}
              whileHover={{ y: -8 }}
              className='group relative'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity' />
              <div className='relative bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:border-cyan-400/30 rounded-2xl p-8 min-h-[200px] flex flex-col items-center justify-center text-center shadow-xl hover:shadow-cyan-500/5 transition-all'>
                <span className='text-3xl mb-4'>💡</span>
                <h3 className='text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors capitalize'>{useCase}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}