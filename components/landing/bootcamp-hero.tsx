'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { fadeUpVariants, floatingVariants } from '@/lib/animationVariants'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function BootcampHero() {
  const { t } = useLanguage()
  return (
    <section id="home" className="relative min-h-screen py-16 sm:py-24 md:py-32 px-4 sm:px-6 flex items-center justify-center overflow-x-hidden w-full max-w-full">
      {/* Animated tech borders */}
      <div className='absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-gradient-to-br from-[#00FFCC]/5 via-transparent to-[#FF0055]/5 pointer-events-none overflow-hidden' />

      <div className="mx-auto max-w-6xl w-full relative z-10 overflow-x-hidden">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-12 items-center overflow-x-hidden">
          {/* Left side - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8 w-full overflow-x-hidden"
          >
            {/* Badge */}
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-slate-900/80 border border-white/10 shadow-sm"
            >
              <span className='w-2 h-2 rounded-full bg-[#00FFCC] pulse-dot' />
              <span className='text-xs sm:text-base font-semibold bg-gradient-to-r from-[#00FFCC] to-[#0099FF] bg-clip-text text-transparent truncate'>
                {t('home.duration')}
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tighter">
                <span className='block text-white mb-2 sm:mb-3'>AI Udaan</span>
                <span className='block bg-gradient-to-r from-[#00FFCC] via-[#0099FF] to-[#FF0055] bg-clip-text text-transparent'>
                  Bootcamp
                </span>
                <span className='block text-[#8892B0]'>2026</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-3xl text-[#8892B0] leading-relaxed max-w-3xl font-medium"
            >
              <span className='font-bold text-transparent bg-gradient-to-r from-[#00FFCC] to-[#0099FF] bg-clip-text'>{t('home.heroTitle')}</span>, {t('courses.contentCreation')} & Real-World Skills
            </motion.p>

            {/* Learn → Build → Earn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-2 sm:space-y-3"
            >
              <p className="text-xl sm:text-2xl font-semibold text-[#00FFCC]">
                {t('home.heroSubtitle')}
              </p>
              <div className='h-1 w-24 sm:w-32 bg-gradient-to-r from-[#00FFCC] to-[#0099FF] rounded-full' />
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-white/10"
            >
              <p className="flex items-start gap-3 text-[#CCD6F6] text-base sm:text-lg md:text-xl font-medium">
                <span className='w-3 h-3 rounded-full bg-[#00FFCC] flex-shrink-0 mt-1' />
                <span>{t('common.buddhainstitute')}, Gaya Ji</span>
              </p>
              <p className="flex items-start gap-3 text-[#CCD6F6] text-base sm:text-lg md:text-xl font-medium">
                <span className='w-3 h-3 rounded-full bg-[#0099FF] flex-shrink-0 mt-1' />
                <span>For Class 10th, 12th Passed and {t('home.graduateStudents')}</span>
              </p>
              <p className="flex items-start gap-3 text-[#CCD6F6] text-base sm:text-lg md:text-xl font-medium">
                <span className='w-3 h-3 rounded-full bg-[#FF0055] flex-shrink-0 mt-1' />
                <span>{t('home.limited')} | {t('home.certificate')}</span>
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col gap-4 pt-4 sm:pt-6 w-full"
            >
              <Link href="/register" className="w-full">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button
                    size="lg"
                    className="w-full px-6 sm:px-9 py-3 text-base sm:text-lg rounded-lg font-bold bg-gradient-to-r from-[#00FFCC] to-[#0099FF] hover:from-[#00CCAA] hover:to-[#0077CC] text-[#06080B] shadow-lg hover:shadow-[#00FFCC]/25 transition-all"
                  >
                    {t('nav.register')}
                  </Button>
                </motion.div>
              </Link>

              {/* Limited Seats Warning Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg bg-[#FF0055]/10 border border-[#FF0055]/30 font-semibold text-[#FF0055] text-sm sm:text-base"
              >
                <span className="text-lg sm:text-xl pulse-dot">⚠️</span>
                <span className="text-[#FF0055] font-semibold">{t('home.urgency')}</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right side - AI Illustration / Floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-full min-h-[400px] sm:min-h-[500px] md:min-h-[700px] hidden md:flex items-center justify-center perspective overflow-hidden"
          >
            {/* Cards container with diagonal flex layout */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Floating AI card 1 - Top Left */}
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className="absolute w-48 sm:w-56 md:w-64 h-56 sm:h-72 md:h-80 rounded-3xl bg-[#0D1117]/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-xl hover:border-[#00FFCC]/30 transition-all cursor-pointer hover:scale-105 top-0 left-0 sm:left-4 md:left-8 text-sm sm:text-base"
              >
                <div className='text-4xl sm:text-5xl mb-4 sm:mb-6'>🤖</div>
                <h3 className='text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3'>{t('home.aiTools')}</h3>
                <p className='text-[#00FFCC] text-base sm:text-lg leading-relaxed'>{t('home.buildWebApps')}</p>
              </motion.div>

              {/* Floating AI card 2 - Center Right */}
              <motion.div
                variants={floatingVariants}
                animate="animate"
                transition={{ delay: 0.3 }}
                className="absolute w-48 sm:w-56 md:w-64 h-56 sm:h-72 md:h-80 rounded-3xl bg-[#0D1117]/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-xl hover:border-[#0099FF]/30 transition-all cursor-pointer hover:scale-105 top-1/3 right-0 sm:right-2 md:right-0 text-sm sm:text-base"
              >
                <div className='text-4xl sm:text-5xl mb-4 sm:mb-6'>💡</div>
                <h3 className='text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3'>{t('home.projects')}</h3>
                <p className='text-[#0099FF] text-base sm:text-lg leading-relaxed'>{t('home.realWorldApps')}</p>
              </motion.div>

              {/* Floating AI card 3 - Bottom Left */}
              <motion.div
                variants={floatingVariants}
                animate="animate"
                transition={{ delay: 0.6 }}
                className="absolute w-48 sm:w-56 md:w-64 h-56 sm:h-72 md:h-80 rounded-3xl bg-[#0D1117]/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-xl hover:border-[#FF0055]/30 transition-all cursor-pointer hover:scale-105 bottom-0 left-0 sm:left-4 md:left-8 text-sm sm:text-base"
              >
                <div className='text-4xl sm:text-5xl mb-4 sm:mb-6'>💰</div>
                <h3 className='text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3'>{t('home.earnMoney')}</h3>
                <p className='text-[#FF0055] text-base sm:text-lg leading-relaxed'>{t('home.monetizeSkills')}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}