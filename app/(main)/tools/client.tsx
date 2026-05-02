'use client'

import { motion } from 'framer-motion'
import { BonusTools } from '@/components/landing/bonus-tools'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function ToolsPageClient() {
  const { t } = useLanguage()

  return (
    <div className='relative min-h-screen pb-20'>
      <div className="bg-mesh" />
      <div className="grid-lines" />
      
      {/* Hero Section */}
      <section className='relative pt-32 md:pt-48 pb-20 px-6 text-center'>
        <div className='mx-auto max-w-4xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
             <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm border-brand-blue/30 mx-auto"
            >
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
              {t('home.professionalTools')}
            </motion.div>

            <h1 className='font-syne text-5xl md:text-7xl font-bold mb-6 leading-tight text-white'>
              {t('common.master')} <span className='brand-gradient-text'>AI Tools</span>
            </h1>

            <p className='text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto'>
              {t('home.heroDescription')}
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link href='/register'>
                <button className='btn-primary min-w-[200px] shadow-lg'>
                  {t('nav.register')}
                </button>
              </Link>
              <Link href='/#faq'>
                <button className='glass px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-all min-w-[200px] text-white'>
                  {t('home.learnMore')}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Component */}
      <div className="max-w-7xl mx-auto">
        <BonusTools />
      </div>

      {/* Additional Info Section */}
      <section className='section-pad'>
        <div className='mx-auto max-w-4xl'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              {
                title: t('home.expert'),
                description: t('home.handsOnLearning'),
                icon: '🏢'
              },
              {
                title: t('home.startEarning'),
                description: t('home.turnLearning'),
                icon: '💰'
              },
              {
                title: t('home.future'),
                description: t('home.dontMiss'),
                icon: '🚀'
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='glass p-8 rounded-3xl border-white/5 hover:border-brand-cyan/20 transition-all text-center'
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className='text-xl font-bold mb-4 text-white'>{item.title}</h3>
                <p className='text-text-secondary text-sm leading-relaxed'>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='section-pad'>
        <div className='mx-auto max-w-4xl glass p-12 rounded-[3rem] border-brand-orange/20 text-center relative overflow-hidden'>
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-orange/10 blur-[100px]" />
           <h2 className='font-syne text-3xl md:text-5xl font-bold mb-6 text-white'>
            {t('home.readyTransform')} <span className="text-brand-orange">{t('common.master')}</span>
          </h2>
          <p className='text-lg mb-12 text-text-secondary max-w-2xl mx-auto'>
            {t('home.joinHundreds')}
          </p>
          <Link href='/register'>
            <button className='btn-orange px-12 py-5 text-xl'>
              {t('nav.enroll')} →
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
