'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import en from './en.json'
import hi from './hi.json'

type Language = 'en' | 'hi'
type Translations = typeof en

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Translations> = {
  en,
  hi,
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  // Initialize from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguageState(savedLanguage)
    }
    setMounted(true)
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }, [])

  const t = useCallback(
    (key: string): string => {
      const keys = key.split('.')
      let value: any = translations[language]

      for (const k of keys) {
        value = value?.[k]
      }

      return value ?? key
    },
    [language]
  )

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Return default context during build/SSR time
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => key,
    }
  }
  return context
}
