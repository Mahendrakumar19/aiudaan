'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useEffect, useState } from 'react'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex items-center glass p-1 rounded-xl gap-1">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${
          language === 'en'
            ? 'bg-brand-blue text-white shadow-lg'
            : 'text-text-secondary hover:text-white'
        }`}
      >
        EN
      </button>

      <button
        onClick={() => setLanguage('hi')}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
          language === 'hi'
            ? 'bg-brand-orange text-black shadow-lg'
            : 'text-text-secondary hover:text-white'
        }`}
      >
        हिन्दी
      </button>
    </div>
  )
}
