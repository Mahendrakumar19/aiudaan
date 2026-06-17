'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/shared/footer'
import WhatsAppButton from '@/components/ui/whatsapp-button'
import UTMTracker from '@/components/seo/utm-tracker'

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <>
      {!isAdmin && (
        <UTMTracker>
          <Navbar />
        </UTMTracker>
      )}
      <main className={`${isAdmin ? '' : 'pt-24'} bg-white relative z-10`}>
        {children}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </>
  )
}
