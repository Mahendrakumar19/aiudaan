import { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'AI Udaan Bootcamp | Quantum Computing, ADCA, DCA & Internships',
  description: 'A premium BIT-backed learning platform for quantum computing, ADCA, DCA, internships, and future-ready career pathways.',
  keywords: [
    'AI Bootcamp Bihar',
    'Quantum Computing course',
    'ADCA course',
    'DCA course',
    'internship program',
    'BIT Gaya',
    'Buddha Institute of Technology',
    'future skills training'
  ],
  alternates: {
    canonical: 'https://aiudaanbootcamp.com',
  },
  openGraph: {
    title: 'AI Udaan Bootcamp | Learn. Build. Get Internship Ready.',
    description: 'A premium landing experience for students and parents exploring future-ready skills and campus-led programs.',
    url: 'https://aiudaanbootcamp.com',
    type: 'website',
  },
}

export default function Page() {
  return <HomeClient />
}
