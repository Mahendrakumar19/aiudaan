import { Metadata } from 'next'
import ContactClient from './client'

export const metadata: Metadata = {
  title: 'Contact Us | AI Udaan Bootcamp Support',
  description: 'Have questions about our AI Bootcamp? Get in touch with our team. We are here to help you start your AI journey in Bihar.',
  keywords: ['contact AI Udaan', 'AI bootcamp support', 'BIT Gaya contact', 'AI training help'],
  alternates: {
    canonical: 'https://aiudaanbootcamp.com/contact',
  },
}

export default function ContactPage() {
  return <ContactClient />
}
