'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

interface FavoriteItem {
  id: string
  title: string
  price: number
  originalPrice?: number
  thumb?: string
  store: string
  rating: number
  addedAt: string
  priceDropped?: number
}

const mockFavorites: FavoriteItem[] = [
  {
    id: '1',
    title: 'Hambúrguer Artesanal Premium',
    price: 29.90,
    originalPrice: 39.90,
    thumb: '🍔',
    store: 'Burguer House',
    rating: 4.8,
    addedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    priceDropped: 10,
  },
  {
    id: '2',
    title: 'Pizza Margherita Grande',
    price: 45.90,
    thumb: '🍕',
    store: 'Pizzaria Napoli',
    rating: 4.5,
    addedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '3',
    title: 'Açaí 700ml com granola',
    price: 32.90,
    originalPrice: 32.90,
    thumb: '🍨',
    store: 'Açaí Express',
    rating: 4.9,
    addedAt: new Date(Date.now() - 3600000).toISOString(),
  },
]

export function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(mockFavorites)
  const [sortBy, setSortBy] = useState<'recent' | 'price' | 'name'>('recent')

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price
      case 'name':
        return a.title.localeCompare(b.title)
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    }
  })

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(f => f.id !== id))
    toast.info('Removido dos favoritos')
  }

  const addToCart = (item: FavoriteItem) => {
    toast.success('Adicionado ao carrinho!', item.title)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)

    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Ontem'
    if (diffDays < 7) return `${diffDays} dias atrás`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }

  const getDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-brand-ink">
          ❤️ Meus favoritos ({favorites.length})
        </h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-1.5 bg-white border border-brand-line rounded-lg text-sm"
        >
          <option value="recent">Mais recentes</option>
          <option value="price">Menor preço</option>
          <option value="name">Nome</option>
        </select>
      </div>

      {/* Favorites list */}
      {sortedFavorites.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="text-5xl mb-3">💔</p>
          <p className="font-bold text-brand-ink">Nenhum favorito ainda</p>
          <p className="text-sm text-brand-muted mt-1 mb-4">
            Toque no ❤️ para adicionar produtos aos favoritos
          </p>
          <Link href="/user/stores">
            <Button>Explorar lojas</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedFavorites.map(item => (
            <Card key={item.id} padding="md" className="relative">
              {/* Price drop badge */}
              {item.priceDropped && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-2 py-1 rounded-bl-lg rounded-tr-lg text-xs font-bold">
                  💰 Preço caiu!
                </div>
              )}

              <div className="flex gap-3">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl bg-brand-soft flex items-center justify-center text-3xl flex-shrink-0">
                  {item.thumb}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-brand-ink line-clamp-2">{item.title}</p>
                  <p className="text-xs text-brand-muted mt-0.5">{item.store}</p>

                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm">⭐</span>
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-extrabold text-brand-red">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <>
                        <span className="text-sm text-brand-muted line-through">
                          R$ {item.originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                        <Badge variant="danger" className="text-xs">
                          -{getDiscount(item.originalPrice, item.price)}%
                        </Badge>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-brand-muted mt-1">
                    Adicionado {formatDate(item.addedAt)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <Button onClick={() => addToCart(item)} className="flex-1" size="sm">
                  🛒 Adicionar
                </Button>
                <button
                  onClick={() => removeFavorite(item.id)}
                  className="px-3 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  🗑️
                </button>
                <Link href={`/user/product/${item.id}`} className="px-3 py-2 border border-brand-line rounded-lg hover:bg-brand-soft transition-colors">
                  👁️
                </Link>
              </div>

              {/* Price drop info */}
              {item.priceDropped && (
                <div className="mt-3 p-2 bg-emerald-50 rounded-lg text-xs text-emerald-700">
                  📉 Este produto caiu R$ {item.priceDropped.toFixed(2).replace('.', ',')} desde que você favoritou!
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Share favorites */}
      {favorites.length > 0 && (
        <Card padding="md" className="bg-brand-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-brand-ink">Compartilhar favoritos</p>
              <p className="text-xs text-brand-muted">Mostre aos seus amigos o que você ama</p>
            </div>
            <Button variant="outline" size="sm">
              📤 Compartilhar lista
            </Button>
          </div>
        </Card>
      )}

      {/* Recommendations based on favorites */}
      {favorites.length > 0 && (
        <div>
          <h3 className="font-bold text-brand-ink mb-3">✨ Você também pode gostar</h3>
          <div className="grid grid-cols-2 gap-3">
            {['🍟 Batata Frita', '🥤 Refrigerante', '🍗 Frango Frito'].map((item, idx) => (
              <Link key={idx} href={`/user/product/${idx}`}>
                <Card padding="sm" className="hover-lift">
                  <div className="w-full aspect-square bg-brand-soft rounded-xl flex items-center justify-center text-4xl mb-2">
                    {item}
                  </div>
                  <p className="text-sm font-bold text-brand-ink">{item}</p>
                  <p className="text-sm text-brand-red font-extrabold">R$ {(Math.random() * 20 + 10).toFixed(2).replace('.', ',')}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Compact version for use in other components
export function FavoriteButton({ productId, className }: { productId: string; className?: string }) {
  const [isFavorite, setIsFavorite] = useState(false)

  const toggle = () => {
    setIsFavorite(!isFavorite)
    if (!isFavorite) {
      toast.success('Adicionado aos favoritos ❤️')
    } else {
      toast.info('Removido dos favoritos')
    }
  }

  return (
    <button
      onClick={toggle}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
        isFavorite ? 'bg-red-100 text-red-500' : 'bg-brand-soft text-brand-muted hover:text-red-500'
      } ${className}`}
    >
      {isFavorite ? '❤️' : '🤍'}
    </button>
  )
}