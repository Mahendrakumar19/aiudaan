'use client'

import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animationVariants'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { getToolImage } from '@/lib/toolImages'

const marketingCards = [
  { title: 'Social Media Strategy', color: 'from-[#00FFCC] to-[#0099FF]' },
  { title: 'Content Optimization', color: 'from-[#0099FF] to-[#FF0055]' },
  { title: 'Ad Campaign Creation', color: 'from-[#FF0055] to-[#00FFCC]' },
  { title: 'SEO & Analytics', color: 'from-[#00FFCC] to-[#FF0055]' },
  { title: 'Resume Creation', color: 'from-[#FF0055] to-[#0099FF]' },
  { title: 'Business Presentation', color: 'from-[#0099FF] to-[#00FFCC]' }
]

const tools = [
  'ChatGPT',
  'Canva AI',
  'Google Gemini',
  'GenSpark'
]

export function AIDigitalMarketing() {
  const { t } = useLanguage()
  return (
    <section className="relative py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-8 leading-tight">
            {t('courses.aiTools')}
            <span className='block bg-gradient-to-r from-[#00FFCC] via-[#0099FF] to-[#FF0055] bg-clip-text text-transparent'>
              {t('courses.digitalMarketing')}
            </span>
          </h2>
        </motion.div>

        {/* Marketing Cards */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {marketingCards.map((card) => (
            <motion.div
              key={card.title}
              variants={staggerItemVariants}
              whileHover={{ y: -8 }}
              className='group relative'
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00FFCC]/10 to-[#FF0055]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className='relative bg-[#0D1117]/80 backdrop-blur-xl border border-white/10 hover:border-[#00FFCC]/30 rounded-2xl p-8 min-h-[200px] flex flex-col items-center justify-center text-center shadow-xl shadow-[#00FFCC]/5 transition-all'>
                <span className='text-4xl mb-4'>💼</span>
                <h3 className={`font-bold text-xl bg-gradient-to-r ${card.color} bg-clip-text text-transparent group-hover:text-white transition-all`}>
                  {card.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-8">{t('home.tools')}</h3>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-12">
            {tools.map((toolName, index) => {
              const toolData = getToolImage(toolName)
              return (
                <motion.div
                  key={toolName}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                  className="text-center group"
                >
                  <motion.div className="w-20 h-20 bg-[#0D1117]/90 border border-white/10 rounded-lg flex items-center justify-center text-lg mb-3 shadow-md group-hover:shadow-lg transition-all p-2 overflow-hidden">
                    <img 
                      src={toolData.image} 
                      alt={toolData.name}
                      className="w-16 h-16 object-contain"
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
                    <div className="hidden w-full h-full items-center justify-center bg-[#00FFCC] text-white font-bold rounded-md">
                      {toolData.name.substring(0, 2).toUpperCase()}
                    </div>
                  </motion.div>
                  <p className='text-[#8892B0] font-semibold text-sm'>{toolData.name}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
