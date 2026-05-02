'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import Link from 'next/link'

export default function ContactPageClient() {
  const { t } = useLanguage()

  const contactMethods = [
    {
      title: t('contact.emailLabel'),
      value: 'info@aiudaanbootcamp.com',
      link: 'mailto:info@aiudaanbootcamp.com',
      icon: '📧'
    },
    {
      title: t('contact.phoneLabel'),
      value: '+91 8985025794',
      link: 'tel:+918985025794',
      icon: '📞'
    },
    {
      title: 'WhatsApp',
      value: 'Chat with Us',
      link: 'https://wa.me/918985025794',
      icon: '💬'
    },
    {
      title: 'Location',
      value: 'BIT Gaya, Bihar',
      link: 'https://goo.gl/maps/example',
      icon: '📍'
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
          {t('contact.getInTouch')}
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-syne text-5xl md:text-7xl font-bold mb-6"
        >
          Contact our <span className="brand-gradient-text">Experts</span>
        </motion.h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {t('contact.doubtHelp')}
        </p>
      </section>

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactMethods.map((method, i) => (
          <motion.a
            key={i}
            href={method.link}
            target="_blank"
            whileHover={{ y: -5 }}
            className="glass p-8 rounded-3xl border-white/5 hover:border-brand-blue/30 transition-all text-center"
          >
            <div className="text-4xl mb-4">{method.icon}</div>
            <div className="text-xs font-bold text-brand-cyan uppercase tracking-widest mb-2">{method.title}</div>
            <div className="text-lg font-bold text-white mb-2">{method.value}</div>
          </motion.a>
        ))}
      </section>

      {/* Contact Form Placeholder / Support CTA */}
      <section className="section-pad mt-20">
        <div className="glass p-12 rounded-[3rem] max-w-4xl mx-auto border-brand-orange/20 overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-orange/10 blur-[100px]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h2 className="font-syne text-3xl font-bold mb-6 text-white">{t('contact.sendMessage')}</h2>
              <p className="text-text-secondary mb-8">{t('contact.doubtHelp')}</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white font-bold">
                  <div className="w-8 h-8 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan">✓</div>
                  24/7 Priority Support
                </div>
                <div className="flex items-center gap-4 text-white font-bold">
                  <div className="w-8 h-8 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan">✓</div>
                  Expert Consultation
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
               <a href="https://wa.me/918985025794" className="w-full">
                <button className="btn-orange w-full py-5 text-lg">Chat on WhatsApp →</button>
              </a>
              <Link href="/register" className="w-full">
                <button className="btn-primary w-full py-5 text-lg">Join the Bootcamp</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
