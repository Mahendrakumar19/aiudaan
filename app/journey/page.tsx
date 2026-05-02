'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import Link from 'next/link'

export default function JourneyPage() {
  const { t } = useLanguage()

  const milestones = [
    {
      year: t('journey.sparkYear'),
      title: t('journey.sparkTitle'),
      desc: t('journey.sparkDesc'),
      icon: '✨'
    },
    {
      year: t('journey.growthYear'),
      title: t('journey.growthTitle'),
      desc: t('journey.growthDesc'),
      icon: '📈'
    },
    {
      year: t('journey.partnershipYear'),
      title: t('journey.partnershipTitle'),
      desc: t('journey.partnershipDesc'),
      icon: '🤝'
    },
    {
      year: t('journey.impactYear'),
      title: t('journey.impactTitle'),
      desc: t('journey.impactDesc'),
      icon: '🚀'
    }
  ]

  return (
    <main className="relative min-h-screen pb-20">
      <div className="bg-mesh" />
      <div className="grid-lines" />

      {/* Hero */}
      <section className="section-pad pt-32 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm border-brand-blue/30 mx-auto"
        >
          <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          {t('journey.subtitle')}
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-syne text-5xl md:text-7xl font-bold mb-6 text-white"
        >
          {t('journey.title').split(' ')[0]} <span className="brand-gradient-text">{t('journey.title').split(' ').slice(1).join(' ')}</span>
        </motion.h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {t('journey.description')}
        </p>
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-6 relative">
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-blue via-brand-cyan to-transparent hidden md:block" />
        
        <div className="space-y-20">
          {milestones.map((ms, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Dot */}
              <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-brand-cyan shadow-[0_0_15px_rgba(34,211,238,0.5)] -translate-x-1.5 hidden md:block" />
              
              <div className="w-full md:w-1/2 glass p-8 rounded-3xl border-white/5 hover:border-brand-cyan/20 transition-all">
                <div className="text-brand-orange font-black text-4xl mb-2">{ms.year}</div>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                  {ms.icon} {ms.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {ms.desc}
                </p>
              </div>
              <div className="hidden md:block w-1/2" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad mt-32 text-center">
        <div className="glass p-12 rounded-[3rem] max-w-4xl mx-auto border-brand-orange/20 overflow-hidden relative">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-blue/10 blur-[100px]" />
          <h2 className="font-syne text-3xl md:text-5xl font-bold mb-6 text-white">{t('home.readyTransform')} <span className="text-brand-orange">{t('home.actNow')}</span></h2>
          <p className="text-text-secondary mb-12">{t('home.joinHundreds')}</p>
          <Link href="/register">
            <button className="btn-primary">{t('home.ctaButton')}</button>
          </Link>
        </div>
      </section>
    </main>
  )
}
