'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RegistrationForm } from '@/components/forms/RegistrationForm'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'

export function RegistrationModal() {
  const [showModal, setShowModal] = useState(false)
  const [showCloseButton, setShowCloseButton] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [hasUserClosed, setHasUserClosed] = useState(false)
  const [closeButtonProgress, setCloseButtonProgress] = useState(0)

  // Use custom hook to manage body scroll lock
  useBodyScrollLock(showModal)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    // Listen for enrollNow event from course cards
    const handleEnrollNow = () => {
      setShowModal(true)
      setShowCloseButton(true) // Show close button immediately on demand
      setCloseButtonProgress(100) // Set progress to 100% when on-demand
      setHasUserClosed(false) // Reset the closed state
    }

    window.addEventListener('enrollNow', handleEnrollNow)
    return () => {
      window.removeEventListener('enrollNow', handleEnrollNow)
    }
  }, [isHydrated])

  useEffect(() => {
    if (!isHydrated || hasUserClosed) return

    // Show modal after 2-3 seconds (auto-popup)
    const modalTimer = setTimeout(() => {
      setShowModal(true)
    }, 2500)

    // Show close button after 3 seconds
    const closeButtonTimer = setTimeout(() => {
      setShowCloseButton(true)
      setCloseButtonProgress(100)
    }, 3000)

    const timers = [modalTimer, closeButtonTimer]

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [isHydrated, hasUserClosed])

  const handleCloseModal = () => {
    setShowModal(false)
    setShowCloseButton(false)
    setCloseButtonProgress(0)
    setHasUserClosed(true)
  }

  if (!isHydrated) return null

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {/* Background Overlay */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md pointer-events-auto"
            onClick={showCloseButton ? handleCloseModal : undefined}
          />

          {/* Modal Wrapper - Centered with internal scroll */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.4,
              ease: [0.23, 1, 0.82, 1],
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden pt-32 sm:pt-40 md:pt-32"
          >
            {/* Modal Container - Full scrollable content */}
            <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto relative mx-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
              {/* Close Button */}
              <AnimatePresence>
                {showCloseButton && (
                  <motion.button
                    key="close-btn"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleCloseModal}
                    className="absolute top-2 sm:top-4 right-2 sm:right-4 z-50 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 flex items-center justify-center transition-all duration-200 hover:scale-125 cursor-pointer flex-shrink-0"
                    aria-label="Close modal"
                    type="button"
                  >
                    <span className="text-white text-xs sm:text-sm font-bold leading-none">✕</span>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Modal Content */}
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl"
              >
                {/* Premium header accent */}
                <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-t-3xl" />

                {/* Progress Line - Shows until close button appears */}
                {!showCloseButton && (
                  <motion.div
                    className="h-0.5 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                    style={{ width: `${closeButtonProgress}%` }}
                    transition={{ width: { duration: 0.1 } }}
                  />
                )}

                {/* Registration Form */}
                <div className="relative">
                  <RegistrationForm onSuccess={handleCloseModal} isModal={true} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
