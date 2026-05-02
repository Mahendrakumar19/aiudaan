/**
 * Simple structured logging utility for the application
 * Logs only in development, silently fails in production
 */

type LogLevel = 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  data?: Record<string, any>
  timestamp: string
}

const isDevelopment = process.env.NODE_ENV === 'development'

function formatLog(entry: LogEntry): string {
  return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${
    entry.data ? ' ' + JSON.stringify(entry.data) : ''
  }`
}

export const logger = {
  info: (message: string, data?: Record<string, any>) => {
    if (isDevelopment) {
      const entry: LogEntry = {
        level: 'info',
        message,
        data,
        timestamp: new Date().toISOString(),
      }
      console.log(formatLog(entry))
    }
  },

  warn: (message: string, data?: Record<string, any>) => {
    if (isDevelopment) {
      const entry: LogEntry = {
        level: 'warn',
        message,
        data,
        timestamp: new Date().toISOString(),
      }
      console.warn(formatLog(entry))
    }
  },

  error: (message: string, error?: unknown, data?: Record<string, any>) => {
    if (isDevelopment) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      const entry: LogEntry = {
        level: 'error',
        message,
        data: { ...data, error: errorMessage },
        timestamp: new Date().toISOString(),
      }
      console.error(formatLog(entry))
    }
  },
}

export default logger
