'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { t } = useLanguage()

  return (
    <footer className="border-t border-glass-border py-20 relative overflow-hidden bg-bg-deep">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-brand-cyan/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center font-bold text-xl">
               <span className="text-white">🚀</span>
            </div>
            <span className="font-syne font-bold text-xl tracking-tight text-white">AI UDAAN <span className="text-brand-orange">BOOTCAMP</span></span>
          </Link>
          <p className="text-text-secondary max-w-sm mb-8 leading-relaxed">
            {t('about.missionStatement')}
          </p>
          <div className="flex gap-4">
            {['f', 't', 'in', 'ig'].map(s => (
              <span key={s} className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white hover:text-brand-cyan transition-all cursor-pointer hover:-translate-y-1">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-[10px]">{t('courses.courses')}</h4>
          <ul className="space-y-4 text-sm text-text-secondary">
            <li><Link href="/#tracks" className="hover:text-brand-cyan transition-colors">{t('nav.courses')}</Link></li>
            <li><Link href="/tools" className="hover:text-brand-cyan transition-colors">{t('common.master')}</Link></li>
            <li><Link href="/journey" className="hover:text-brand-cyan transition-colors">{t('nav.journey')}</Link></li>
            <li><Link href="/blog" className="hover:text-brand-cyan transition-colors">{t('nav.blog')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-[10px]">{t('nav.contact')}</h4>
          <ul className="space-y-4 text-sm text-text-secondary">
            <li><Link href="/privacy-policy" className="hover:text-brand-cyan transition-colors">{t('footer.privacy')}</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-brand-cyan transition-colors">{t('footer.terms')}</Link></li>
            <li><Link href="/contact" className="hover:text-brand-cyan transition-colors">{t('footer.contact')}</Link></li>
            <li><Link href="/about" className="hover:text-brand-cyan transition-colors">{t('nav.about')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
        <p>© {currentYear} {t('common.aiBootcamp')}. {t('footer.copyright')}</p>
        <p>{t('footer.poweredby')}</p>
      </div>
    </footer>
  )
}