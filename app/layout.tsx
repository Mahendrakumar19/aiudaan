import './globals.css'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/shared/footer'
import WhatsAppButton from '@/components/ui/whatsapp-button'
import ClientProviders from '@/components/providers/ClientProviders'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import SchemaMarkup from '@/components/seo/schema-markup'
import GoogleAnalytics from '@/components/seo/google-analytics'
import MicrosoftClarity from '@/components/seo/microsoft-clarity'
import UTMTracker from '@/components/seo/utm-tracker'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const baseUrl = 'https://aiudaanbootcamp.com'

export const metadata: Metadata = {
  title: 'AI Udaan Bootcamp | Quantum Computing, ADCA, DCA & Internships',
  description: 'A BIT-backed learning platform with a premium event-style design for future-ready programs and campus-led learning.',
  keywords: [
    'AI bootcamp',
    'Quantum Computing',
    'ADCA',
    'DCA',
    'internships',
    'BIT Gaya',
    'Buddha Institute of Technology',
    'future skills',
  ],
  authors: [{ name: 'Buddha Institute of Technology' }],
  creator: 'Buddha Institute of Technology',
  publisher: 'Buddha Institute of Technology',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'AI Udaan Bootcamp',
    title: 'AI Udaan Bootcamp | Learn. Build. Get Internship Ready.',
    description: 'Premium education landing experience for students and parents exploring future-ready skills.',
    images: [
      {
        url: `${baseUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'AI Udaan Bootcamp 2026',
        type: 'image/png',
      },
      {
        url: `${baseUrl}/images/og-image-square.png`,
        width: 800,
        height: 800,
        alt: 'AI Udaan Bootcamp 2026',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@aiudaanbootcamp',
    creator: '@aiudaanbootcamp',
    title: 'AI Udaan Bootcamp 2026',
    description: 'Master AI tools, content creation & start earning online. 2-Day intensive bootcamp with certificate.',
    images: [`${baseUrl}/images/og-image.png`],
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      en: `${baseUrl}/en`,
      'en-US': `${baseUrl}/en`,
      hi: `${baseUrl}/hi`,
      'hi-IN': `${baseUrl}/hi`,
    },
  },
  category: 'Education',
  classification: 'AI Training | Online Bootcamp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang='en' suppressHydrationWarning className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#ffffff" />
        <link rel='icon' href='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" dominant-baseline="middle" text-anchor="middle" font-size="90">🎓</text></svg>' />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://cdn.example.com" />
        
        {/* Canonical URL - will be overridden per page if needed */}
        <link rel="canonical" href={baseUrl} />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <MicrosoftClarity clarity_id={process.env.NEXT_PUBLIC_CLARITY_ID} />
        )}
      </head>
      <body className='bg-white font-inter text-slate-900 antialiased selection:bg-blue-100 selection:text-slate-900'>
        <ClientProviders>
          <UTMTracker>
            <Navbar />
          </UTMTracker>
          <main className='pt-24 bg-white relative z-10'>
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <SchemaMarkup />
        </ClientProviders>
      </body>
    </html>
  )
}
