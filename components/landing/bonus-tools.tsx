'use client'

import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animationVariants'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { getToolImage, getToolsByCategory } from '@/lib/toolImages'

export function BonusTools() {
  const { t } = useLanguage()

  const toolCategories = [
    {
      title: t('home.catWriting'),
      description: t('home.descWriting'),
      key: 'AI Writing & Content' // internal key for getToolsByCategory
    },
    {
      title: t('home.catImage'),
      description: t('home.descImage'),
      key: 'Image Generation'
    },
    {
      title: t('home.catVideo'),
      description: t('home.descVideo'),
      key: 'Video Creation'
    },
    {
      title: t('home.catAudio'),
      description: t('home.descAudio'),
      key: 'Audio & Voice'
    },
    {
      title: t('home.catSearch'),
      description: t('home.descSearch'),
      key: 'Search & Research'
    },
    {
      title: t('home.catAutomation'),
      description: t('home.descAutomation'),
      key: 'Automation'
    },
    {
      title: t('home.catProductivity'),
      description: t('home.descProductivity'),
      key: 'Productivity & Design'
    },
    {
      title: t('home.catBusiness'),
      description: t('home.descBusiness'),
      key: 'Business Tools'
    }
  ]

  return (
    <section className="relative py-12 sm:py-20 px-6 overflow-x-hidden">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-syne text-4xl md:text-6xl font-bold text-white mb-6">
            {t('home.bonus')} <br />
            <span className='brand-gradient-text'>
              {t('home.toolsResources')}
            </span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">{t('home.professionalTools')}</p>
        </motion.div>

        {/* Tools by Category */}
        <div className="space-y-32">
          {toolCategories.map((category, categoryIndex) => {
            const toolsInCategory = getToolsByCategory(category.key)
            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
                className="space-y-10"
              >
                <div className="border-l-4 border-brand-cyan pl-6">
                  <h3 className="font-syne text-2xl md:text-4xl font-bold text-white mb-2">{category.title}</h3>
                  <p className="text-text-secondary text-sm md:text-base">{category.description}</p>
                </div>
                
                <motion.div
                  variants={staggerContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {toolsInCategory.map((toolName) => {
                    const toolData = getToolImage(toolName)
                    return (
                      <motion.div
                        key={toolName}
                        variants={staggerItemVariants}
                        whileHover={{ y: -6 }}
                        className="group relative"
                      >
                        <div className="glass p-8 rounded-3xl border-white/5 hover:border-brand-cyan/20 transition-all flex flex-col items-center text-center h-full">
                          <motion.div 
                            className="w-20 h-20 mb-6 inline-flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-brand-blue/10 group-hover:border-brand-blue/30 transition-colors"
                            whileHover={{ rotate: 5, scale: 1.1 }}
                          >
                              <img 
                                src={toolData.image} 
                                alt={toolData.name}
                                className="w-full h-full object-contain"
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.currentTarget
                                  target.style.display = 'none'
                                  const fallback = target.nextElementSibling as HTMLElement
                                  if (fallback) {
                                    fallback.classList.remove('hidden')
                                    fallback.style.display = 'flex'
                                  }
                                }}
                              />
                              <div 
                                className="hidden w-full h-full flex items-center justify-center bg-brand-blue/20 rounded-xl text-brand-cyan font-black text-xl"
                              >
                                {toolData.name.substring(0, 1).toUpperCase()}
                              </div>
                            </motion.div>
                          <h4 className="text-lg font-bold text-white mb-2">{toolData.name}</h4>
                          <p className="text-xs text-text-secondary leading-relaxed">{toolData.description}</p>
                          <div className="mt-auto pt-6 text-[10px] font-bold text-brand-cyan uppercase tracking-widest">{t('home.professionalTool')}</div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-32 p-12 rounded-[3rem] glass border-white/10"
        >
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <motion.h4 className="font-syne text-5xl font-black text-brand-cyan mb-2">27+</motion.h4>
              <p className="text-text-secondary font-bold uppercase tracking-widest text-xs">Professional Tools</p>
            </div>
            <div>
              <motion.h4 className="font-syne text-5xl font-black text-brand-cyan mb-2">8</motion.h4>
              <p className="text-text-secondary font-bold uppercase tracking-widest text-xs">Major Categories</p>
            </div>
            <div>
              <motion.h4 className="font-syne text-5xl font-black text-brand-cyan mb-2">∞</motion.h4>
              <p className="text-text-secondary font-bold uppercase tracking-widest text-xs">Lifetime Access</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}