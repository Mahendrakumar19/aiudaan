'use client'

import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animationVariants'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const days = [
  { day: '01', title: 'Foundations & Tools', items: ['AI basics & ChatGPT mastery', 'Design with Canva & AI', 'Content creation fundamentals'], gradient: 'from-cyan-500/10 to-purple-500/10', border: 'border-cyan-500/30' },
  { day: '02', title: 'Advanced AI Tools', items: ['Prompt engineering secrets', 'SaaS tools & automation demo', 'Monetization strategies'], gradient: 'from-purple-500/10 to-pink-500/10', border: 'border-purple-500/30' },
]

export function ProgramStructure() {
  const { t } = useLanguage()
  return (
    <section className='relative py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden'>
      <div className='mx-auto max-w-6xl'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight'>
            {t('home.program')}
            <span className='block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'>
              {t('home.programStructure')}
            </span>
          </h2>
          <p className='text-lg text-slate-300 max-w-3xl mx-auto'>{t('home.structuredTimeline')}</p>
        </motion.div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className='grid gap-8 lg:grid-cols-2'
        >
          {days.map((day) => (
            <motion.div
              key={day.day}
              variants={staggerItemVariants}
              whileHover={{ y: -8 }}
              className='group relative'
            >
              {/* Glow backdrop */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${day.gradient} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Card */}
              <div className={`relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 min-h-[280px] shadow-xl hover:shadow-cyan-500/5 transition-all duration-300`}>
                {/* Day number badge */}
                <div className='flex items-center gap-4 mb-6'>
                  <div className='flex items-center justify-center w-16 h-16 rounded-xl bg-slate-800 border border-white/10 font-black text-2xl text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text'>
                    {day.day}
                  </div>
                  <h3 className='text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors'>{day.title}</h3>
                </div>

                {/* Items list */}
                <ul className='space-y-3'>
                  {day.items.map((item) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      viewport={{ once: true }}
                      className='flex items-start gap-3 text-slate-300 group-hover:text-slate-100 transition-colors'
                    >
                      <span className='w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 mt-2 flex-shrink-0' />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
