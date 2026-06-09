import api from './client'

export interface Store {
  id: string
  name: string
  slug: string
  logo: string
  type: string
  description?: string
  rating: number
  totalRatings: number
  time: string
  deliveryFee: number
  minOrderValue: number
  isOpen: boolean
  image?: string
}

export interface Product {
  id: string
  merchantId: string
  merchantName?: string
  title: string
  description: string
  price: number
  originalPrice?: number
  thumb?: string
  emoji?: string
  category: string
  tags: string[]
  active: boolean
  inStock: boolean
  stockQty: number
  rating: number
  reviews: number
  soldCount: number
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  color: string
}

// Stores
export async function getStores(): Promise<Store[]> {
  const { data } = await api.get('/api/stores')
  return data
}

export async function getStoreBySlug(slug: string): Promise<Store> {
  const { data } = await api.get(`/api/stores/${slug}`)
  return data
}

// Products
export async function getProducts(params?: {
  category?: string
  storeId?: string
  search?: string
}): Promise<Product[]> {
  const { data } = await api.get('/api/products', { params })
  return data
}

export async function getProductById(id: string): Promise<Product> {
  const { data } = await api.get(`/api/products/${id}`)
  return data
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await api.get('/api/products', { params: { featured: true } })
  return data
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get('/api/categories')
  return data
}

// Search
export async function searchProducts(query: string): Promise<Product[]> {
  const { data } = await api.get('/api/search', { params: { q: query } })
  return data
}