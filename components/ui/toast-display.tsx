/**
 * Toast Display Component
 * Displays toast notifications at the bottom right
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useContext } from 'react'
import { createContext } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToasts() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToasts must be used within ToastProvider')
  }
  return context
}

interface ToastDisplayProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastDisplay({ toasts, onRemove }: ToastDisplayProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-slate-50 border-slate-200 text-slate-800'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-3 pointer-events-auto`}
          >
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${getBgColor(
                toast.type
              )} shadow-lg`}
            >
              <span className="text-lg">{getIcon(toast.type)}</span>
              <span className="text-sm font-medium">{toast.message}</span>
              <button
                onClick={() => onRemove(toast.id)}
                className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
