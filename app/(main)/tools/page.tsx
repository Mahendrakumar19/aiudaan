import { Metadata } from 'next'
import ToolsPageClient from './client'

export const metadata: Metadata = {
  title: 'AI Tools Directory | Master 27+ Professional AI Softwares',
  description: 'Explore the full curriculum of AI tools taught at AI Udaan Bootcamp. Master ChatGPT, Midjourney, HeyGen, ElevenLabs, and more for high-paying gigs.',
  keywords: [
    'AI tools list',
    'best AI for content creation',
    'AI video tools',
    'automation software 2026',
    'AI Udaan curriculum',
    'master AI tools'
  ],
  alternates: {
    canonical: 'https://aiudaanbootcamp.com/tools',
  },
}

export default function ToolsPage() {
  return <ToolsPageClient />
}
