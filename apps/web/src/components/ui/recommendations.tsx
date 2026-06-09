'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { ProductCard } from '@/components/ui/product-card'

interface Recommendation {
  id: string
  type: 'popular' | 'similar' | 'frequent' | 'promotion' | 'new'
  reason: string
  icon: string
  products: {
    id: string
    title: string
    price: number
    originalPrice?: number
    thumb?: string
    rating?: number
  }[]
}

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    type: 'frequent',
    reason: 'Você costuma pedir isso',
    icon: '🔄',
    products: [
      { id: '1', title: 'Hambúrguer Especial', price: 29.90, thumb: '🍔', rating: 4.5 },
      { id: '2', title: 'Batata Frita', price: 15.90, thumb: '🍟', rating: 4.3 },
    ]
  },
  {
    id: '2',
    type: 'promotion',
    reason: 'Ofertas imperdíveis',
    icon: '🔥',
    products: [
      { id: '3', title: 'Pizza Média', price: 32.90, originalPrice: 45.90, thumb: '🍕', rating: 4.7 },
      { id: '4', title: 'Refrigerante 2L', price: 8.90, originalPrice: 12.90, thumb: '🥤', rating: 4.0 },
    ]
  },
  {
    id: '3',
    type: 'similar',
    reason: 'Baseado no que você viu',
    icon: '👀',
    products: [
      { id: '5', title: 'X-Burguer', price: 19.90, thumb: '🍔', rating: 4.2 },
      { id: '6', title: 'Onion Rings', price: 18.90, thumb: '🧅', rating: 4.4 },
    ]
  },
]

export function Recommendations() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const visibleRecommendations = mockRecommendations.filter(r => !dismissed.has(r.id))

  if (visibleRecommendations.length === 0) {
    return (
      <Card padding="lg" className="text-center">
        <p className="text-4xl mb-2">✨</p>
        <p className="font-bold text-brand-ink">Todas as recomendações vistas</p>
        <p className="text-sm text-brand-muted mt-1">
          Continue navegando para ver mais
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {visibleRecommendations.map(rec => (
        <div key={rec.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{rec.icon}</span>
              <h3 className="font-bold text-brand-ink">{rec.reason}</h3>
            </div>
            <button
              onClick={() => setDismissed(dismissed => new Set([...dismissed, rec.id]))}
              className="text-xs text-brand-muted hover:text-brand-ink"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {rec.products.map(product => (
              <Link key={product.id} href={`/user/product/${product.id}`}>
                <Card padding="sm" className="hover-lift">
                  <div className="w-full aspect-square bg-brand-soft rounded-xl flex items-center justify-center text-4xl mb-2">
                    {product.thumb}
                  </div>
                  <p className="text-sm font-bold text-brand-ink line-clamp-2 min-h-[2.5rem]">
                    {product.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm">⭐</span>
                    <span className="text-xs text-brand-muted">{product.rating}</span>
                  </div>
                  <div className="mt-1">
                    {product.originalPrice && (
                      <span className="text-xs text-brand-muted line-through">
                        R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    <span className="text-lg font-extrabold text-brand-red ml-1">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <button className="w-full mt-2 py-2 bg-brand-red text-white text-sm rounded-lg font-bold hover:bg-brand-red-dark transition-colors">
                    🛒 Adicionar
                  </button>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Horizontal scroll version
export function RecommendationsHorizontal() {
  const allProducts = mockRecommendations.flatMap(r => r.products)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-ink">✨ Recomendados para você</h3>
        <Link href="/user/recommendations" className="text-xs text-brand-red hover:underline">
          Ver mais →
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {allProducts.map(product => (
          <Link key={product.id} href={`/user/product/${product.id}`} className="flex-shrink-0 w-36">
            <Card padding="sm" className="hover-lift">
              <div className="w-28 h-28 rounded-xl bg-brand-soft flex items-center justify-center text-4xl mb-2">
                {product.thumb}
              </div>
              <p className="text-sm font-bold text-brand-ink line-clamp-2">{product.title}</p>
              <span className="text-sm font-extrabold text-brand-red">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}