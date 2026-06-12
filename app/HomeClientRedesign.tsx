'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RegistrationForm } from '@/components/forms/RegistrationForm'

type Program = {
  title: string
  tag: string
  icon: string
  description: string
  highlights: string[]
}

type LiveEvent = {
  eventName: string
  homeImage: string
  eventFee: string
  eventMode: string
  dateLabel: string
  dateDisplay: string
  eventUrl: string
  isRegistrationOpen: boolean
}

export default function HomeClientRedesign() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(0)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)

  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0)

  // Live Events State
  const [liveEvents] = useState<LiveEvent[]>([])
  const [loadingEvents] = useState(false)

  const [slides, setSlides] = useState<any[]>([
    {
      title: "Empowering Innovation at BIT Gaya Campus",
      stats: [
        { value: '10K+', label: 'Students trained' },
        { value: '200+', label: 'Tech projects built' }
      ],
      bg: './images/college.jpeg',
      cta: 'Explore Programs'
    },
    {
      title: "Center of Excellence in Technical Education since 2008",
      stats: [
        { value: '18+', label: 'Years of legacy' },
        { value: '100%', label: 'Placement focused' }
      ],
      bg: './images/college.jpeg',
      cta: 'Campus Tour'
    }
  ])

  const [programs, setPrograms] = useState<Program[]>([
    {
      title: 'AI Web App Generation',
      tag: 'Coding track',
      icon: '💻',
      description: 'Build full-stack web applications using AI, Next.js, and Cursor, then deploy them live on Vercel.',
      highlights: ['Cursor & AI coding', 'Next.js generation', 'One-click deployment'],
    },
    {
      title: 'AI Filmmaking & CGI',
      tag: 'Creative track',
      icon: '🎬',
      description: 'Produce high-quality videos, talking avatars, CGI assets, and voiceovers using ElevenLabs and Suno.',
      highlights: ['Avatar generation', 'AI Voice & CGI', 'Soundtracks & Suno'],
    },
    {
      title: 'AI Automation & Prompts',
      tag: 'Productivity track',
      icon: '⚡',
      description: 'Master prompt engineering and build automated agent workflows to handle business tasks.',
      highlights: ['Prompt Engineering', 'Custom Agent workflows', 'ChatGPT & Claude API'],
    },
    {
      title: 'AI Digital Marketing',
      tag: 'Business track',
      icon: '📈',
      description: 'Scale content creation, manage Meta advertising lead generation, and design marketing materials using Canva.',
      highlights: ['Meta Ads lead gen', 'Canva automation', 'GenSpark & Sintra AI'],
    },
  ])

  const [faqs, setFaqs] = useState<any[]>([
    {
      q: 'What is BIT Gaya AI Udaan?',
      a: 'It is a premium upskilling and innovation platform backed by Buddha Institute of Technology (BIT) Gaya, designed to host hackathons, developer challenges, and tech cohorts.',
    },
    {
      q: 'How do I register for a challenge?',
      a: 'Click on "Register Now" on any of our active flagship challenges, fill out the simple registration form, and form or join a team.',
    },
    {
      q: 'Are the bootcamps online or offline?',
      a: 'We offer hybrid models. Some bootcamps are held in-person at Buddha Institute of Technology campus, while others are entirely virtual.',
    },
  ])

  const clients = [
    { name: 'Google', logo: 'https://hacktoskill.com/home-cdn/google.png' },
    { name: 'Samsung', logo: 'https://hacktoskill.com/home-cdn/samsung.png' },
    { name: 'Uber', logo: 'https://hacktoskill.com/home-cdn/uber.png' },
    { name: 'GitHub', logo: 'https://hacktoskill.com/home-cdn/github.png' },
    { name: 'UiPath', logo: 'https://hacktoskill.com/home-cdn/uipath.png' },
    { name: 'Microsoft', logo: 'https://hacktoskill.com/home-cdn/microsoft.png' },
    { name: 'Adobe', logo: 'https://hacktoskill.com/home-cdn/adobe.png' },
    { name: 'Intel', logo: 'https://hacktoskill.com/our-clientele/our_clientele/intel-logo.png' },
    { name: 'Meta', logo: 'https://hacktoskill.com/our-clientele/our_clientele/fb(meta).webp' }
  ]

  useEffect(() => {
    // Fetch dynamic CMS configuration
    fetch('/api/admin/cms')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.config) {
          if (data.config.slides) setSlides(data.config.slides)
          if (data.config.programs) setPrograms(data.config.programs)
          if (data.config.faqs) setFaqs(data.config.faqs)
        }
      })
      .catch(err => console.error('Failed to load CMS config, using defaults', err))

    // Slide interval timer
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="relative min-h-screen bg-white text-slate-900 overflow-hidden">

      {/* Dynamic Slide Banner Section */}
      <section className="px-4 pt-8 md:pt-16 max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden h-[480px] sm:h-[550px] lg:h-[620px] bg-[#0c1222] shadow-2xl flex items-center">
          <div className="absolute inset-0 z-0">
            <img
              src={slides[currentSlide].bg}
              alt="Slide Banner Background"
              className="absolute inset-0 w-full h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 px-6 sm:px-12 lg:px-20 text-white max-w-3xl">
            <motion.h1
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-syne text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              {slides[currentSlide].title}
            </motion.h1>

            <motion.div
              key={`stats-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-8 sm:gap-12 mt-8 sm:mt-12 text-[#32B7EC]"
            >
              {slides[currentSlide].stats.map((stat: any, i: number) => (
                <div key={i}>
                  <div className="text-3xl sm:text-4xl font-extrabold">{stat.value}</div>
                  <div className="text-slate-300 text-xs sm:text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <div className="mt-8 sm:mt-12 flex gap-4">
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="bg-[#3462AE] hover:bg-[#1548B7] text-white px-8 py-3 rounded-full font-bold transition flex items-center gap-2 text-sm shadow-lg"
              >
                {slides[currentSlide].cta}
                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#3462AE] text-xs font-bold">↗</span>
              </button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === index ? 'bg-[#32B7EC] w-6' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Infinite Logo Marquee Section */}
      <section className="w-full py-12 bg-slate-50 border-y border-slate-100 overflow-hidden mt-12">
        <h3 className="text-center font-medium text-slate-500 uppercase tracking-widest text-xs mb-8">
          Identified 5000+ solutions for over 200+ organizations worldwide
        </h3>

        <div className="relative w-full overflow-hidden flex items-center">
          <div className="flex w-max animate-marquee space-x-16 hover:[animation-play-state:paused]">
            {[...clients, ...clients].map((client, index) => (
              <div key={index} className="flex justify-center items-center h-12 w-28 shrink-0">
                <img
                  src={client.logo}
                  alt={`${client.name} logo`}
                  className="max-h-full max-w-full object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Innovation Challenges / Hackathons Section */}
      <section id="flagshipevents" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#3462ae] font-bold">Innovation Center</span>
          <h2 className="font-syne text-3xl sm:text-5xl font-bold text-slate-900 mt-3">
            Flagship Innovation Challenges
          </h2>
          <p className="text-slate-500 mt-4">
            Participate in top corporate, state, and community hackathons. Build real solutions, showcase your tech talent, and win prizes.
          </p>
        </div>

        {loadingEvents ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="border border-slate-100 rounded-2xl p-6 h-[380px] bg-slate-50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {liveEvents.map((ev, index) => (
              <div key={index} className="flex flex-col border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img src={ev.homeImage} alt={ev.eventName} className="object-cover w-full h-full" />
                  <span className={`absolute top-3 right-3 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full text-white ${ev.isRegistrationOpen ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                    {ev.isRegistrationOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg line-clamp-2 min-h-[56px] cursor-default" title={ev.eventName}>
                      {ev.eventName}
                    </h3>
                    <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-slate-500">
                      <span>{ev.eventFee}</span>
                      <span>•</span>
                      <span>{ev.eventMode}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 text-xs">
                      <p className="text-slate-400 m-0">{ev.dateLabel}</p>
                      <p className="text-slate-700 font-bold m-0 mt-1">{ev.dateDisplay}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <a
                      href={ev.eventUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-2.5 rounded-lg text-xs font-bold text-center flex items-center justify-center transition ${ev.isRegistrationOpen ? 'bg-[#3462AE] hover:bg-[#1548B7] text-white' : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'}`}
                    >
                      {ev.isRegistrationOpen ? 'Register Now' : 'Registration Closed'}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why BIT Gaya Section */}
      <section id="whyH2s" className="py-20 px-4 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#3462ae] font-bold">Why BIT Gaya</span>
            <h2 className="font-syne text-3xl sm:text-5xl font-bold text-slate-900 mt-4 leading-tight">
              A center of excellence in technical education in Bihar.
            </h2>
            <p className="text-slate-600 mt-6 leading-relaxed">
              Buddha Institute of Technology (BIT) Gaya, established in 2008, produces skilled engineers, innovators, and future leaders under approval by AICTE and DST Bihar.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { title: 'AICTE Approved', desc: 'All programs comply with top technical education guidelines.' },
                { title: 'Center of Excellence', desc: 'State of the art laboratories, learning spaces, and research.' },
                { title: 'Future Careers', desc: 'Proven track records with BCA, BBA, B.Com, and B.Tech cohorts.' },
                { title: 'Industry Ready', desc: 'Hands-on bootcamp training and structured corporate project internships.' }
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-sm">
                  <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-[2rem] overflow-hidden bg-white border border-slate-200 p-6 shadow-xl">
            <div className="aspect-[16/11] rounded-2xl bg-[#0c1222] relative overflow-hidden flex items-center justify-center text-center p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(50,183,236,0.12),transparent_35%)]" />
              <div className="relative z-10 text-white">
                <span className="text-xs uppercase tracking-widest text-[#32B7EC] font-bold">Platform Impact</span>
                <h3 className="font-syne text-2xl sm:text-3xl font-extrabold mt-4">Bridge the skill gap, upskill, and find careers.</h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-4 leading-relaxed max-w-sm mx-auto">
                  Over 75,000+ students trained in state-of-the-art technologies including Quantum Computing, Blockchain, Web3, and AI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Initiatives & Upskilling Catalog (Original tracks converted to catalog) */}
      <section id="programs" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#3462ae] font-bold">Our Initiatives</span>
          <h2 className="font-syne text-3xl sm:text-5xl font-bold text-slate-900 mt-3">
            Upskilling Camps & Bootcamps
          </h2>
          <p className="text-slate-500 mt-4">
            Learn state-of-the-art tech domains under campus-led guidance from Buddha Institute of Technology mentors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <div
              key={index}
              onClick={() => setSelectedProgram(program)}
              className="group cursor-pointer rounded-2xl bg-white border border-slate-200/80 p-6 hover:shadow-xl hover:border-[#3462AE]/30 transition-all duration-300 relative flex flex-col justify-between min-h-[300px]"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl text-[#3462AE] group-hover:bg-[#3462AE] group-hover:text-white transition duration-300">
                  {program.icon}
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#32B7EC] block mt-6">{program.tag}</span>
                <h3 className="font-bold text-slate-900 text-xl mt-2 group-hover:text-[#3462AE] transition">{program.title}</h3>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">{program.description}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-[#3462AE] uppercase tracking-wider">
                <span>View Details</span>
                <span className="group-hover:translate-x-1.5 transition duration-300">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-syne text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50/50 transition"
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base">{item.q}</span>
                  <span className="text-[#3462AE] text-xl font-bold">{activeFaq === index ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-slate-500 text-xs sm:text-sm leading-relaxed"
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

      {/* Modals & Overlays */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl z-10 border border-slate-100"
            >
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
              <h3 className="font-syne text-2xl font-bold text-slate-900 mb-6">Join active challenge or bootcamp</h3>
              <RegistrationForm isModal={true} onSuccess={() => setIsRegisterModalOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProgram && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProgram(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-slate-100"
            >
              <button
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
              <span className="text-4xl text-[#3462AE] block mb-4">{selectedProgram.icon}</span>
              <h3 className="font-syne text-2xl font-bold text-slate-900 mb-2">{selectedProgram.title}</h3>
              <span className="text-xs font-bold text-[#32B7EC] uppercase tracking-wider block mb-6">{selectedProgram.tag}</span>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{selectedProgram.description}</p>

              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">Highlights:</h4>
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedProgram.highlights.map((h, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600 font-medium">
                    ✓ {h}
                  </span>
                ))}
              </div>

              <button
                onClick={() => {
                  setSelectedProgram(null)
                  setIsRegisterModalOpen(true)
                }}
                className="w-full py-3 bg-[#3462AE] hover:bg-[#1548B7] text-white rounded-xl font-bold transition shadow-lg text-sm"
              >
                Enroll In This Initiative
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
      `}</style>
    </main>
  )
}
