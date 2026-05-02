'use client'

import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animationVariants'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const earningOpportunities = [
  {
    title: 'Freelancing',
    icon: '💼',
    description: 'Create AI content for clients',
    gradient: 'from-cyan-500/10 to-blue-500/10',
    border: 'border-cyan-500/30',
  },
  {
    title: 'Internships',
    icon: '🏢',
    description: 'AI-focused company positions',
    gradient: 'from-cyan-500/10 to-purple-500/10',
    border: 'border-cyan-500/30',
  },
  {
    title: 'Client Work',
    icon: '🤝',
    description: 'Direct business opportunities',
    gradient: 'from-purple-500/10 to-pink-500/10',
    border: 'border-purple-500/30',
  },
  {
    title: 'Content Income',
    icon: '💰',
    description: 'Monetize your AI creations',
    gradient: 'from-pink-500/10 to-rose-500/10',
    border: 'border-pink-500/30',
  }
]

export function Earning() {
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
          <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-8 leading-tight'>
            {t('home.startEarning')}
            <span className='block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'>
              {t('home.withAiSkills')}
            </span>
          </h2>
          <p className='text-xl text-slate-300'>{t('home.turnLearning')}</p>
        </motion.div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {earningOpportunities.map((opportunity) => (
            <motion.div
              key={opportunity.title}
              variants={staggerItemVariants}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Glow backdrop */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${opportunity.gradient} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              {/* Card */}
              <div className={`relative bg-slate-900/50 border border-white/10 rounded-2xl p-8 min-h-[240px] flex flex-col items-center justify-center text-center shadow-xl hover:shadow-cyan-500/5 transition-all duration-300`}>
                {/* Icon container */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className='w-16 h-16 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-3xl mb-4 shadow-md'
                >
                  {opportunity.icon}
                </motion.div>

                {/* Title */}
                <h3 className='text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors'>
                  {opportunity.title}
                </h3>

                {/* Description */}
                <p className='text-lg text-slate-300 group-hover:text-slate-100 transition-colors'>
                  {opportunity.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}