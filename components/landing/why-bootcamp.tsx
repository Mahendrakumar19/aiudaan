'use client'

import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animationVariants'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const features = [
  { icon: '💻', title: 'No Coding Required', text: 'Learn AI without complex programming', gradient: 'from-[#00FFCC]/10 to-[#0099FF]/10', border: 'border-[#00FFCC]/30' },
  { icon: '🌱', title: 'Beginner-Friendly', text: 'Friendly curriculum for first-time learners', gradient: 'from-[#0099FF]/10 to-[#FF0055]/10', border: 'border-[#0099FF]/30' },
  { icon: '🛠️', title: '100% Practical Learning', text: 'Hands-on sessions with real tools', gradient: 'from-[#FF0055]/10 to-[#00FFCC]/10', border: 'border-[#FF0055]/30' },
  { icon: '🎯', title: 'Real-World Projects', text: 'Build projects for resumes', gradient: 'from-[#00FFCC]/10 to-[#FF0055]/10', border: 'border-[#00FFCC]/30' },
  { icon: '💼', title: 'Career-Focused', text: 'Job & internship readiness', gradient: 'from-[#FF0055]/10 to-[#0099FF]/10', border: 'border-[#FF0055]/30' },
]

export function WhyThisBootcamp() {
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
            {t('home.whyThis')}
            <span className='block bg-gradient-to-r from-[#00FFCC] via-[#0099FF] to-[#FF0055] bg-clip-text text-transparent'>
              {t('home.bootcamp')}
            </span>
          </h2>
          <p className='text-lg text-[#8892B0] max-w-3xl mx-auto'>
            {t('home.trustedProgram')}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className='grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3'
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerItemVariants}
              whileHover={{ y: -8 }}
              className='group relative'
            >
              {/* Glow backdrop */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Card */}
              <div className={`relative bg-[#0D1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 min-h-[220px] flex flex-col items-center text-center shadow-xl hover:shadow-[#00FFCC]/10 hover:border-[#00FFCC]/30 transition-all duration-300`}>
                {/* Icon */}
                <div className='text-4xl mb-4'>{feature.icon}</div>
                
                {/* Title */}
                <h3 className='text-2xl font-bold text-white mb-3 group-hover:text-[#00FFCC] transition-colors'>
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className='text-[#8892B0] group-hover:text-[#CCD6F6] transition-colors text-base'>
                  {feature.text}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
