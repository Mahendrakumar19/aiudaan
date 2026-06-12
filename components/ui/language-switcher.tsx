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
    <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl gap-1 shadow-sm">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${
          language === 'en'
            ? 'bg-brand-blue text-slate shadow-sm'
            : 'text-slate-500 hover:text-black'
        }`}
      >
        EN
      </button>

      <button
        onClick={() => setLanguage('hi')}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
          language === 'hi'
            ? 'bg-brand-orange text-black shadow-sm'
            : 'text-slate-500 hover:text-slate-950'
        }`}
      >
        हिन्दी
      </button>
    </div>
  )
}
