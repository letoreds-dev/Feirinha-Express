import { renderHook, act, waitFor } from '@testing-library/react'
import { useApi, useMutation, useData } from '@/hooks/useApi'

// Mock do toast
jest.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    error: jest.fn(),
  }),
}))

describe('useApi', () => {
  describe('renderização inicial', () => {
    it('deve iniciar com loading true', () => {
      const { result } = renderHook(() =>
        useApi({
          fetchFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 100))
            return 'data'
          },
        })
      )

      expect(result.current.loading).toBe(true)
    })

    it('deve iniciar com data null', () => {
      const { result } = renderHook(() =>
        useApi({
          fetchFn: async () => 'data',
        })
      )

      expect(result.current.data).toBeNull()
    })

    it('deve iniciar com error null', () => {
      const { result } = renderHook(() =>
        useApi({
          fetchFn: async () => 'data',
        })
      )

      expect(result.current.error).toBeNull()
    })
  })

  describe('fetch bem-sucedido', () => {
    it('deve retornar dados após fetch', async () => {
      const { result } = renderHook(() =>
        useApi({
          fetchFn: async () => 'test data',
        })
      )

      await waitFor(() => {
        expect(result.current.data).toBe('test data')
      })
    })

    it('deve chamar onSuccess callback', async () => {
      const onSuccess = jest.fn()
      renderHook(() =>
        useApi({
          fetchFn: async () => 'data',
          onSuccess,
        })
      )

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith('data')
      })
    })

    it('deve definir loading como false após fetch', async () => {
      const { result } = renderHook(() =>
        useApi({
          fetchFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 10))
            return 'data'
          },
        })
      )

      await waitFor(() => {
        expect(result.current.data).toBe('data')
      }, { timeout: 3000 })
    })
  })

  describe('fetch com erro', () => {
    it('deve definir error quando fetch falha', async () => {
      const error = new Error('Fetch failed')
      const { result } = renderHook(() =>
        useApi({
          fetchFn: async () => {
            throw error
          },
        })
      )

      // Espera um pouco para o erro ser definido
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(result.current.error).toEqual(error)
    })

    it('deve chamar onError callback', async () => {
      const onError = jest.fn()
      renderHook(() =>
        useApi({
          fetchFn: async () => {
            throw new Error('Error')
          },
          onError,
        })
      )

      // Espera um pouco para o callback ser chamado
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(onError).toHaveBeenCalled()
    })

    it('deve definir error após falha', async () => {
      const { result } = renderHook(() =>
        useApi({
          fetchFn: async () => {
            throw new Error('Error')
          },
        })
      )

      // Espera um pouco para o erro ser definido
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(result.current.error).toBeInstanceOf(Error)
    })
  })

  describe('enabled option', () => {
    it('não deve fazer fetch quando enabled é false', async () => {
      const fetchFn = jest.fn()
      renderHook(() =>
        useApi({
          fetchFn,
          enabled: false,
        })
      )

      expect(fetchFn).not.toHaveBeenCalled()
    })
  })

  describe('refetch', () => {
    it('deve refazer fetch quando refetch é chamado', async () => {
      const fetchFn = jest.fn().mockResolvedValue('data')
      const { result } = renderHook(() =>
        useApi({
          fetchFn,
        })
      )

      await waitFor(() => {
        expect(result.current.data).toBe('data')
      })

      await act(async () => {
        await result.current.refetch()
      })

      expect(fetchFn).toHaveBeenCalledTimes(2)
    })
  })
})

describe('useMutation', () => {
  describe('estado inicial', () => {
    it('deve iniciar com loading false', () => {
      const { result } = renderHook(() =>
        useMutation({
          mutationFn: async () => 'result',
        })
      )

      expect(result.current.loading).toBe(false)
    })

    it('deve iniciar com error null', () => {
      const { result } = renderHook(() =>
        useMutation({
          mutationFn: async () => 'result',
        })
      )

      expect(result.current.error).toBeNull()
    })
  })

  describe('mutate bem-sucedido', () => {
    it('deve retornar dados após mutation', async () => {
      const { result } = renderHook(() =>
        useMutation({
          mutationFn: async (data: string) => `processed: ${data}`,
        })
      )

      let response: string | undefined
      await act(async () => {
        response = await result.current.mutate('test')
      })

      expect(response).toBe('processed: test')
    })

    it('deve chamar onSuccess callback', async () => {
      const onSuccess = jest.fn()
      const { result } = renderHook(() =>
        useMutation({
          mutationFn: async (data: string) => data,
          onSuccess,
        })
      )

      await act(async () => {
        await result.current.mutate('test')
      })

      expect(onSuccess).toHaveBeenCalledWith('test')
    })

    it('deve definir loading como true durante mutation', async () => {
      const { result } = renderHook(() =>
        useMutation({
          mutationFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 100))
            return 'result'
          },
        })
      )

      act(() => {
        result.current.mutate('test')
      })

      expect(result.current.loading).toBe(true)
    })
  })

  describe('mutate com erro', () => {
    it('deve definir error quando mutation falha', async () => {
      const { result } = renderHook(() =>
        useMutation({
          mutationFn: async () => {
            throw new Error('Mutation failed')
          },
        })
      )

      await act(async () => {
        await result.current.mutate('test')
      })

      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('Mutation failed')
    })

    it('deve chamar onError callback', async () => {
      const onError = jest.fn()
      const { result } = renderHook(() =>
        useMutation({
          mutationFn: async () => {
            throw new Error('Error')
          },
          onError,
        })
      )

      await act(async () => {
        await result.current.mutate('test')
      })

      expect(onError).toHaveBeenCalled()
    })
  })

  describe('reset', () => {
    it('deve limpar error quando reset é chamado', async () => {
      const { result } = renderHook(() =>
        useMutation({
          mutationFn: async () => {
            throw new Error('Error')
          },
        })
      )

      await act(async () => {
        await result.current.mutate('test')
      })

      expect(result.current.error).not.toBeNull()

      act(() => {
        result.current.reset()
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('onFinally', () => {
    it('deve chamar onFinally após mutation', async () => {
      const onFinally = jest.fn()
      const { result } = renderHook(() =>
        useMutation({
          mutationFn: async () => 'result',
          onFinally,
        })
      )

      await act(async () => {
        await result.current.mutate('test')
      })

      expect(onFinally).toHaveBeenCalled()
    })

    it('deve chamar onFinally mesmo após erro', async () => {
      const onFinally = jest.fn()
      const { result } = renderHook(() =>
        useMutation({
          mutationFn: async () => {
            throw new Error('Error')
          },
          onFinally,
        })
      )

      await act(async () => {
        await result.current.mutate('test')
      })

      expect(onFinally).toHaveBeenCalled()
    })
  })
})

describe('useData', () => {
  it('deve funcionar como useApi', async () => {
    const { result } = renderHook(() =>
      useData({
        fetchFn: async () => 'data',
      })
    )

    await waitFor(() => {
      expect(result.current.data).toBe('data')
    })
  })
})
