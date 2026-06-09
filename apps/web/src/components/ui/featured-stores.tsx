'use client'

import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

interface FeaturedStore {
  id: string
  name: string
  thumb: string
  rating: number
  deliveryTime: string
  category: string
  hasDiscount: boolean
  discount?: string
}

const featuredStores: FeaturedStore[] = [
  { id: '1', name: 'Burguer House', thumb: '🍔', rating: 4.8, deliveryTime: '25-35 min', category: 'Lanches', hasDiscount: true, discount: '20% OFF' },
  { id: '2', name: 'Pizzaria Napoli', thumb: '🍕', rating: 4.6, deliveryTime: '30-40 min', category: 'Pizza', hasDiscount: false },
  { id: '3', name: 'Açaí Express', thumb: '🍨', rating: 4.9, deliveryTime: '20-30 min', category: 'Açaí', hasDiscount: true, discount: 'Frete grátis' },
  { id: '4', name: 'Sushi House', thumb: '🍣', rating: 4.7, deliveryTime: '35-45 min', category: 'Japonês', hasDiscount: false },
]

export function FeaturedStores() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-brand-ink">🔥 Em destaque</h3>
          <p className="text-xs text-brand-muted">As melhores lojas da região</p>
        </div>
        <Link href="/user/stores" className="text-sm text-brand-red hover:underline">
          Ver todos →
        </Link>
      </div>

      {/* Store cards */}
      <div className="space-y-3">
        {featuredStores.map(store => (
          <Link key={store.id} href={`/user/merchant/${store.id}`}>
            <Card padding="md" className="hover-lift">
              <div className="flex items-center gap-4">
                {/* Logo */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center text-3xl">
                    {store.thumb}
                  </div>
                  {store.hasDiscount && (
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                      🎉
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-brand-ink truncate">{store.name}</h4>
                    {store.hasDiscount && (
                      <Badge variant="success" className="text-xs flex-shrink-0">
                        {store.discount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-brand-muted">{store.category}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-medium">{store.rating}</span>
                    </span>
                    <span className="text-brand-muted">•</span>
                    <span className="text-xs text-brand-muted">{store.deliveryTime}</span>
                  </div>
                </div>

                {/* Arrow */}
                <span className="text-brand-muted">→</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Button variant="outline" className="w-full">
        Ver mais lojas →
      </Button>
    </div>
  )
}

// Compact version for horizontal scroll
export function FeaturedStoresCompact() {
  return (
    <div className="space-y-3">
      <h3 className="font-bold text-brand-ink">🔥 Em destaque</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {featuredStores.map(store => (
          <Link key={store.id} href={`/user/merchant/${store.id}`} className="flex-shrink-0 w-40">
            <Card padding="sm" className="hover-lift">
              <div className="w-full h-24 rounded-xl bg-brand-soft flex items-center justify-center text-5xl mb-2">
                {store.thumb}
              </div>
              <p className="font-bold text-brand-ink text-sm truncate">{store.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs">⭐ {store.rating}</span>
                <span className="text-xs text-brand-muted ml-auto">{store.deliveryTime}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}