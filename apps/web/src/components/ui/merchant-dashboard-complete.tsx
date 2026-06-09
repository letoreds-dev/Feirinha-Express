'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { MiniChart, ProgressBar } from './user-dashboard'

interface MerchantStats {
  todayOrders: number
  todayRevenue: number
  todayAverage: number
  rating: number
  totalProducts: number
  activeProducts: number
}

interface Order {
  id: string
  customerName: string
  items: number
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered'
  time: string
}

interface Product {
  id: string
  name: string
  price: number
  soldToday: number
  stock: number
  status: 'active' | 'inactive' | 'out_of_stock'
}

export function MerchantDashboardComplete() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products'>('overview')
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today')

  const [stats] = useState<MerchantStats>({
    todayOrders: 47,
    todayRevenue: 1847.50,
    todayAverage: 39.31,
    rating: 4.8,
    totalProducts: 28,
    activeProducts: 25,
  })

  const [orders] = useState<Order[]>([
    { id: 'FE-1234', customerName: 'Maria S.', items: 3, total: 45.90, status: 'pending', time: '2 min' },
    { id: 'FE-1233', customerName: 'João C.', items: 2, total: 32.90, status: 'preparing', time: '5 min' },
    { id: 'FE-1232', customerName: 'Ana L.', items: 4, total: 67.80, status: 'ready', time: '8 min' },
    { id: 'FE-1231', customerName: 'Pedro R.', items: 1, total: 18.90, status: 'delivering', time: '12 min' },
  ])

  const [products] = useState<Product[]>([
    { id: '1', name: 'Hambúrguer Artesanal', price: 32.90, soldToday: 15, stock: 20, status: 'active' },
    { id: '2', name: 'X-Bacon', price: 28.90, soldToday: 12, stock: 15, status: 'active' },
    { id: '3', name: 'Batata Frita G', price: 18.90, soldToday: 8, stock: 0, status: 'out_of_stock' },
    { id: '4', name: 'Refrigerante Lata', price: 6.90, soldToday: 20, stock: 50, status: 'active' },
  ])

  const [revenueChart] = useState([45, 52, 38, 65, 48, 72, 55, 80, 62, 75, 68, 85])

  const statusConfig = {
    pending: { label: 'Novo', color: 'warning', icon: '🔔' },
    preparing: { label: 'Preparando', color: 'info', icon: '👨‍🍳' },
    ready: { label: 'Pronto', color: 'success', icon: '✅' },
    delivering: { label: 'Entregando', color: 'info', icon: '🛵' },
    delivered: { label: 'Entregue', color: 'success', icon: '🎉' },
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-brand-ink">🏪 Painel da Loja</h1>
          <p className="text-sm text-brand-muted">Burguer House</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Online
          </Badge>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex gap-2">
        {(['today', 'week', 'month'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              period === p ? 'bg-brand-red text-white' : 'bg-white border border-brand-line'
            }`}
          >
            {p === 'today' ? 'Hoje' : p === 'week' ? 'Semana' : 'Mês'}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-brand-line">
        {[
          { key: 'overview', label: 'Visão Geral' },
          { key: 'orders', label: `Pedidos (${orders.length})` },
          { key: 'products', label: 'Produtos' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 px-2 font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-brand-red border-b-2 border-brand-red'
                : 'text-brand-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card padding="md" className="bg-gradient-to-br from-brand-red to-red-600 text-white">
              <p className="text-white text-opacity-80 text-sm">Pedidos hoje</p>
              <p className="text-3xl font-extrabold">{stats.todayOrders}</p>
              <p className="text-xs text-white text-opacity-60 mt-1">+12% vs ontem</p>
            </Card>
            <Card padding="md" className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <p className="text-white text-opacity-80 text-sm">Receita hoje</p>
              <p className="text-3xl font-extrabold">{formatCurrency(stats.todayRevenue)}</p>
              <p className="text-xs text-white text-opacity-60 mt-1">+8% vs ontem</p>
            </Card>
          </div>

          {/* Revenue chart */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-brand-ink">📈 Receita</h3>
              <span className="text-sm text-brand-muted">
                Ticket médio: {formatCurrency(stats.todayAverage)}
              </span>
            </div>
            <MiniChart data={revenueChart} color="#FF6B6B" height={100} />
            <div className="flex justify-between text-xs text-brand-muted mt-2">
              <span>6h</span>
              <span>9h</span>
              <span>12h</span>
              <span>15h</span>
              <span>18h</span>
              <span>21h</span>
            </div>
          </Card>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card padding="sm" className="text-center">
              <p className="text-2xl">⭐</p>
              <p className="font-extrabold text-brand-ink">{stats.rating}</p>
              <p className="text-xs text-brand-muted">Avaliação</p>
            </Card>
            <Card padding="sm" className="text-center">
              <p className="text-2xl">📦</p>
              <p className="font-extrabold text-brand-ink">{stats.activeProducts}</p>
              <p className="text-xs text-brand-muted">Produtos</p>
            </Card>
            <Card padding="sm" className="text-center">
              <p className="text-2xl">⏱️</p>
              <p className="font-extrabold text-brand-ink">28m</p>
              <p className="text-xs text-brand-muted">Tempo médio</p>
            </Card>
          </div>

          {/* Pending orders */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-brand-ink">🚨 Pedidos Pendentes</h3>
              <Badge variant="warning">{orders.filter(o => o.status === 'pending').length}</Badge>
            </div>
            {orders.filter(o => o.status === 'pending').length > 0 ? (
              <div className="space-y-3">
                {orders.filter(o => o.status === 'pending').map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                    <div>
                      <p className="font-bold text-brand-ink">{order.customerName}</p>
                      <p className="text-sm text-brand-muted">{order.items} itens • {formatCurrency(order.total)}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="warning" className="mb-1">{order.time}</Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="text-xs px-2 py-1">Recusar</Button>
                        <Button size="sm" className="text-xs px-2 py-1">Aceitar</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-brand-muted py-4">Nenhum pedido pendente 🎉</p>
            )}
          </Card>
        </div>
      )}

      {/* Orders tab */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {orders.map(order => {
            const status = statusConfig[order.status]
            return (
              <Card key={order.id} padding="md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      order.status === 'pending' ? 'bg-yellow-100' :
                      order.status === 'preparing' ? 'bg-blue-100' :
                      order.status === 'ready' ? 'bg-emerald-100' :
                      'bg-gray-100'
                    }`}>
                      {status.icon}
                    </div>
                    <div>
                      <p className="font-bold text-brand-ink">{order.customerName}</p>
                      <p className="text-sm text-brand-muted">#{order.id} • {order.items} itens</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-brand-red">{formatCurrency(order.total)}</p>
                    <Badge variant={status.color as any} className="text-xs">
                      {status.label}
                    </Badge>
                  </div>
                </div>
                {order.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">Recusar</Button>
                    <Button size="sm" className="flex-1">Aceitar</Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Products tab */}
      {activeTab === 'products' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-brand-ink">📦 Seus Produtos</h3>
            <Button size="sm">+ Adicionar</Button>
          </div>
          {products.map(product => (
            <Card key={product.id} padding="md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-2xl">
                  🍔
                </div>
                <div className="flex-1">
                  <p className="font-bold text-brand-ink">{product.name}</p>
                  <p className="text-sm text-brand-muted">{formatCurrency(product.price)}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-brand-ink">{product.soldToday}</p>
                  <p className="text-xs text-brand-muted">vendidos hoje</p>
                </div>
                <Badge variant={product.stock === 0 ? 'error' : product.status === 'active' ? 'success' : 'warning'}>
                  {product.stock === 0 ? 'Esgotado' : `${product.stock} em estoque`}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
