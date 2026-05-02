'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export function ScrollWheelUI() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark component as hydrated
    setIsHydrated(true)
    
    // Show scroll wheel after page loaded
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  // Don't render until hydrated
  if (!isHydrated) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className='fixed bottom-24 right-8 z-30 hidden md:flex flex-col gap-2'
    >
      {/* Page Start Button */}
      <motion.button
        whileHover={{ y: -3, scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          try {
            if (typeof window !== 'undefined' && window.scrollTo) {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          } catch (error) {
            console.error('Scroll to top error:', error)
          }
        }}
        className='p-3 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 border border-white/20 hover:border-white/40 text-white transition-all duration-300 shadow-xl hover:shadow-cyan-500/40'
        title='Go to Page Start'
      >
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M7 11l5-5m0 0l5 5m-5-5v12' />
        </svg>
      </motion.button>

      {/* Page Bottom Button */}
      <motion.button
        whileHover={{ y: 3, scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          try {
            if (typeof window !== 'undefined' && document.body && document.body.scrollHeight !== undefined) {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
            }
          } catch (error) {
            console.error('Scroll to bottom error:', error)
          }
        }}
        className='p-3 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 border border-white/20 hover:border-white/40 text-white transition-all duration-300 shadow-xl hover:shadow-cyan-500/40'
        title='Go to Page Bottom'
      >
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M7 13l5 5m0 0l5-5m-5 5V6' />
        </svg>
      </motion.button>
    </motion.div>
  )
}
