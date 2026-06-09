'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'

interface FeedItem {
  id: string
  type: 'order' | 'promo' | 'system'
  title: string
  description: string
  time: string
  read: boolean
  icon: string
  actionUrl?: string
}

const mockFeed: FeedItem[] = [
  {
    id: '1',
    type: 'order',
    title: 'Pedido confirmado! 🎉',
    description: 'Seu pedido #FE-2024-1234 foi confirmado pela Burguer House',
    time: 'agora',
    read: false,
    icon: '📦',
    actionUrl: '/user/orders/1234',
  },
  {
    id: '2',
    type: 'promo',
    title: '🎁 Novo cupom disponível',
    description: 'Você ganhou um cupom de 15% OFF! Use PRIMEIRACOMPRA',
    time: '1 hora',
    read: false,
    icon: '🎟️',
  },
  {
    id: '3',
    type: 'order',
    title: 'Seu pedido está pronto!',
    description: 'A Burguer House terminou de preparar seu pedido',
    time: '2 horas',
    read: true,
    icon: '✅',
    actionUrl: '/user/tracking/1234',
  },
  {
    id: '4',
    type: 'promo',
    title: '🔥 Oferta do dia',
    description: 'Frete grátis em todos os pedidos acima de R$ 40 hoje!',
    time: '3 horas',
    read: true,
    icon: '🚚',
  },
  {
    id: '5',
    type: 'system',
    title: 'Bem-vindo à Feirinha! 👋',
    description: 'Que bom ter você aqui! Explore as melhores lojas da região.',
    time: '1 dia',
    read: true,
    icon: '✨',
  },
]

export function ActivityFeed() {
  const [items, setItems] = useState<FeedItem[]>(mockFeed)
  const [filter, setFilter] = useState<'all' | 'orders' | 'promos'>('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  const filteredItems = items.filter(item => {
    if (showUnreadOnly && item.read) return false
    if (filter === 'orders' && item.type !== 'order') return false
    if (filter === 'promos' && item.type !== 'promo') return false
    return true
  })

  const markAsRead = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, read: true } : item
    ))
  }

  const markAllAsRead = () => {
    setItems(items.map(item => ({ ...item, read: true })))
  }

  const unreadCount = items.filter(i => !i.read).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-brand-ink">📬 Atividades</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-brand-muted">{unreadCount} não lidas</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-brand-red hover:underline"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-brand-red text-white' : 'bg-white border border-brand-line'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('orders')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'orders' ? 'bg-brand-red text-white' : 'bg-white border border-brand-line'
          }`}
        >
          📦 Pedidos
        </button>
        <button
          onClick={() => setFilter('promos')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'promos' ? 'bg-brand-red text-white' : 'bg-white border border-brand-line'
          }`}
        >
          🎁 Promoções
        </button>
      </div>

      {/* Unread toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showUnreadOnly}
          onChange={(e) => setShowUnreadOnly(e.target.checked)}
          className="w-4 h-4 accent-brand-red"
        />
        <span className="text-sm text-brand-muted">Mostrar apenas não lidas</span>
      </label>

      {/* Feed items */}
      {filteredItems.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-bold text-brand-ink">Nenhuma atividade</p>
          <p className="text-sm text-brand-muted">
            {showUnreadOnly ? 'Todas as notificações foram lidas!' : 'Sem atividades neste filtro'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredItems.map(item => (
            <Link
              key={item.id}
              href={item.actionUrl || '#'}
              onClick={() => markAsRead(item.id)}
              className={`block p-4 rounded-xl transition-all ${
                item.read
                  ? 'bg-white border border-brand-line'
                  : 'bg-red-50 border border-red-100'
              } hover:scale-[1.01]`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  item.read ? 'bg-brand-soft' : 'bg-red-100'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p className={`font-bold ${item.read ? 'text-brand-muted' : 'text-brand-ink'}`}>
                      {item.title}
                    </p>
                    {!item.read && (
                      <span className="w-2 h-2 bg-brand-red rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                  <p className="text-sm text-brand-muted mt-1">{item.description}</p>
                  <p className="text-xs text-brand-muted mt-2">{item.time}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Load more */}
      {filteredItems.length > 0 && (
        <button className="w-full py-3 text-center text-brand-red font-medium hover:underline">
          Ver mais atividades
        </button>
      )}
    </div>
  )
}