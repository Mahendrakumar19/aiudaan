'use client'

import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animationVariants'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const learningPoints = [
  'AI Prompt Engineering',
  'Web App Development',
  'UI/UX Design',
  'Content Generation',
  'Deployment & Hosting'
]

const flowSteps = [
  { step: 'Idea', icon: '💡', color: 'from-[#00FFCC] to-[#0099FF]' },
  { step: 'Prompt', icon: '✍️', color: 'from-[#0099FF] to-[#FF0055]' },
  { step: 'Content', icon: '📝', color: 'from-[#FF0055] to-[#00FFCC]' },
  { step: 'Design', icon: '🎨', color: 'from-[#00FFCC] to-[#0099FF]' },
  { step: 'Web Output', icon: '🌐', color: 'from-[#0099FF] to-[#FF0055]' }
]

export function AISaasSession() {
  const { t } = useLanguage()
  return (
    <section className="relative py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-8 leading-tight">
            {t('home.buildReal')}
            <span className='block bg-gradient-to-r from-[#00FFCC] to-[#FF0055] bg-clip-text text-transparent'>
              {t('home.aiWebApplication')}
            </span>
          </h2>
          <p className="text-2xl text-[#00FFCC] font-bold">{t('home.resumeGenerator')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 mb-12 md:mb-16">
          {/* Learning Points */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='relative group'
          >
            <div className='absolute inset-0 bg-gradient-to-br from-[#00FFCC]/10 to-[#FF0055]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity' />
            <div className='relative bg-[#0D1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-xl shadow-[#00FFCC]/5 hover:border-[#00FFCC]/30 hover:shadow-[#00FFCC]/10 transition-all'>
              <h3 className="text-3xl font-bold text-white mb-6">{t('home.whatYouLearn')}</h3>
              <motion.ul
                variants={staggerContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {learningPoints.map((point) => (
                  <motion.li
                    key={point}
                    variants={staggerItemVariants}
                    className="flex items-center gap-3 text-[#8892B0] text-base"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#00FFCC] to-[#0099FF] flex-shrink-0" />
                    <span className="font-medium">{point}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>

          {/* Flow Diagram */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className='relative group'
          >
            <div className='absolute inset-0 bg-gradient-to-br from-[#FF0055]/10 to-[#00FFCC]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity' />
            <div className='relative bg-[#0D1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-xl shadow-[#FF0055]/5 hover:border-[#FF0055]/30 hover:shadow-[#FF0055]/10 transition-all'>
              <h3 className="text-3xl font-bold text-white mb-6 text-center">{t('home.projectFlow')}</h3>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
                {flowSteps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center relative"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-lg shadow-[#00FFCC]/20`}
                    >
                      {step.icon}
                    </motion.div>
                    <span className="text-xs sm:text-sm font-bold text-[#8892B0] mt-2">{step.step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}