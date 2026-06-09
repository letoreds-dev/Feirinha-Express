'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

interface Store {
  id: string
  name: string
  category: string
  rating: number
  reviews: number
  distance: string
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  isOpen: boolean
  isFeatured: boolean
  image?: string
  emoji: string
}

interface SearchFilters {
  category: string[]
  rating: number
  deliveryFee: number
  distance: number
  deliveryTime: number
  sortBy: 'distance' | 'rating' | 'delivery' | 'time'
  openNow: boolean
}

export function StoreDiscovery() {
  const [stores, setStores] = useState<Store[]>([
    { id: '1', name: 'Burguer House', category: 'Hambúrgueres', rating: 4.8, reviews: 234, distance: '1.2km', deliveryTime: '25-35 min', deliveryFee: 5.90, minOrder: 25, isOpen: true, isFeatured: true, emoji: '🍔' },
    { id: '2', name: 'Pizza Express', category: 'Pizza', rating: 4.7, reviews: 189, distance: '0.8km', deliveryTime: '30-40 min', deliveryFee: 6.90, minOrder: 30, isOpen: true, isFeatured: true, emoji: '🍕' },
    { id: '3', name: 'Açaí House', category: 'Açaí', rating: 4.9, reviews: 312, distance: '1.5km', deliveryTime: '20-30 min', deliveryFee: 4.90, minOrder: 20, isOpen: true, isFeatured: false, emoji: '🍨' },
    { id: '4', name: 'Sushi Express', category: 'Japonês', rating: 4.6, reviews: 156, distance: '2.1km', deliveryTime: '35-45 min', deliveryFee: 7.90, minOrder: 40, isOpen: true, isFeatured: false, emoji: '🍣' },
    { id: '5', name: 'Padaria São José', category: 'Padaria', rating: 4.5, reviews: 98, distance: '0.5km', deliveryTime: '15-25 min', deliveryFee: 3.90, minOrder: 15, isOpen: true, isFeatured: false, emoji: '🥐' },
    { id: '6', name: 'McDonald\'s', category: 'Fast Food', rating: 4.2, reviews: 567, distance: '1.8km', deliveryTime: '20-30 min', deliveryFee: 5.90, minOrder: 20, isOpen: true, isFeatured: false, emoji: '🍟' },
    { id: '7', name: 'Esfiha & CIA', category: 'Árabe', rating: 4.4, reviews: 145, distance: '2.5km', deliveryTime: '30-40 min', deliveryFee: 6.90, minOrder: 25, isOpen: false, isFeatured: false, emoji: '🥙' },
    { id: '8', name: 'Café do Centro', category: 'Café', rating: 4.3, reviews: 78, distance: '0.9km', deliveryTime: '15-20 min', deliveryFee: 3.90, minOrder: 15, isOpen: true, isFeatured: false, emoji: '☕' },
  ])

  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    rating: 0,
    deliveryFee: 10,
    distance: 5,
    deliveryTime: 60,
    sortBy: 'distance',
    openNow: false,
  })

  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { id: 'burger', name: 'Hambúrgueres', emoji: '🍔' },
    { id: 'pizza', name: 'Pizza', emoji: '🍕' },
    { id: 'acai', name: 'Açaí', emoji: '🍨' },
    { id: 'sushi', name: 'Japonês', emoji: '🍣' },
    { id: 'cafe', name: 'Café', emoji: '☕' },
    { id: 'arabic', name: 'Árabe', emoji: '🥙' },
    { id: 'padaria', name: 'Padaria', emoji: '🥐' },
    { id: 'fastfood', name: 'Fast Food', emoji: '🍟' },
  ]

  const filteredStores = stores.filter(store => {
    if (filters.openNow && !store.isOpen) return false
    if (filters.rating > 0 && store.rating < filters.rating) return false
    if (store.deliveryFee > filters.deliveryFee) return false
    if (filters.category.length > 0 && !filters.category.includes(store.category)) return false
    return true
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance)
      case 'rating':
        return b.rating - a.rating
      case 'delivery':
        return a.deliveryFee - b.deliveryFee
      case 'time':
        return parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
      default:
        return 0
    }
  })

  const featuredStores = stores.filter(s => s.isFeatured)

  return (
    <div className="space-y-6">
      {/* Featured */}
      {filters.category.length === 0 && (
        <div>
          <h3 className="font-bold text-brand-ink mb-3">⭐ Lojas em Destaque</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {featuredStores.map(store => (
              <a
                key={store.id}
                href={`/user/stores/${store.id}`}
                className="flex-shrink-0 w-40 p-3 bg-gradient-to-br from-brand-red to-red-600 rounded-2xl text-white"
              >
                <div className="text-4xl mb-2">{store.emoji}</div>
                <p className="font-bold text-sm truncate">{store.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span>⭐ {store.rating}</span>
                  <span className="text-xs text-white text-opacity-70">{store.reviews} avaliações</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {filters.category.length === 0 && (
        <div>
          <h3 className="font-bold text-brand-ink mb-3">🏷️ Categorias</h3>
          <div className="grid grid-cols-4 gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setFilters(prev => ({
                  ...prev,
                  category: prev.category.includes(category.name) ? [] : [category.name]
                }))}
                className="p-3 bg-brand-soft rounded-xl text-center hover:bg-brand-line transition-colors"
              >
                <span className="text-2xl block mb-1">{category.emoji}</span>
                <span className="text-xs font-medium text-brand-ink">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-ink">
          🏪 Lojas
          <span className="text-brand-muted font-normal ml-2">
            ({filteredStores.length} encontradas)
          </span>
        </h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-soft rounded-full text-sm font-medium"
        >
          🔍 Filtros
          {filters.openNow && <Badge variant="success" className="text-xs">Aberto</Badge>}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <Card padding="md" className="animate-fade-up">
          <div className="space-y-4">
            {/* Sort by */}
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">Ordenar por</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'distance', label: 'Distância' },
                  { key: 'rating', label: 'Avaliação' },
                  { key: 'delivery', label: 'Frete' },
                  { key: 'time', label: 'Tempo' },
                ].map(option => (
                  <button
                    key={option.key}
                    onClick={() => setFilters(prev => ({ ...prev, sortBy: option.key as any }))}
                    className={`px-4 py-2 rounded-full text-sm ${
                      filters.sortBy === option.key
                        ? 'bg-brand-red text-white'
                        : 'bg-brand-soft text-brand-ink'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Open now */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-brand-ink">Abrir agora</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.openNow}
                  onChange={(e) => setFilters(prev => ({ ...prev, openNow: e.target.checked }))}
                  className="sr-only"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-brand-red transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
              </div>
            </label>

            {/* Rating filter */}
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">
                Avaliação mínima: {filters.rating > 0 ? `${filters.rating} ⭐` : 'Qualquer'}
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.rating}
                onChange={(e) => setFilters(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Delivery fee */}
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">
                Frete máximo: R$ {filters.deliveryFee.toFixed(2).replace('.', ',')}
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={filters.deliveryFee}
                onChange={(e) => setFilters(prev => ({ ...prev, deliveryFee: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Store list */}
      <div className="space-y-3">
        {filteredStores.map(store => (
          <Card key={store.id} padding="md" className="hover:shadow-md transition-shadow">
            <a href={`/user/stores/${store.id}`} className="block">
              <div className="flex gap-4">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl ${
                  store.isOpen ? 'bg-brand-red text-white' : 'bg-gray-300'
                }`}>
                  {store.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-brand-ink">{store.name}</p>
                      <p className="text-sm text-brand-muted">{store.category}</p>
                    </div>
                    {!store.isOpen && (
                      <Badge variant="error">Fechado</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      ⭐ {store.rating}
                      <span className="text-brand-muted">({store.reviews})</span>
                    </span>
                    <span className="text-brand-muted">📍 {store.distance}</span>
                    <span className="text-brand-muted">🛵 {store.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className={store.deliveryFee === 0 ? 'text-emerald-600 font-medium' : 'text-brand-muted'}>
                      🚚 Frete {store.deliveryFee === 0 ? 'Grátis!' : `R$ ${store.deliveryFee.toFixed(2).replace('.', ',')}`}
                    </span>
                    <span className="text-brand-muted">
                      Pedido mínimo: R$ {store.minOrder.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </Card>
        ))}
      </div>

      {filteredStores.length === 0 && (
        <Card padding="lg" className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-brand-muted">Nenhuma loja encontrada com os filtros atuais</p>
          <Button onClick={() => setFilters({
            category: [],
            rating: 0,
            deliveryFee: 10,
            distance: 5,
            deliveryTime: 60,
            sortBy: 'distance',
            openNow: false,
          })} className="mt-4">
            Limpar filtros
          </Button>
        </Card>
      )}
    </div>
  )
}

// ==================== NEARBY STORES MAP ====================

export function NearbyStoresMap() {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="h-64 bg-gradient-to-br from-brand-soft to-brand-line relative">
        {/* Map placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-2">🗺️</p>
            <p className="text-brand-muted">Mapa de lojas próximas</p>
            <p className="text-sm text-brand-muted">Integrar com Google Maps</p>
          </div>
        </div>

        {/* Your location */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full animate-pulse">
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
        </div>

        {/* Store pins */}
        {[
          { top: '30%', left: '40%', emoji: '🍔' },
          { top: '60%', left: '70%', emoji: '🍕' },
          { top: '25%', left: '75%', emoji: '🍨' },
          { top: '70%', left: '30%', emoji: '🍣' },
        ].map((pin, idx) => (
          <a
            key={idx}
            href="#"
            className="absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
            style={{ top: pin.top, left: pin.left }}
          >
            {pin.emoji}
          </a>
        ))}
      </div>
      <div className="p-4">
        <p className="text-sm text-brand-muted">📍 Sua localização atual</p>
      </div>
    </Card>
  )
}
