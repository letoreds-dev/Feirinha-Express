'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'

interface Store {
  id: string
  name: string
  logo?: string
  type: string
  rating: number
  reviewCount: number
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  isOpen: boolean
  distance: string
  address: string
}

interface StoreLocatorProps {
  stores?: Store[]
}

const mockStores: Store[] = [
  {
    id: '1',
    name: 'Burguer House',
    type: 'Lanches',
    rating: 4.8,
    reviewCount: 342,
    deliveryTime: '25-35 min',
    deliveryFee: 5.90,
    minOrder: 25,
    isOpen: true,
    distance: '1.2 km',
    address: 'Rua das Flores, 123 - Centro'
  },
  {
    id: '2',
    name: 'Pizzaria Napoli',
    type: 'Pizza',
    rating: 4.5,
    reviewCount: 189,
    deliveryTime: '35-45 min',
    deliveryFee: 7.90,
    minOrder: 40,
    isOpen: true,
    distance: '2.1 km',
    address: 'Av. Brasil, 456 - Jardins'
  },
  {
    id: '3',
    name: 'Açaí Express',
    type: 'Açaí',
    rating: 4.9,
    reviewCount: 567,
    deliveryTime: '20-30 min',
    deliveryFee: 4.90,
    minOrder: 20,
    isOpen: false,
    distance: '0.8 km',
    address: 'Rua do Açaí, 789 - Palmeiras'
  },
  {
    id: '4',
    name: 'Sushi House',
    type: 'Japonês',
    rating: 4.7,
    reviewCount: 234,
    deliveryTime: '40-50 min',
    deliveryFee: 8.90,
    minOrder: 50,
    isOpen: true,
    distance: '3.0 km',
    address: 'Av. Paulista, 1000 - Bela Vista'
  },
]

export function StoreLocator({ stores = mockStores }: StoreLocatorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'delivery'>('distance')
  const [showMap, setShowMap] = useState(false)

  const storeTypes = [...new Set(stores.map(s => s.type))]

  const filteredStores = stores
    .filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.type.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = !selectedType || store.type === selectedType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating
        case 'delivery': return a.deliveryFee - b.deliveryFee
        default: return parseFloat(a.distance) - parseFloat(b.distance)
      }
    })

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar loja ou tipo..."
          className="w-full pl-10 pr-4 py-3 border border-brand-line rounded-xl text-sm focus:outline-none focus:border-brand-red"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted">🔍</span>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedType(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
            !selectedType
              ? 'bg-brand-red text-white'
              : 'bg-white border border-brand-line text-brand-ink'
          }`}
        >
          Todas
        </button>
        {storeTypes.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type === selectedType ? null : type)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              selectedType === type
                ? 'bg-brand-red text-white'
                : 'bg-white border border-brand-line text-brand-ink'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Sort options */}
      <div className="flex gap-2">
        {([
          { key: 'distance', label: '📍 Mais perto' },
          { key: 'rating', label: '⭐ Melhor avaliada' },
          { key: 'delivery', label: '🚗 Frete menor' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              sortBy === key
                ? 'bg-brand-red text-white'
                : 'bg-brand-soft text-brand-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Map toggle */}
      <button
        onClick={() => setShowMap(!showMap)}
        className="w-full py-2 text-sm text-brand-red border border-brand-red rounded-xl hover:bg-red-50 transition-colors"
      >
        {showMap ? '📋 Ver lista' : '🗺️ Ver no mapa'}
      </button>

      {/* Map placeholder */}
      {showMap && (
        <div className="h-48 bg-brand-soft rounded-xl flex items-center justify-center border-2 border-dashed border-brand-line">
          <div className="text-center">
            <p className="text-4xl mb-2">🗺️</p>
            <p className="text-sm text-brand-muted">Mapa interativo</p>
            <p className="text-xs text-brand-muted">Em breve...</p>
          </div>
        </div>
      )}

      {/* Store list */}
      <div className="space-y-3">
        {filteredStores.map(store => (
          <Card key={store.id} padding="md" className="hover-lift">
            <div className="flex gap-3">
              {/* Logo */}
              <div className="w-16 h-16 rounded-xl bg-brand-soft flex items-center justify-center text-2xl font-extrabold text-brand-red flex-shrink-0">
                {store.logo || store.name.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-brand-ink">{store.name}</h3>
                    <p className="text-xs text-brand-muted">{store.type}</p>
                  </div>
                  {!store.isOpen && (
                    <Badge variant="danger" className="text-xs">Fechada</Badge>
                  )}
                  {store.isOpen && (
                    <Badge variant="success" className="text-xs">Aberta</Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 mt-2 text-xs text-brand-muted">
                  <span>⭐ {store.rating}</span>
                  <span>({store.reviewCount})</span>
                  <span>•</span>
                  <span>📍 {store.distance}</span>
                </div>

                {/* Delivery info */}
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span className="text-brand-ink">
                    🚴 {store.deliveryTime}
                  </span>
                  <span className={store.deliveryFee === 0 ? 'text-emerald-600 font-bold' : 'text-brand-muted'}>
                    {store.deliveryFee === 0 ? 'Frete grátis' : `R$ ${store.deliveryFee.toFixed(2).replace('.', ',')}`}
                  </span>
                  <span className="text-brand-muted">
                    Mín: R$ {store.minOrder}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-brand-line">
              <button className="flex-1 py-2 text-sm text-brand-red border border-brand-red rounded-lg hover:bg-red-50 transition-colors">
                Ver cardápio
              </button>
              <button className="flex-1 py-2 text-sm text-brand-ink border border-brand-line rounded-lg hover:bg-brand-soft transition-colors">
                Informações
              </button>
            </div>
          </Card>
        ))}
      </div>

      {filteredStores.length === 0 && (
        <Card padding="lg" className="text-center">
          <p className="text-4xl mb-2">🔍</p>
          <p className="font-bold text-brand-ink">Nenhuma loja encontrada</p>
          <p className="text-sm text-brand-muted mt-1">
            Tente buscar por outro termo ou tipo de loja
          </p>
        </Card>
      )}
    </div>
  )
}