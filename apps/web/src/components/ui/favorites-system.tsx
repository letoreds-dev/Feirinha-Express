/**
 * Feirinha Express - Complete Favorites System
 * Save products and stores with categories
 */

'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

// ==================== TYPES ====================

interface FavoriteProduct {
  id: string
  name: string
  emoji: string
  price: number
  originalPrice?: number
  store: string
  storeEmoji: string
  addedAt: Date
  category: string
}

interface FavoriteStore {
  id: string
  name: string
  emoji: string
  rating: number
  deliveryTime: string
  category: string
  addedAt: Date
  favoriteItems: number
}

interface FavoriteContextType {
  products: FavoriteProduct[]
  stores: FavoriteStore[]
  addProduct: (product: Omit<FavoriteProduct, 'addedAt'>) => void
  removeProduct: (id: string) => void
  addStore: (store: Omit<FavoriteStore, 'addedAt'>) => void
  removeStore: (id: string) => void
  isProductFavorite: (id: string) => boolean
  isStoreFavorite: (id: string) => boolean
  totalFavorites: number
}

// ==================== CONTEXT ====================

const FavoritesContext = createContext<FavoriteContextType | null>(null)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<FavoriteProduct[]>([])
  const [stores, setStores] = useState<FavoriteStore[]>([])

  useEffect(() => {
    const savedProducts = localStorage.getItem('favoriteProducts')
    const savedStores = localStorage.getItem('favoriteStores')

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts))
      } catch {}
    }
    if (savedStores) {
      try {
        setStores(JSON.parse(savedStores))
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('favoriteProducts', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('favoriteStores', JSON.stringify(stores))
  }, [stores])

  const addProduct = (product: Omit<FavoriteProduct, 'addedAt'>) => {
    setProducts(prev => [{
      ...product,
      addedAt: new Date(),
    }, ...prev])
  }

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const addStore = (store: Omit<FavoriteStore, 'addedAt'>) => {
    setStores(prev => [{
      ...store,
      addedAt: new Date(),
    }, ...prev])
  }

  const removeStore = (id: string) => {
    setStores(prev => prev.filter(s => s.id !== id))
  }

  const isProductFavorite = (id: string) => products.some(p => p.id === id)
  const isStoreFavorite = (id: string) => stores.some(s => s.id === id)

  return (
    <FavoritesContext.Provider value={{
      products,
      stores,
      addProduct,
      removeProduct,
      addStore,
      removeStore,
      isProductFavorite,
      isStoreFavorite,
      totalFavorites: products.length + stores.length,
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

// ==================== HOOK ====================

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return context
}

// ==================== FAVORITE BUTTON ====================

interface FavoriteButtonProps {
  id: string
  type: 'product' | 'store'
  size?: 'sm' | 'md' | 'lg'
  onToggle?: (isFavorite: boolean) => void
}

export function FavoriteButton({ id, type, size = 'md', onToggle }: FavoriteButtonProps) {
  const { isProductFavorite, isStoreFavorite, addProduct, removeProduct, addStore, removeStore } = useFavorites()

  const isFavorite = type === 'product' ? isProductFavorite(id) : isStoreFavorite(id)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (type === 'product') {
      if (isFavorite) {
        removeProduct(id)
      } else {
        // Demo add
        addProduct({
          id,
          name: 'Produto Demo',
          emoji: '🍔',
          price: 29.90,
          store: 'Demo Store',
          storeEmoji: '🏪',
          category: 'Lanches',
        })
      }
    } else {
      if (isFavorite) {
        removeStore(id)
      } else {
        addStore({
          id,
          name: 'Loja Demo',
          emoji: '🏪',
          rating: 4.5,
          deliveryTime: '25-35 min',
          category: 'Lanches',
          favoriteItems: 0,
        })
      }
    }

    onToggle?.(!isFavorite)
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl',
  }

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all hover:scale-110 ${
        isFavorite ? 'bg-red-100 text-red-500' : 'bg-brand-soft text-brand-muted hover:text-red-500'
      }`}
    >
      {isFavorite ? '❤️' : '🤍'}
    </button>
  )
}

// ==================== PRODUCT FAVORITES ====================

interface ProductFavoritesListProps {
  maxItems?: number
}

export function ProductFavoritesList({ maxItems }: ProductFavoritesListProps) {
  const { products, removeProduct } = useFavorites()

  const displayProducts = maxItems ? products.slice(0, maxItems) : products

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / 86400000)

    if (days === 0) return 'Hoje'
    if (days === 1) return 'Ontem'
    if (days < 7) return `${days} dias atrás`
    return date.toLocaleDateString('pt-BR')
  }

  if (products.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-5xl mb-3">❤️</p>
        <p className="text-brand-muted">Nenhum produto favorito</p>
        <p className="text-sm text-brand-muted mt-1">
          Toque no ❤️ para adicionar aos favoritos
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {displayProducts.map(product => (
        <Card key={product.id} padding="sm" className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-brand-soft flex items-center justify-center text-3xl">
            {product.emoji}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bold text-brand-ink truncate">{product.name}</p>
            <p className="text-sm text-brand-muted">{product.storeEmoji} {product.store}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-brand-red">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-brand-muted line-through">
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => removeProduct(product.id)}
              className="text-brand-muted hover:text-red-500"
            >
              🗑️
            </button>
            <span className="text-xs text-brand-muted">
              {formatDate(new Date(product.addedAt))}
            </span>
          </div>
        </Card>
      ))}

      {maxItems && products.length > maxItems && (
        <Button variant="ghost" className="w-full">
          Ver todos ({products.length})
        </Button>
      )}
    </div>
  )
}

// ==================== STORE FAVORITES ====================

interface StoreFavoritesListProps {
  maxItems?: number
}

export function StoreFavoritesList({ maxItems }: StoreFavoritesListProps) {
  const { stores, removeStore } = useFavorites()

  const displayStores = maxItems ? stores.slice(0, maxItems) : stores

  if (stores.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-5xl mb-3">🏪</p>
        <p className="text-brand-muted">Nenhuma loja favorita</p>
        <p className="text-sm text-brand-muted mt-1">
          Salve suas lojas preferidas aqui
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {displayStores.map(store => (
        <Card key={store.id} padding="md" className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-brand-soft flex items-center justify-center text-3xl">
            {store.emoji}
          </div>

          <div className="flex-1">
            <p className="font-bold text-brand-ink">{store.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default" className="text-xs">{store.category}</Badge>
              <span className="text-sm text-brand-muted">⭐ {store.rating}</span>
              <span className="text-sm text-brand-muted">• {store.deliveryTime}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Button size="sm" variant="primary">
              Pedir
            </Button>
            <button
              onClick={() => removeStore(store.id)}
              className="text-brand-muted hover:text-red-500"
            >
              <span className="text-sm">Remover</span>
            </button>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ==================== FULL FAVORITES PAGE ====================

export function FavoritesPage() {
  const { products, stores, totalFavorites } = useFavorites()
  const [activeTab, setActiveTab] = useState<'products' | 'stores'>('products')

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-brand-ink">❤️ Meus Favoritos</h2>
        <Badge variant="info">{totalFavorites} itens</Badge>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'products'
              ? 'bg-brand-red text-white'
              : 'bg-brand-soft text-brand-ink'
          }`}
        >
          🍔 Produtos ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('stores')}
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'stores'
              ? 'bg-brand-red text-white'
              : 'bg-brand-soft text-brand-ink'
          }`}
        >
          🏪 Lojas ({stores.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'products' ? (
        <ProductFavoritesList />
      ) : (
        <StoreFavoritesList />
      )}
    </div>
  )
}

// ==================== QUICK FAVORITES WIDGET ====================

export function QuickFavoritesWidget() {
  const { products, isProductFavorite } = useFavorites()

  const quickProducts = products.slice(0, 4)

  if (quickProducts.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-ink">❤️ Quick Favorites</h3>
        <Button variant="ghost" size="sm">
          Ver todos
        </Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {quickProducts.map(product => (
          <div
            key={product.id}
            className="flex-shrink-0 w-32 p-3 bg-white rounded-xl shadow-sm"
          >
            <div className="text-3xl text-center mb-2">{product.emoji}</div>
            <p className="text-xs font-medium text-center truncate">{product.name}</p>
            <p className="text-sm font-bold text-center text-brand-red">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}