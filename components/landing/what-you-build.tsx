'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  DocumentTextIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  FilmIcon,
} from '@heroicons/react/24/solid'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animationVariants'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { getToolImage } from '@/lib/toolImages'

const projects = [
  {
    title: 'AI Web App Generation',
    icon: DocumentTextIcon,
    description: 'Build full-stack web applications using AI. Learn to create modern web apps with guided steps and real-world deployment.',
    gradient: 'from-blue-100 to-blue-50',
    border: 'border-blue-300',
    glow: 'shadow-blue-200/40',
    details: {
      overview: 'Learn to build production-ready web applications using AI assistance. This project combines frontend, backend, and AI integration.',
      objectives: [
        'Master modern web development frameworks (Next.js, React)',
        'Integrate AI APIs and chatbots into applications',
        'Deploy applications to production',
        'Use Cursor AI for intelligent code generation',
        'Leverage AntiGravity for advanced development workflows'
      ],
      tools: ['Next.js', 'React', 'ChatGPT API', 'Vercel', 'Cursor', 'AntiGravity'],
      duration: '4-6 weeks',
      difficulty: 'Intermediate to Advanced'
    }
  },
  {
    title: 'AI Filmmaking',
    icon: FilmIcon,
    description: 'Create AI-powered films with talking avatars, CGI, and video production. Master the art of visual storytelling with AI.',
    gradient: 'from-pink-100 to-rose-50',
    border: 'border-pink-300',
    glow: 'shadow-pink-200/40',
    details: {
      overview: 'Produce professional-quality videos and films using AI tools. Learn video production, animation, and visual effects creation.',
      objectives: [
        'Create talking avatar videos with HeyGen and Synthesia',
        'Master video editing and post-production',
        'Use Veo3 for advanced AI video generation',
        'Produce complete short films with AI assistance',
        'Master Filmora 15 for professional editing'
      ],
      tools: ['HeyGen', 'Synthesia', 'Runway ML', 'Veo3', 'Filmora 15', 'Adobe Premiere'],
      duration: '6-8 weeks',
      difficulty: 'Intermediate to Advanced'
    }
  },
  {
    title: 'AI Automation Workflow & Prompt Engineering',
    icon: Cog6ToothIcon,
    description: 'Master prompt engineering and build end-to-end AI automation systems that save time and boost productivity.',
    gradient: 'from-orange-100 to-blue-50',
    border: 'border-orange-300',
    glow: 'shadow-orange-200/40',
    details: {
      overview: 'Become an expert in prompt engineering and design intelligent automation systems. Create workflows that integrate AI into business processes and custom applications.',
      objectives: [
        'Master prompt structure and best practices for maximum AI capabilities',
        'Learn chain-of-thought and few-shot prompting techniques',
        'Create custom GPT applications and Claude Applications',
        'Build automation workflows using N8N and advanced tools',
        'Integrate AI APIs into automation pipelines',
        'Save time and money through effective prompt optimization'
      ],
      tools: ['N8N', 'OpenAI API', 'Python', 'ChatGPT', 'Claude Opus 4.6', 'Make.com'],
      duration: '5-7 weeks',
      difficulty: 'Intermediate'
    }
  },
  {
    title: 'AI Digital Marketing',
    icon: MegaphoneIcon,
    description: 'Learn to leverage AI for comprehensive digital marketing across all platforms. Create engaging content and drive lead generation.',
    gradient: 'from-blue-100 to-purple-50',
    border: 'border-blue-300',
    glow: 'shadow-blue-200/40',
    details: {
      overview: 'Master AI-powered digital marketing strategies. Create professional marketing materials, landing pages, and campaigns using cutting-edge AI tools.',
      objectives: [
        'Generate compelling ad copy and landing pages using ChatGPT and Gemini',
        'Design graphics and marketing materials with Canva and Nano Banana Pro',
        'Create resume and business presentations with GenSpark',
        'Manage campaigns across Facebook, Instagram, YouTube, and Google Ads',
        'Master Meta AI and Soshie/Seomi for social media automation',
        'Create viral-worthy content for lead generation'
      ],
      tools: ['ChatGPT', 'Sintra AI', 'Meta AI', 'Canva', 'Nano Banana Pro', 'GenSpark', 'Google Ads'],
      duration: '4-5 weeks',
      difficulty: 'Beginner to Intermediate'
    }
  }
]

