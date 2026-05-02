/**
 * Dynamic Import Wrapper for Code Splitting
 * Lazy load heavy components to reduce initial bundle
 */

import dynamic from 'next/dynamic'
import { ComponentType, ReactNode } from 'react'

interface DynamicImportOptions {
  loading?: (props: any) => ReactNode
  ssr?: boolean
}

/**
 * Lazy load a component with loading state
 * Usage: const HeavyComponent = lazyLoad(() => import('@/components/heavy'))
 */
export function lazyLoad<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options?: DynamicImportOptions
) {
  return dynamic(importFunc, {
    loading: options?.loading || (() => null),
    ssr: options?.ssr !== false,
  })
}

/**
 * Preload a component in background (for performance)
 * Usage: preloadComponent(() => import('@/components/heavy'))
 */
export function preloadComponent(
  importFunc: () => Promise<{ default: any }>
): void {
  if (typeof window !== 'undefined') {
    requestIdleCallback?.(() => {
      importFunc()
    })
  }
}
