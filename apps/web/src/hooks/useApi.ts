import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/toast'

interface UseApiOptions<T> {
  fetchFn: () => Promise<T>
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  enabled?: boolean
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useApi<T>({
  fetchFn,
  onSuccess,
  onError,
  enabled = true,
}: UseApiOptions<T>): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const result = await fetchFn()
      setData(result)
      onSuccess?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [fetchFn, onSuccess, onError, enabled])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}

// Hook para mutation (create, update, delete)
interface UseMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>
  onSuccess?: (data: TData) => void
  onError?: (error: Error) => void
  onFinally?: () => void
}

interface UseMutationReturn<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | undefined>
  loading: boolean
  error: Error | null
  reset: () => void
}

export function useMutation<TData, TVariables = void>({
  mutationFn,
  onSuccess,
  onError,
  onFinally,
}: UseMutationOptions<TData, TVariables>): UseMutationReturn<TData, TVariables> {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = useCallback(async (variables: TVariables): Promise<TData | undefined> => {
    setLoading(true)
    setError(null)

    try {
      const result = await mutationFn(variables)
      onSuccess?.(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      onError?.(error)
    } finally {
      setLoading(false)
      onFinally?.()
    }
  }, [mutationFn, onSuccess, onError, onFinally])

  const reset = useCallback(() => {
    setError(null)
  }, [])

  return { mutate, loading, error, reset }
}

// Hook para dados com cache
interface UseDataOptions<T> extends UseApiOptions<T> {
  initialData?: T
}

export function useData<T>(options: UseDataOptions<T>): UseApiReturn<T> {
  const toast = useToast()

  return useApi({
    ...options,
    onError: (error) => {
      console.error('API Error:', error)
      toast.error('Erro ao carregar dados')
      options.onError?.(error)
    },
  })
}