export function WhatYouWillBuild() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const { t } = useLanguage()

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedProject])
  return (
    <section className='relative py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden'>
      <div className='mx-auto max-w-6xl'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight'>
            {t('home.whatYouWill')} {t('home.build')}
            <span className='block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent'>
              {t('home.inThisBootcamp')}
            </span>
          </h2>
          <p className='text-lg md:text-xl text-slate-300 max-w-3xl mx-auto'>
            {t('home.handsOnProjects')}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-10'
        >
          {projects.map((project, index) => {
            const Icon = project.icon
            return (
              <motion.div
                key={project.title}
                variants={staggerItemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className='group relative flex flex-col h-full'
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${project.gradient} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Card */}
                <div className={`relative backdrop-blur-xl bg-slate-900/50 border border-white/10 rounded-2xl p-8 md:p-10 h-full flex flex-col justify-between shadow-xl group-hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                  {/* Top accent */}
                  <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent' />

                  {/* Icon container */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className='mb-6'
                  >
                    <div className='flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 group-hover:border-white/20 transition-all'>
                      <Icon className='w-8 h-8 text-white' />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className='flex-1 mb-6'>
                    <h3 className='text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors'>
                      {project.title}
                    </h3>
                    <p className='text-base text-slate-300 group-hover:text-slate-100 transition-colors leading-relaxed'>
                      {project.description}
                    </p>
                  </div>

                  {/* Button & Bottom accent */}
                  <div className='space-y-4'>
                    {/* Details Button */}
                    <motion.button
                      onClick={() => setSelectedProject(project)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className='w-full py-3 px-5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/20'
                    >
                      Click here for details
                    </motion.button>

                    {/* Bottom accent */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className='h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent origin-left'
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Details Modal */}
        <AnimatePresence>
          {selectedProject && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className='fixed inset-0 bg-black/80 backdrop-blur-md z-40'
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className='fixed inset-0 z-50 flex items-start justify-center pt-4 md:pt-8 p-4 overflow-y-auto'
              >
                <div className='w-full max-w-2xl mt-4 md:mt-8 mb-8'>
                  <motion.div
                    className='bg-slate-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative'
                  >
                    {/* Header with gradient accent */}
                    <div className='h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500' />
                    
                    <div className='p-8 md:p-10 space-y-6 max-h-[80vh] overflow-y-auto'>
                      {/* Close Button - Fixed positioning */}
                      <motion.button
                        onClick={() => setSelectedProject(null)}
                        className='fixed top-8 right-6 md:top-12 md:right-8 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all z-50'
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className='text-white text-xl'>✕</span>
                      </motion.button>

                      {/* Title */}
                      <div className='mt-8 md:mt-2'>
                        <h3 className='text-3xl md:text-4xl font-bold text-white mb-2'>
                          {selectedProject.title}
                        </h3>
                        <div className='h-1 w-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full' />
                      </div>

                      {/* Overview */}
                      <div>
                        <h4 className='text-lg font-semibold text-cyan-400 mb-3'>Overview</h4>
                        <p className='text-slate-300 leading-relaxed'>
                          {selectedProject.details.overview}
                        </p>
                      </div>

                      {/* Objectives */}
                      <div>
                        <h4 className='text-lg font-semibold text-cyan-400 mb-3'>Learning Objectives</h4>
                        <ul className='space-y-2'>
                          {selectedProject.details.objectives.map((objective, idx) => (
                            <li key={idx} className='flex items-start gap-3 text-slate-300'>
                              <span className='text-cyan-400 font-bold mt-1'>✓</span>
                              <span>{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tools & Technologies */}
                      <div>
                        <h4 className='text-lg font-semibold text-cyan-400 mb-3'>Tools & Technologies</h4>
                        <div className='flex flex-wrap gap-2'>
                          {selectedProject.details.tools.map((tool, idx) => {
                            const toolData = getToolImage(tool)
                            return (
                              <div
                                key={idx}
                                className='flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm'
                              >
                                <img 
                                  src={toolData.image} 
                                  alt={tool}
                                  className='w-5 h-5 object-contain'
                                  onError={(e) => e.currentTarget.style.display = 'none'}
                                />
                                <span className='font-medium'>{tool}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Course Details Grid */}
                      <div className='grid grid-cols-3 gap-4'>
                        <div className='p-3 rounded-lg bg-slate-900 border border-white/10 shadow-md'>
                          <p className='text-xs text-slate-400 mb-1'>Duration</p>
                          <p className='text-sm font-semibold text-white'>{selectedProject.details.duration}</p>
                        </div>
                        <div className='p-3 rounded-lg bg-slate-900 border border-white/10 shadow-md'>
                          <p className='text-xs text-slate-400 mb-1'>Difficulty</p>
                          <p className='text-sm font-semibold text-white'>{selectedProject.details.difficulty}</p>
                        </div>
                        <div className='p-3 rounded-lg bg-slate-900 border border-white/10 shadow-md'>
                          <p className='text-xs text-slate-400 mb-1'>Skills</p>
                          <p className='text-sm font-semibold text-cyan-400'>Practical</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className='flex gap-3 pt-4'>
                        <motion.button
                          onClick={() => {
                            // Dispatch event to show registration modal
                            window.dispatchEvent(new Event('enrollNow'))
                            // Close course details modal
                            setSelectedProject(null)
                          }}
                          whileHover={{ scale: 1.05 }}
                          className='flex-1 py-3 px-5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold transition-all duration-300'
                        >
                          Enroll Now
                        </motion.button>
                        <motion.button
                          onClick={() => setSelectedProject(null)}
                          whileHover={{ scale: 1.05 }}
                          className='px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold transition-all duration-300'
                        >
                          Close
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
