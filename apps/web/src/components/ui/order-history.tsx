'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Star } from '@/components/ui/star-rating'

interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  createdAt: string
  items: {
    id: string
    title: string
    quantity: number
    price: number
    thumb?: string
  }[]
  store: {
    id: string
    name: string
    logo?: string
  }
  total: number
  deliveryFee: number
  paymentMethod: 'pix' | 'credit' | 'debit'
  rating?: number
  review?: string
}

interface OrderHistoryProps {
  orders?: Order[]
  isLoading?: boolean
}

const statusLabels: Record<Order['status'], { label: string; color: string }> = {
  pending: { label: 'Aguardando', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800' },
  preparing: { label: 'Preparando', color: 'bg-orange-100 text-orange-800' },
  ready: { label: 'Pronto', color: 'bg-green-100 text-green-800' },
  delivered: { label: 'Entregue', color: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
}

const paymentIcons: Record<string, string> = {
  pix: '💠',
  credit: '💳',
  debit: '💳',
}

function OrderCard({ order, onRate }: { order: Order; onRate?: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const status = statusLabels[order.status]
  const date = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  const formattedTotal = order.total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <Card padding="md" className="hover-lift">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-brand-ink">#{order.orderNumber}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-xs text-brand-muted">{date}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-brand-ink">{formattedTotal}</p>
          <p className="text-xs text-brand-muted flex items-center justify-end gap-1">
            {paymentIcons[order.paymentMethod]} {order.paymentMethod.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Store */}
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-brand-line">
        <div className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center text-sm font-bold text-brand-red">
          {order.store.logo || order.store.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-brand-ink">{order.store.name}</p>
          <p className="text-xs text-brand-muted">{order.items.length} item(s)</p>
        </div>
      </div>

      {/* Items preview */}
      <div className="space-y-2 mb-3">
        {order.items.slice(0, expanded ? undefined : 2).map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-soft flex items-center justify-center text-xs font-bold text-brand-red">
              {item.thumb || '📦'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-ink truncate">{item.title}</p>
              <p className="text-xs text-brand-muted">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-brand-ink">
              R$ {item.price.toFixed(2).replace('.', ',')}
            </p>
          </div>
        ))}
        {order.items.length > 2 && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-brand-red hover:underline"
          >
            + {order.items.length - 2} mais items
          </button>
        )}
      </div>

      {/* Rating section */}
      {order.status === 'delivered' && (
        <div className="pt-3 border-t border-brand-line">
          {order.rating ? (
            <div className="flex items-center gap-2">
              <Star rating={order.rating} size="sm" />
              <span className="text-xs text-brand-muted">Sua avaliação</span>
            </div>
          ) : (
            <button
              onClick={() => onRate?.(order.id)}
              className="w-full py-2 text-sm text-brand-red font-medium hover:bg-red-50 rounded-lg transition-colors"
            >
              ⭐ Avaliar pedido
            </button>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <button className="flex-1 py-2 text-sm text-brand-red border border-brand-red rounded-lg hover:bg-red-50 transition-colors">
          Ver detalhes
        </button>
        <button className="flex-1 py-2 text-sm text-brand-ink border border-brand-line rounded-lg hover:bg-brand-soft transition-colors">
          Comprar novamente
        </button>
      </div>
    </Card>
  )
}

// Mock data for demo
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '2024-001',
    status: 'delivered',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      { id: 'i1', title: 'Hambúrguer Artesanal', quantity: 2, price: 28.90, thumb: '🍔' },
      { id: 'i2', title: 'Batata Frita', quantity: 1, price: 15.90, thumb: '🍟' },
      { id: 'i3', title: 'Refrigerante 600ml', quantity: 2, price: 6.90, thumb: '🥤' },
    ],
    store: { id: 's1', name: 'Burguer House', logo: 'B' },
    total: 94.40,
    deliveryFee: 9.90,
    paymentMethod: 'pix',
    rating: 5,
  },
  {
    id: '2',
    orderNumber: '2024-002',
    status: 'preparing',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    items: [
      { id: 'i4', title: 'Pizza Margherita', quantity: 1, price: 45.90, thumb: '🍕' },
      { id: 'i5', title: 'Coca-Cola 2L', quantity: 1, price: 12.90, thumb: '🥤' },
    ],
    store: { id: 's2', name: 'Pizzaria Italia', logo: 'P' },
    total: 68.70,
    deliveryFee: 9.90,
    paymentMethod: 'credit',
  },
  {
    id: '3',
    orderNumber: '2024-003',
    status: 'pending',
    createdAt: new Date().toISOString(),
    items: [
      { id: 'i6', title: 'Açaí 500ml', quantity: 1, price: 22.90, thumb: '🍨' },
    ],
    store: { id: 's3', name: 'Açaí Express', logo: 'A' },
    total: 32.80,
    deliveryFee: 9.90,
    paymentMethod: 'pix',
  },
]

export function OrderHistory({ orders = mockOrders, isLoading = false }: OrderHistoryProps) {
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all')
  const [showRatingModal, setShowRatingModal] = useState<string | null>(null)

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter)

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-white rounded-xl border border-brand-line animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Status filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
            filter === 'all'
              ? 'bg-brand-red text-white'
              : 'bg-white border border-brand-line text-brand-ink hover:border-brand-red'
          }`}
        >
          Todos ({orders.length})
        </button>
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilter(status as Order['status'])}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              filter === status
                ? 'bg-brand-red text-white'
                : 'bg-white border border-brand-line text-brand-ink hover:border-brand-red'
            }`}
          >
            {statusLabels[status as Order['status']].label} ({count})
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <Card padding="md" className="text-center py-8">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-bold text-brand-ink">Nenhum pedido encontrado</p>
          <p className="text-sm text-brand-muted mt-1">
            {filter === 'all'
              ? 'Você ainda não fez nenhum pedido'
              : `Nenhum pedido com status "${statusLabels[filter as Order['status']].label}"`
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onRate={(id) => setShowRatingModal(id)}
            />
          ))}
        </div>
      )}

      {/* Rating modal placeholder */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card padding="lg" className="w-full max-w-sm">
            <h3 className="text-lg font-bold text-brand-ink mb-4 text-center">
              Avalie seu pedido
            </h3>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(stars => (
                <button
                  key={stars}
                  className="text-4xl hover:scale-110 transition-transform"
                >
                  ☆
                </button>
              ))}
            </div>
            <textarea
              className="w-full p-3 border border-brand-line rounded-xl text-sm resize-none"
              rows={3}
              placeholder="Deixe um comentário (opcional)"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowRatingModal(null)}
                className="flex-1 py-2 text-sm text-brand-muted border border-brand-line rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowRatingModal(null)}
                className="flex-1 py-2 text-sm text-white bg-brand-red rounded-lg font-bold"
              >
                Enviar
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}