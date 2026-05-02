'use client'

import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animationVariants'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { AboutOrganizerRight } from './about-organizer-client'

const partners = [
  { name: 'Nighwan Technology', description: 'Industry leaders in AI solutions and automation' },
  { name: 'BR Production', description: 'Expert in digital content and media production' }
]

export function AboutOrganizer() {
  const { t } = useLanguage()
  return (
    <section id='about' className='relative py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-visible'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center'>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='space-y-6'
          >
            <h2 className='text-5xl lg:text-6xl font-black text-white leading-tight'>
              {t('about.aboutUs')}
              <span className='block bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent'>
                {t('about.ourOrganizer')}
              </span>
            </h2>
            <h3 className='text-3xl font-bold text-slate-300'>{t('common.buddhainstitute')}</h3>
            <p className='text-slate-400 text-lg'>{t('about.mission')}</p>
            
            {/* Collaboration Section */}
            <div className='space-y-3 pt-4 border-t border-white/10'>
              <p className='text-cyan-400 font-semibold text-lg'>{t('about.collaboration')}</p>
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className='space-y-2'
              >
                {partners.map((partner) => (
                  <motion.div
                    key={partner.name}
                    variants={staggerItemVariants}
                    className='flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-lg'
                  >
                    <div className='w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 mt-1.5 flex-shrink-0' />
                    <div>
                      <p className='text-white font-semibold'>{partner.name}</p>
                      <p className='text-slate-400 text-sm'>{partner.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className='mt-6 p-4 bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 rounded-xl shadow-md'
            >
              <p className='text-blue-300 italic'>{t('about.working')}</p>
            </motion.div>
          </motion.div>

          <AboutOrganizerRight />
        </div>
      </div>
    </section>
  )
}

