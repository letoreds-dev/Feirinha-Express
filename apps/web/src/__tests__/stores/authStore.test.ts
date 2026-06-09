import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '@/store/auth'

describe('useAuthStore', () => {
  // Reset store antes de cada teste
  beforeEach(() => {
    const { result } = renderHook(() => useAuthStore())
    act(() => {
      result.current.logout()
    })
  })

  describe('setAuth', () => {
    it('deve definir usuário e token', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.setAuth(
          {
            id: 'user-1',
            email: 'test@example.com',
            name: 'Usuario Teste',
            type: 'customer',
          },
          'token-123'
        )
      })

      expect(result.current.user).toEqual({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Usuario Teste',
        type: 'customer',
      })
      expect(result.current.token).toBe('token-123')
    })

    it('deve definir usuário do tipo lojista', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.setAuth(
          {
            id: 'merchant-1',
            email: 'merchant@example.com',
            name: 'Lojista Teste',
            type: 'merchant',
            merchant: {
              id: 'merchant-profile-1',
              storeName: 'Minha Loja',
              storeType: 'restaurant',
              status: 'active',
            },
          },
          'merchant-token'
        )
      })

      expect(result.current.user?.type).toBe('merchant')
      expect(result.current.user?.merchant?.storeName).toBe('Minha Loja')
    })
  })

  describe('logout', () => {
    it('deve limpar usuário e token', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.setAuth(
          {
            id: 'user-1',
            email: 'test@example.com',
            name: 'Usuario Teste',
            type: 'customer',
          },
          'token-123'
        )
      })

      act(() => {
        result.current.logout()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.token).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('deve retornar true quando autenticado', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.setAuth(
          {
            id: 'user-1',
            email: 'test@example.com',
            name: 'Usuario Teste',
            type: 'customer',
          },
          'token-123'
        )
      })

      expect(result.current.isAuthenticated()).toBe(true)
    })

    it('deve retornar false quando não autenticado', () => {
      const { result } = renderHook(() => useAuthStore())
      expect(result.current.isAuthenticated()).toBe(false)
    })

    it('deve retornar false quando token é null', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.setAuth(
          {
            id: 'user-1',
            email: 'test@example.com',
            name: 'Usuario Teste',
            type: 'customer',
          },
          ''
        )
      })

      expect(result.current.isAuthenticated()).toBe(false)
    })
  })

  describe('isMerchant', () => {
    it('deve retornar true para usuário lojista', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.setAuth(
          {
            id: 'merchant-1',
            email: 'merchant@example.com',
            name: 'Lojista Teste',
            type: 'merchant',
          },
          'token'
        )
      })

      expect(result.current.isMerchant()).toBe(true)
    })

    it('deve retornar false para usuário comum', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.setAuth(
          {
            id: 'user-1',
            email: 'test@example.com',
            name: 'Usuario Teste',
            type: 'customer',
          },
          'token'
        )
      })

      expect(result.current.isMerchant()).toBe(false)
    })

    it('deve retornar false quando não autenticado', () => {
      const { result } = renderHook(() => useAuthStore())
      expect(result.current.isMerchant()).toBe(false)
    })
  })
})
