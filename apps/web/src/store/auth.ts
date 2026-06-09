import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  type: 'customer' | 'merchant'
  merchant?: {
    id: string
    storeName: string
    storeType: string
    status: string
  }
}

interface AuthStore {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: () => boolean
  isMerchant: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        set({ user, token })
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token)
        }
      },

      logout: () => {
        set({ user: null, token: null })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
        }
      },

      isAuthenticated: () => !!get().token,

      isMerchant: () => get().user?.type === 'merchant',
    }),
    {
      name: 'feirinha-auth',
    }
  )
)