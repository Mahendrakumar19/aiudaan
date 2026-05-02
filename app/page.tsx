import { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'AI Udaan Bootcamp | Bihar\'s #1 AI Training Platform',
  description: 'Master ChatGPT, Midjourney, AI Filmmaking, and Automation. Learn how to earn ₹1,00,000+ per month with future-ready AI skills. Join our 2-day intensive bootcamp in Gaya, Bihar.',
  keywords: [
    'AI Bootcamp Bihar',
    'AI training Gaya',
    'master AI skills',
    'ChatGPT course Bihar',
    'AI filmmaking training',
    'AI automation bootcamp',
    'Buddha Institute of Technology AI',
    'AI earning opportunity 2026'
  ],
  alternates: {
    canonical: 'https://aiudaanbootcamp.com',
  },
  openGraph: {
    title: 'AI Udaan Bootcamp | Master the AI Revolution',
    description: 'Practical AI training for students and professionals. No coding required.',
    url: 'https://aiudaanbootcamp.com',
    type: 'website',
  },
}

export default function Page() {
  return <HomeClient />
}
