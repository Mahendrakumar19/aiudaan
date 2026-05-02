'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSwitcher from './language-switcher'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/#tracks', label: t('nav.courses') },
    { href: '/tools', label: t('common.master') },
    { href: '/journey', label: t('nav.journey') },
    { href: '/blog', label: t('nav.blog') },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'nav-blur py-3 shadow-2xl' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center font-bold text-xl overflow-hidden shadow-lg shadow-brand-blue/20 group-hover:scale-110 transition-transform">
             <span className="text-white">🚀</span>
          </div>
          <div className="flex flex-col">
            <span className="font-syne font-bold text-lg tracking-tight leading-none text-white">AI UDAAN</span>
            <span className="text-[10px] font-bold text-brand-orange tracking-[0.2em] leading-none mt-1 uppercase">Bootcamp</span>
          </div>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.label} 
              href={link.href} 
              className="text-sm font-semibold text-text-secondary hover:text-brand-cyan transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-cyan transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:block mr-2">
            <LanguageSwitcher />
          </div>
          
          <Link href="/register" className="hidden sm:block">
            <button className="btn-orange px-6 py-2.5 text-xs font-black uppercase tracking-wider shadow-lg">
              {t('nav.register')}
            </button>
          </Link>
          
          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 glass rounded-lg"
          >
            <span className={`w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-bg-deep/95 backdrop-blur-2xl border-b border-white/10 p-6 lg:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold text-text-secondary hover:text-brand-cyan"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="btn-orange w-full py-4 text-sm font-black uppercase">
                  {t('nav.register')}
                </button>
              </Link>
              
              <div className="pt-4 border-t border-white/10 flex justify-center">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
