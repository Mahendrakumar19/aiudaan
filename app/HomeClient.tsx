'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { RegistrationForm } from '@/components/forms/RegistrationForm'
import { getToolImage } from '@/lib/toolImages'

export default function Home() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<any>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const target = new Date('2026-05-08T00:00:00').getTime()
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = target - now
      if (distance < 0) {
        clearInterval(interval)
        return
      }
      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const tracks = [
    {
      title: t('courses.filmmaking'),
      desc: "AI-Powered Films & Talking Avatars",
      icon: "🎬",
      build: "CGI Avatar Film",
      longDesc: t('home.track1Long'),
      highlights: [t('home.highlight1'), t('home.highlight2'), t('home.highlight3')],
      tools: t('home.track1Tools')
    },
    {
      title: "SaaS Web Development",
      desc: "Build & Deploy Full-stack AI Apps",
      icon: "🏗️",
      build: "Live SaaS Product",
      longDesc: t('home.track2Long'),
      highlights: [t('home.highlight4'), t('home.highlight5'), t('home.highlight6')],
      tools: t('home.track2Tools')
    },
    {
      title: t('courses.digitalMarketing'),
      desc: "Master Social Media & Content Automation",
      icon: "📈",
      build: "Auto-Marketing Engine",
      longDesc: t('home.track3Long'),
      highlights: [t('home.highlight7'), t('home.highlight8'), t('home.highlight9')],
      tools: t('home.track3Tools')
    },
    {
      title: "Prompt Engineering",
      desc: "Workflow Automation & Core Prompting",
      icon: "⚙️",
      build: "Autonomous Workflow",
      longDesc: t('home.track4Long'),
      highlights: [t('home.highlight10'), t('home.highlight11'), t('home.highlight12')],
      tools: t('home.track4Tools')
    }
  ]

  const masterTools = [
    'ChatGPT', 'Canva AI', 'HeyGen', 'Synthesia', 'Runway ML', 
    'ElevenLabs', 'Gamma', 'Midjourney', 'DALL-E', 'Claude'
  ]

  return (
    <main className="relative min-h-screen">
      <div className="bg-mesh" />
      <div className="grid-lines" />

      {/* Hero Section */}
      <section className="section-pad pt-32 md:pt-48 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm border-brand-blue/30"
        >
          <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          {t('home.urgency')}
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-syne text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight text-white"
        >
          {t('home.heroTitle').split('.')[0]} <br />
          <span className="brand-gradient-text">{t('home.heroSubtitle')}</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-text-secondary text-lg md:text-xl max-w-3xl mb-12"
        >
          {t('home.heroDescription')}
        </motion.p>

        <motion.div className="flex flex-col sm:flex-row gap-4 mb-20">
          <button 
            onClick={() => setIsRegisterModalOpen(true)}
            className="btn-primary min-w-[200px]"
          >
            {t('home.ctaButton')} →
          </button>
          <a href="#tracks">
            <button className="glass px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-all min-w-[200px] text-white">
              {t('home.learnMore')}
            </button>
          </a>
        </motion.div>

        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full">
          {[
            { label: 'Days', value: countdown.days },
            { label: 'Hours', value: countdown.hours },
            { label: 'Mins', value: countdown.minutes },
            { label: 'Secs', value: countdown.seconds },
          ].map((item, i) => (
            <div key={i} className="glass p-6 rounded-2xl flex flex-col items-center">
              <span className="text-4xl font-bold orange-gradient-text">{item.value.toString().padStart(2, '0')}</span>
              <span className="text-xs uppercase tracking-widest text-text-secondary mt-1">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Tracks Section */}
      <section id="tracks" className="section-pad bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-syne text-4xl md:text-5xl font-bold mb-4 text-white">{t('home.bootcampBenefits')}</h2>
            <p className="text-text-secondary">{t('home.whatYouLearn')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tracks.map((track, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => setSelectedTrack(track)}
                className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,221,235,0.1)]"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:opacity-20 transition-opacity">
                  {track.icon}
                </div>
                <div className="text-4xl mb-6">{track.icon}</div>
                <h3 className="text-xl font-bold mb-1 text-white">{track.title}</h3>
                <p className="text-text-secondary text-sm mb-6 leading-relaxed group-hover:text-white transition-colors">
                  {track.desc}
                </p>
                <div className="pt-6 border-t border-glass-border flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-cyan">{track.build}</span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-cyan group-hover:text-black transition-all">
                    →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Master Section */}
      <section id="tools" className="section-pad bg-white/[0.01]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-syne text-4xl md:text-5xl font-bold mb-4 text-white">Tools <span className="text-brand-cyan">{t('common.master')}</span></h2>
          <p className="text-text-secondary mb-16 max-w-2xl mx-auto">
            {t('home.professionalTools')}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {masterTools.map((toolName, i) => {
              const tool = getToolImage(toolName)
              return (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass p-6 rounded-2xl flex flex-col items-center justify-center gap-4 border-white/5 hover:border-brand-cyan/20 transition-all group"
                >
                  <div className="w-16 h-16 rounded-xl bg-white/5 p-3 flex items-center justify-center group-hover:bg-brand-cyan/10 transition-colors">
                    <img src={tool.image} alt={tool.name} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-sm text-white mb-1">{tool.name}</div>
                    <div className="text-[9px] text-text-secondary uppercase tracking-[0.2em] font-bold group-hover:text-brand-cyan transition-colors">Expert Level</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Application Section */}
      <section id="application" className="section-pad">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="absolute -inset-10 bg-brand-blue/20 blur-[100px] rounded-full" />
              <div className="relative glass aspect-[9/19] max-w-[300px] mx-auto rounded-[3rem] border-white/20 p-4 shadow-2xl overflow-hidden">
                <div className="w-full h-full bg-[#050508] rounded-[2.5rem] p-6 flex flex-col gap-6 relative overflow-hidden">
                   <div className="flex justify-between items-center">
                    <div className="w-8 h-8 rounded-full bg-brand-blue/30" />
                    <div className="w-4 h-1 bg-white/20 rounded-full" />
                  </div>
                  <div className="h-32 w-full glass rounded-2xl p-4 flex flex-col gap-2">
                    <div className="h-3 w-2/3 bg-brand-cyan/20 rounded-full" />
                    <div className="h-3 w-1/2 bg-white/5 rounded-full" />
                    <div className="mt-4 flex gap-2">
                      <div className="h-8 w-8 rounded-lg bg-brand-orange/20" />
                      <div className="h-8 w-2/3 rounded-lg bg-white/5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[1,2,3,4].map(i => <div key={i} className="aspect-square glass rounded-xl flex items-center justify-center text-[10px] text-brand-cyan font-bold">Tool {i}</div>)}
                  </div>
                  <div className="mt-auto h-12 w-full btn-primary text-[10px] rounded-xl flex items-center justify-center">Enter Dashboard</div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 text-brand-cyan text-sm font-bold border border-brand-cyan/20">
                🚀 Coming Soon
              </div>
              <h2 className="font-syne text-4xl md:text-6xl font-bold text-white">The <span className="brand-gradient-text">AI Udaan</span> Application</h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                We are building the future of AI education. Our mobile application will connect you directly with mentors, live project updates, and a curated library of 27+ AI tools right in your pocket.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Direct Mentor Chat", desc: "Get help from AI experts anytime, anywhere." },
                  { title: "Offline AI Library", desc: "Access premium tools even without internet." },
                  { title: "Project Portfolio", desc: "Showcase your AI builds to the world." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-brand-cyan flex-shrink-0 group-hover:bg-brand-cyan/20 transition-all duration-300">✓</div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-brand-cyan transition-colors">{item.title}</h4>
                      <p className="text-sm text-text-secondary">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-primary">Get Early Access</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-pad">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-syne text-4xl font-bold mb-12 text-center text-white">{t('faq.title')}</h2>
          <div className="space-y-4">
            {[
              { q: t('faq.q1'), a: t('faq.a1') },
              { q: t('faq.q2'), a: t('faq.a2') },
              { q: t('faq.q3'), a: t('faq.a3') },
              { q: t('faq.q4'), a: t('faq.a4') }
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden border-white/5">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-white">{item.q}</span>
                  <span className="text-brand-cyan">{activeFaq === i ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-text-secondary leading-relaxed"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Modal Popup */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar glass rounded-[3rem] p-4 md:p-8"
            >
              <button 
                onClick={() => setIsRegisterModalOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 z-10"
              >
                ✕
              </button>
              <RegistrationForm isModal={true} onSuccess={() => setIsRegisterModalOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Track Details Modal */}
      <AnimatePresence>
        {selectedTrack && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrack(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass rounded-[3rem] p-8 md:p-12 border-brand-cyan/20 overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-cyan/10 blur-[100px]" />
              <button 
                onClick={() => setSelectedTrack(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 z-10"
              >
                ✕
              </button>
              
              <div className="text-6xl mb-8">{selectedTrack.icon}</div>
              <h2 className="font-syne text-3xl md:text-5xl font-bold mb-4 text-white">
                {selectedTrack.title}
              </h2>
              <p className="text-brand-cyan font-bold mb-8 flex items-center gap-2">
                <span className="w-8 h-px bg-brand-cyan" /> Project: {selectedTrack.build}
              </p>
              
              <div className="space-y-6 mb-12">
                <p className="text-text-secondary text-lg leading-relaxed">
                  {selectedTrack.longDesc}
                </p>
                
                <div>
                  <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">What you will master:</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedTrack.highlights.map((h: string) => (
                      <span key={h} className="px-4 py-2 rounded-full glass border-white/10 text-xs font-bold text-white">
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Tools you will use:</h4>
                  <p className="text-brand-cyan text-sm font-medium">{selectedTrack.tools}</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedTrack(null)
                  setIsRegisterModalOpen(true)
                }}
                className="btn-primary w-full text-white"
              >
                Enroll for this Track
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </main>
  )
}