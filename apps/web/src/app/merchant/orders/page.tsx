'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, Button, Badge, NavBar, BottomNav } from '@/components/ui'
import { toast } from '@/components/ui/toast'
import { formatCurrency } from '@/lib/utils'

type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

interface MerchantOrder {
  id: string
  orderNumber: string
  customerName: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: OrderStatus
  time: string
  paymentMethod: 'pix' | 'credit' | 'debit'
}

// Mock data
const mockOrders: MerchantOrder[] = [
  {
    id: '1',
    orderNumber: '#1042',
    customerName: 'Maria S.',
    items: [
      { name: 'Camisa Brasil retrô', quantity: 1, price: 129.90 },
      { name: 'Boné Corinthians', quantity: 2, price: 59.90 },
    ],
    total: 249.70,
    status: 'new',
    time: 'agora',
    paymentMethod: 'pix',
  },
  {
    id: '2',
    orderNumber: '#1041',
    customerName: 'João O.',
    items: [
      { name: 'Capinha iPhone', quantity: 1, price: 49.90 },
      { name: 'Carregador Turbo', quantity: 1, price: 69.90 },
    ],
    total: 119.80,
    status: 'preparing',
    time: '3 min',
    paymentMethod: 'credit',
  },
  {
    id: '3',
    orderNumber: '#1040',
    customerName: 'Ana C.',
    items: [
      { name: 'Mouse sem fio', quantity: 1, price: 54.90 },
      { name: 'Teclado RGB', quantity: 1, price: 129.90 },
    ],
    total: 184.80,
    status: 'ready',
    time: '8 min',
    paymentMethod: 'pix',
  },
  {
    id: '4',
    orderNumber: '#1039',
    customerName: 'Pedro L.',
    items: [
      { name: 'Jogo FC 25', quantity: 1, price: 249.90 },
    ],
    total: 249.90,
    status: 'delivered',
    time: '15 min',
    paymentMethod: 'debit',
  },
]

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  new: { label: '🆕 Novo', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  preparing: { label: '👨‍🍳 Preparando', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  ready: { label: '✅ Pronto', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  delivered: { label: '🎉 Entregue', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  cancelled: { label: '❌ Cancelado', color: 'text-red-700', bgColor: 'bg-red-100' },
}

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter)

  const newOrdersCount = orders.filter(o => o.status === 'new').length

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    ))
    toast.success('Status atualizado', statusConfig[newStatus].label)
  }

  const handleAccept = (orderId: string) => {
    updateStatus(orderId, 'preparing')
  }

  const handleReady = (orderId: string) => {
    updateStatus(orderId, 'ready')
  }

  return (
    <div className="min-h-screen bg-brand-paper pb-24">
      <NavBar>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Link href="/merchant" className="text-brand-muted hover:text-brand-ink">
              ←
            </Link>
            <h1 className="text-lg font-extrabold text-brand-ink">📋 Pedidos</h1>
          </div>
          {newOrdersCount > 0 && (
            <Badge variant="danger" className="text-xs">
              {newOrdersCount} novos
            </Badge>
          )}
        </div>
      </NavBar>

      <div className="px-4 py-4 max-w-[390px] mx-auto space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <Card padding="sm" className="text-center bg-blue-50">
            <p className="text-2xl font-extrabold text-blue-700">{newOrdersCount}</p>
            <p className="text-xs text-blue-600">Novos</p>
          </Card>
          <Card padding="sm" className="text-center bg-orange-50">
            <p className="text-2xl font-extrabold text-orange-700">
              {orders.filter(o => o.status === 'preparing').length}
            </p>
            <p className="text-xs text-orange-600">Preparando</p>
          </Card>
          <Card padding="sm" className="text-center bg-emerald-50">
            <p className="text-2xl font-extrabold text-emerald-700">
              {orders.filter(o => o.status === 'ready').length}
            </p>
            <p className="text-xs text-emerald-600">Prontos</p>
          </Card>
          <Card padding="sm" className="text-center bg-gray-50">
            <p className="text-2xl font-extrabold text-gray-700">
              {orders.filter(o => o.status === 'delivered').length}
            </p>
            <p className="text-xs text-gray-600">Entregues</p>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['all', 'new', 'preparing', 'ready', 'delivered'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-brand-red text-white'
                  : 'bg-white border border-brand-line text-brand-ink'
              }`}
            >
              {f === 'all' ? 'Todos' :
               f === 'new' ? '🆕 Novos' :
               f === 'preparing' ? '👨‍🍳 Preparando' :
               f === 'ready' ? '✅ Prontos' : '🎉 Entregues'}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <Card padding="md" className="text-center">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-brand-muted">Nenhum pedido encontrado</p>
            </Card>
          ) : (
            filteredOrders.map(order => (
              <Card key={order.id} padding="md" className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-brand-ink">{order.orderNumber}</p>
                    <p className="text-xs text-brand-muted">{order.customerName} • {order.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig[order.status].bgColor} ${statusConfig[order.status].color}`}>
                    {statusConfig[order.status].label}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2 py-2 border-t border-b border-brand-line">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-brand-muted">x{item.quantity} {item.name}</span>
                      <span className="font-medium">{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-brand-muted">Total: </span>
                    <span className="font-extrabold text-brand-ink">{formatCurrency(order.total)}</span>
                    <span className="ml-2 text-xs text-brand-muted">
                      {order.paymentMethod === 'pix' ? '💠 PIX' :
                       order.paymentMethod === 'credit' ? '💳 Crédito' : '💳 Débito'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {order.status === 'new' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          setOrders(orders.filter(o => o.id !== order.id))
                          toast.info('Pedido recusado')
                        }}
                      >
                        Recusar
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAccept(order.id)}
                      >
                        ✅ Aceitar
                      </Button>
                    </>
                  )}
                  {order.status === 'preparing' && (
                    <Button
                      size="sm"
                      className="w-full bg-emerald-500 hover:bg-emerald-600"
                      onClick={() => handleReady(order.id)}
                    >
                      📦 Marcar como pronto
                    </Button>
                  )}
                  {order.status === 'ready' && (
                    <div className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-50 rounded-xl text-emerald-700 text-sm font-bold">
                      <span>⏳</span> Aguardando entregador
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}