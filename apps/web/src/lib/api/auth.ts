import api from './client'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  type: 'customer' | 'merchant'
  merchant?: {
    id: string
    storeName: string
    storeType: string
    status: string
  }
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  phone?: string
}

// Auth
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post('/api/auth/login', payload)
  return data
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post('/api/auth/register', payload)
  return data
}

export async function getMe(): Promise<User> {
  const { data } = await api.get('/api/auth/me')
  return data
}

export async function updateProfile(updates: Partial<User>): Promise<User> {
  const { data } = await api.patch('/api/auth/me', updates)
  return data
}

// Merchant
export async function registerAsMerchant(payload: {
  storeName: string
  storeType: string
  description?: string
}): Promise<User> {
  const { data } = await api.post('/api/auth/merchant/register', payload)
  return data
}