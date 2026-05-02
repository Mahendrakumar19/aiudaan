'use client'

import { motion } from 'framer-motion'
import { fadeUpVariants, glowPulseVariants } from '@/lib/animationVariants'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const urgencyPoints = [
  { icon: '⚡', text: 'Limited seats available', color: 'from-blue-400 to-blue-300' },
  { icon: '🎯', text: 'First come, first served', color: 'from-purple-400 to-pink-400' },
  { icon: '🏆', text: 'Certificate + Portfolio included', color: 'from-pink-400 to-rose-400' }
]

export function LimitedSeats() {
  const { t } = useLanguage()
  return (
    <section className="relative py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto max-w-4xl">
        {/* Background glow */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 40px rgba(34, 211, 238, 0.2), 0 0 80px rgba(168, 85, 247, 0.1)',
              '0 0 60px rgba(34, 211, 238, 0.4), 0 0 120px rgba(168, 85, 247, 0.2)',
              '0 0 40px rgba(34, 211, 238, 0.2), 0 0 80px rgba(168, 85, 247, 0.1)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className='absolute inset-0 rounded-3xl pointer-events-none'
        />

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Heading */}
          <div className="text-center mb-12">
            <motion.h2
              className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight"
            >
              {t('home.limitedSeats')}
              <span className='block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent'>
                {t('home.available')}!
              </span>
              <span>🔥</span>
            </motion.h2>
            <p className="text-2xl text-slate-300 font-semibold">
              {t('home.dontMiss')}
            </p>
          </div>

          {/* Main card with neon glow */}
          <motion.div
            variants={glowPulseVariants}
            animate="animate"
            className='relative'
          >
            {/* Neon border - top */}
            <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent' />
            {/* Neon border - bottom */}
            <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent' />
            {/* Neon border - left */}
            <div className='absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent' />
            {/* Neon border - right */}
            <div className='absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent' />

            {/* Card background */}
            <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 md:p-16 overflow-hidden shadow-2xl shadow-cyan-500/5">
              {/* Alert icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                viewport={{ once: true }}
                className="flex justify-center mb-8"
              >
                <div className='w-20 h-20 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-4xl shadow-md'>
                  ⚡
                </div>
              </motion.div>

              {/* Main call to action */}
              <h3 className="text-4xl md:text-5xl font-black text-center text-white mb-8">
                {t('home.actNow')}
              </h3>

              {/* Urgency points */}
              <div className="space-y-4 mb-10">
                {urgencyPoints.map((point, index) => (
                  <motion.div
                    key={point.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-white/10 hover:bg-slate-800 hover:border-cyan-400/30 group-hover:bg-slate-800 transition-all font-medium text-white">
                      {/* Animated icon */}
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, delay: index * 0.2, repeat: Infinity }}
                        className='text-2xl'
                      >
                        {point.icon}
                      </motion.span>

                      {/* Text with gradient */}
                      <span className={`font-bold text-xl bg-gradient-to-r ${point.color} bg-clip-text text-transparent`}>
                        {point.text}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Countdown style info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className='text-center p-6 rounded-xl bg-slate-800/50 border border-white/10'
              >
                <p className='text-cyan-400 font-bold text-base'>
                  {t('home.onlySeatsRemaining')}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}