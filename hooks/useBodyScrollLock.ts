import { useEffect } from 'react'

/**
 * Custom hook to manage body scroll lock
 * Prevents body scroll when modal is open
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      try {
        // Save current scroll position
        if (typeof window !== 'undefined' && window.scrollY !== undefined) {
          const scrollY = window.scrollY
          document.body.style.overflow = 'hidden'
          document.body.style.paddingRight = 'var(--scrollbar-width, 0px)'
          
          return () => {
            try {
              document.body.style.overflow = 'unset'
              document.body.style.paddingRight = '0px'
              // Restore scroll position
              if (typeof window !== 'undefined' && window.scrollTo) {
                window.scrollTo(0, scrollY)
              }
            } catch (error) {
              console.error('Error restoring scroll position:', error)
            }
          }
        }
      } catch (error) {
        console.error('Error locking scroll:', error)
      }
    }
    return undefined
  }, [isLocked])
}
