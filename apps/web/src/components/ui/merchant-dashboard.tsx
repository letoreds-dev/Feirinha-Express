'use client'

import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'

interface MerchantStats {
  todayOrders: number
  todayRevenue: number
  pendingOrders: number
  avgPreparationTime: string
  rating: number
  totalProducts: number
  isOpen: boolean
}

interface MerchantOrder {
  id: string
  orderNumber: string
  customerName: string
  items: string[]
  total: number
  status: 'new' | 'preparing' | 'ready'
  time: string
}

export function MerchantDashboard() {
  const stats: MerchantStats = {
    todayOrders: 47,
    todayRevenue: 2847.50,
    pendingOrders: 5,
    avgPreparationTime: '18 min',
    rating: 4.8,
    totalProducts: 32,
    isOpen: true
  }

  const recentOrders: MerchantOrder[] = [
    { id: '1', orderNumber: '#1042', customerName: 'Maria S.', items: ['Hambúrguer', 'Batata'], total: 45.80, status: 'new', time: 'agora' },
    { id: '2', orderNumber: '#1041', customerName: 'João O.', items: ['Pizza Média'], total: 32.90, status: 'preparing', time: '3 min' },
    { id: '3', orderNumber: '#1040', customerName: 'Ana C.', items: ['Combo', 'Refri'], total: 58.70, status: 'ready', time: '5 min' },
  ]

  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    preparing: 'bg-orange-100 text-orange-700',
    ready: 'bg-green-100 text-green-700',
  }

  const statusLabels = {
    new: '🆕 Novo',
    preparing: '👨‍🍳 Preparando',
    ready: '✅ Pronto',
  }

  return (
    <div className="space-y-4">
      {/* Store status */}
      <Card padding="md" className={stats.isOpen ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${stats.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`font-bold ${stats.isOpen ? 'text-emerald-700' : 'text-red-700'}`}>
              {stats.isOpen ? '🟢 Loja Aberta' : '🔴 Loja Fechada'}
            </span>
          </div>
          <button className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
            stats.isOpen
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-emerald-500 text-white hover:bg-emerald-600'
          }`}>
            {stats.isOpen ? 'Fechar loja' : 'Abrir loja'}
          </button>
        </div>
      </Card>

      {/* Today's stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card padding="md" className="bg-blue-50 border-blue-100">
          <p className="text-xs text-blue-600 font-medium">Pedidos hoje</p>
          <p className="text-2xl font-extrabold text-blue-700">{stats.todayOrders}</p>
          <p className="text-xs text-blue-500">+12% vs ontem</p>
        </Card>
        <Card padding="md" className="bg-emerald-50 border-emerald-100">
          <p className="text-xs text-emerald-600 font-medium">Faturamento</p>
          <p className="text-2xl font-extrabold text-emerald-700">
            R$ {stats.todayRevenue.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-xs text-emerald-500">+8% vs ontem</p>
        </Card>
        <Card padding="md" className="bg-amber-50 border-amber-100">
          <p className="text-xs text-amber-600 font-medium">Pendentes</p>
          <p className="text-2xl font-extrabold text-amber-700">{stats.pendingOrders}</p>
          <p className="text-xs text-amber-500">Aguardando preparo</p>
        </Card>
        <Card padding="md" className="bg-purple-50 border-purple-100">
          <p className="text-xs text-purple-600 font-medium">Tempo médio</p>
          <p className="text-2xl font-extrabold text-purple-700">{stats.avgPreparationTime}</p>
          <p className="text-xs text-purple-500">Preparo + entrega</p>
        </Card>
      </div>

      {/* Rating */}
      <Card padding="md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-muted">Sua avaliação</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl">⭐</span>
              <span className="text-3xl font-extrabold text-brand-ink">{stats.rating}</span>
              <span className="text-sm text-brand-muted">/ 5.0</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-brand-muted">Produtos</p>
            <p className="text-xl font-extrabold text-brand-ink">{stats.totalProducts}</p>
          </div>
        </div>
      </Card>

      {/* Recent orders */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-brand-ink">📋 Pedidos recentes</h3>
          <button className="text-sm text-brand-red hover:underline">Ver todos →</button>
        </div>

        <div className="space-y-3">
          {recentOrders.map(order => (
            <div key={order.id} className="p-3 bg-brand-soft rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-brand-ink">{order.orderNumber}</p>
                  <p className="text-xs text-brand-muted">{order.customerName} • {order.time}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </div>
              <p className="text-sm text-brand-muted">{order.items.join(', ')}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-brand-ink">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                <div className="flex gap-2">
                  {order.status === 'new' && (
                    <>
                      <button className="px-3 py-1 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
                        Recusar
                      </button>
                      <button className="px-3 py-1 text-xs text-white bg-brand-red rounded-lg hover:bg-brand-red-dark">
                        Aceitar
                      </button>
                    </>
                  )}
                  {order.status === 'preparing' && (
                    <button className="px-3 py-1 text-xs text-white bg-emerald-500 rounded-lg hover:bg-emerald-600">
                      Marcar pronto
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <Badge variant="success" className="text-xs">Aguardando entrega</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button className="p-4 bg-brand-soft rounded-xl text-center hover:bg-brand-line transition-colors">
          <span className="text-2xl block mb-1">📦</span>
          <p className="text-sm font-bold text-brand-ink">Produtos</p>
        </button>
        <button className="p-4 bg-brand-soft rounded-xl text-center hover:bg-brand-line transition-colors">
          <span className="text-2xl block mb-1">📊</span>
          <p className="text-sm font-bold text-brand-ink">Relatórios</p>
        </button>
        <button className="p-4 bg-brand-soft rounded-xl text-center hover:bg-brand-line transition-colors">
          <span className="text-2xl block mb-1">🎁</span>
          <p className="text-sm font-bold text-brand-ink">Promoções</p>
        </button>
        <button className="p-4 bg-brand-soft rounded-xl text-center hover:bg-brand-line transition-colors">
          <span className="text-2xl block mb-1">⚙️</span>
          <p className="text-sm font-bold text-brand-ink">Configurações</p>
        </button>
      </div>
    </div>
  )
}