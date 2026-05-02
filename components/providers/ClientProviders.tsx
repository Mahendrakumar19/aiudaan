'use client'

import React from 'react'
import { ToastProvider } from '@/components/providers/ToastContext'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ToastProvider>{children}</ToastProvider>
    </LanguageProvider>
  )
}
