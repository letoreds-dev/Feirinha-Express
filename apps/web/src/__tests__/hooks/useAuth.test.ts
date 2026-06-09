import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '@/store/auth'

describe('useAuth (authStore hook)', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAuthStore())
    act(() => {
      result.current.logout()
    })
  })

  describe('autenticação', () => {
    it('deve autenticar usuário', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.setAuth(
          {
            id: 'user-1',
            email: 'user@example.com',
            name: 'Usuario Teste',
            type: 'customer',
          },
          'jwt-token-123'
        )
      })

      expect(result.current.isAuthenticated()).toBe(true)
      expect(result.current.user?.email).toBe('user@example.com')
    })

    it('deve manter token após autenticação', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.setAuth(
          {
            id: 'user-1',
            email: 'user@example.com',
            name: 'Usuario Teste',
            type: 'customer',
          },
          'token-valido'
        )
      })

      expect(result.current.token).toBe('token-valido')
    })
  })

  describe('logout', () => {
    it('deve deslogar usuário', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.setAuth(
          {
            id: 'user-1',
            email: 'user@example.com',
            name: 'Usuario Teste',
            type: 'customer',
          },
          'token'
        )
      })

      act(() => {
        result.current.logout()
      })

      expect(result.current.isAuthenticated()).toBe(false)
      expect(result.current.user).toBeNull()
      expect(result.current.token).toBeNull()
    })
  })

  describe('tipo de usuário', () => {
    it('deve identificar usuário comum', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.setAuth(
          {
            id: 'user-1',
            email: 'user@example.com',
            name: 'Usuario',
            type: 'customer',
          },
          'token'
        )
      })

      expect(result.current.isMerchant()).toBe(false)
    })

    it('deve identificar lojista', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.setAuth(
          {
            id: 'merchant-1',
            email: 'merchant@example.com',
            name: 'Lojista',
            type: 'merchant',
            merchant: {
              id: 'merchant-profile-1',
              storeName: 'Minha Loja',
              storeType: 'restaurant',
              status: 'active',
            },
          },
          'token'
        )
      })

      expect(result.current.isMerchant()).toBe(true)
      expect(result.current.user?.merchant?.storeName).toBe('Minha Loja')
    })
  })

  describe('dados do usuário', () => {
    it('deve armazenar dados completos do usuário', () => {
      const { result } = renderHook(() => useAuthStore())

      const userData = {
        id: 'user-1',
        email: 'user@example.com',
        name: 'Usuario Teste',
        type: 'customer' as const,
      }

      act(() => {
        result.current.setAuth(userData, 'token')
      })

      expect(result.current.user).toMatchObject(userData)
    })

    it('deve permitir logout mesmo sem autenticação', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.logout()
      })

      expect(result.current.isAuthenticated()).toBe(false)
    })
  })
})
