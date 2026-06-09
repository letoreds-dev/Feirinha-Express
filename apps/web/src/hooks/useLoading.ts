import { useState, useCallback, useMemo, useRef } from 'react'
import { toast } from '@/components/ui/toast'

// Hook useToast
export function useToast() {
  return {
    success: (title: string, message?: string) => toast.success(title, message),
    error: (title: string, message?: string) => toast.error(title, message),
    info: (title: string, message?: string) => toast.info(title, message),
    warning: (title: string, message?: string) => toast.warning(title, message),
  }
}

// Hook para loading state
export function useLoading(initialState = false) {
  const [loading, setLoading] = useState(initialState)

  const startLoading = useCallback(() => setLoading(true), [])
  const stopLoading = useCallback(() => setLoading(false), [])
  const toggleLoading = useCallback(() => setLoading(prev => !prev), [])

  return {
    loading,
    setLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    withLoading: async <T,>(fn: () => Promise<T>): Promise<T> => {
      setLoading(true)
      try {
        return await fn()
      } finally {
        setLoading(false)
      }
    },
  }
}

// Hook para erros
export function useError() {
  const [error, setError] = useState<Error | null>(null)
  const [hasError, setHasError] = useState(false)

  const setNewError = useCallback((err: Error | string) => {
    const error = typeof err === 'string' ? new Error(err) : err
    setError(error)
    setHasError(true)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
    setHasError(false)
  }, [])

  const errorMessage = useMemo(() => error?.message || null, [error])

  return {
    error,
    hasError,
    errorMessage,
    setError: setNewError,
    clearError,
  }
}

// Hook para dados com retry
interface UseRetryOptions {
  maxRetries?: number
  delay?: number
  onRetry?: (attempt: number) => void
}

export function useRetry<T>(
  fetchFn: () => Promise<T>,
  options: UseRetryOptions = {}
) {
  const { maxRetries = 3, delay = 1000, onRetry } = options
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<T | null>(null)
  const retryCount = useRef(0)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetchFn()
      setData(result)
      retryCount.current = 0
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')

      if (retryCount.current < maxRetries) {
        retryCount.current++
        onRetry?.(retryCount.current)

        await new Promise(resolve => setTimeout(resolve, delay * retryCount.current))
        return execute()
      }

      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [fetchFn, maxRetries, delay, onRetry])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    retryCount.current = 0
  }, [])

  return { data, loading, error, execute, reset }
}