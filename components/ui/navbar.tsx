'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSwitcher from './language-switcher'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import Image from 'next/image'

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
    { href: '/#flagshipevents', label: 'Explore' },
    { href: '/#whyH2s', label: 'Why BIT Gaya' },
    { href: '/blog', label: 'Blogs' },
    { href: 'http://bitgaya.org', label: 'College Site' },
    { href: '/#programs', label: 'Our Initiatives' },
    // { href: '/dashboard', label: 'My Dashboard' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'nav-blur py-3 shadow-2xl' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group min-w-0">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm shrink-0 flex items-center justify-center font-bold text-lg text-[#3462ae]">
            <Image src='/images/logo.png' alt="AI Udaan Logo" width={65} height={100} />
          </div>
          <div className="flex flex-col min-w-0 border-l border-slate-300 pl-3">
            <span className="text-[10px] uppercase tracking-[0.32em] text-[#3462ae] font-semibold leading-none">Buddha Institute of Technology</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden xl:flex items-center gap-8 2xl:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors relative group whitespace-nowrap"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-blue transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="hidden xl:block mr-2">
            <LanguageSwitcher />
          </div>

          <Link href="/register" className="hidden sm:block">
            <button className="btn-orange px-5 sm:px-6 py-2.5 text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] shadow-lg whitespace-nowrap border border-amber-300/40">
              {t('nav.register')}
            </button>
          </Link>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm"
          >
            <span className={`w-5 h-0.5 bg-slate-700 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-slate-700 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-slate-700 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
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
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-slate-200 p-5 xl:hidden shadow-lg"
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold text-slate-700 hover:text-slate-950"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="btn-orange w-full py-4 text-sm font-black uppercase tracking-[0.18em]">
                  {t('nav.register')}
                </button>
              </Link>

              <div className="pt-4 border-t border-slate-200 flex justify-center">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
