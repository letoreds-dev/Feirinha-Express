'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'

interface RecentlyViewedItem {
  id: string
  title: string
  price: number
  thumb?: string
  store: string
  viewedAt: string
  link: string
}

const mockItems: RecentlyViewedItem[] = [
  { id: '1', title: 'Hambúrguer Artesanal', price: 32.90, thumb: '🍔', store: 'Burguer House', viewedAt: new Date(Date.now() - 3600000).toISOString(), link: '/user/product/1' },
  { id: '2', title: 'Pizza Margherita', price: 45.90, thumb: '🍕', store: 'Pizzaria Napoli', viewedAt: new Date(Date.now() - 7200000).toISOString(), link: '/user/product/2' },
  { id: '3', title: 'Açaí 500ml', price: 22.90, thumb: '🍨', store: 'Açaí Express', viewedAt: new Date(Date.now() - 86400000).toISOString(), link: '/user/product/3' },
  { id: '4', title: 'Sushi Combo', price: 59.90, thumb: '🍣', store: 'Sushi House', viewedAt: new Date(Date.now() - 172800000).toISOString(), link: '/user/product/4' },
]

export function RecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setItems(mockItems)
      setIsLoading(false)
    }, 500)
  }, [])

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffHours < 1) return 'Agora'
    if (diffHours < 24) return `${diffHours}h atrás`
    if (diffDays === 1) return 'Ontem'
    if (diffDays < 7) return `${diffDays} dias atrás`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }

  const clearHistory = () => {
    setItems([])
    localStorage.removeItem('feirinha-recently-viewed')
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-white rounded-xl border border-brand-line animate-pulse" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <Card padding="lg" className="text-center">
        <p className="text-4xl mb-2">👀</p>
        <p className="font-bold text-brand-ink">Nenhum produto visto recentemente</p>
        <p className="text-sm text-brand-muted mt-1">
          Products you view will appear here
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-ink">👀 Vistos recentemente</h3>
        <button onClick={clearHistory} className="text-xs text-brand-red hover:underline">
          Limpar histórico
        </button>
      </div>

      {/* Items list */}
      <div className="space-y-2">
        {items.map(item => (
          <Link key={item.id} href={item.link}>
            <Card padding="sm" className="hover-lift">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-brand-soft flex items-center justify-center text-2xl flex-shrink-0">
                  {item.thumb}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-brand-ink text-sm truncate">{item.title}</p>
                  <p className="text-xs text-brand-muted">{item.store}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-brand-red">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-brand-muted">•</span>
                    <span className="text-xs text-brand-muted">{formatTime(item.viewedAt)}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-brand-muted">→</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* View all */}
      <Link href="/user/history" className="block">
        <button className="w-full py-3 text-sm text-brand-red border border-brand-red rounded-xl hover:bg-red-50 transition-colors">
          Ver histórico completo →
        </button>
      </Link>
    </div>
  )
}

// Horizontal scroll version
export function RecentlyViewedHorizontal() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([])

  useEffect(() => {
    setItems(mockItems.slice(0, 4))
  }, [])

  if (items.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-brand-ink">👀 Vistos recentemente</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {items.map(item => (
          <Link key={item.id} href={item.link} className="flex-shrink-0 w-36">
            <Card padding="sm" className="hover-lift">
              <div className="w-28 h-28 rounded-xl bg-brand-soft flex items-center justify-center text-4xl mb-2">
                {item.thumb}
              </div>
              <p className="text-sm font-bold text-brand-ink truncate">{item.title}</p>
              <p className="text-sm font-bold text-brand-red">
                R$ {item.price.toFixed(2).replace('.', ',')}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}