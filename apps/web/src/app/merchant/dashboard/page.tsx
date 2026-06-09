'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, Button, Badge, NavBar } from '@/components/ui'
import { toast } from '@/components/ui/toast'

export default function MerchantDashboardPage() {
  const [isOpen, setIsOpen] = useState(true)

  const stats = {
    todayOrders: 24,
    todayRevenue: 2847.50,
    pendingOrders: 5,
    avgPreparationTime: '18 min',
    rating: 4.8,
    totalProducts: 32,
  }

  const recentOrders = [
    { id: '#1042', time: 'agora', items: 'Camisa Brasil + Boné', total: 249.70, status: 'new' },
    { id: '#1041', time: '3 min', items: 'Capinha + Carregador', total: 119.80, status: 'preparing' },
    { id: '#1040', time: '8 min', items: 'Mouse + Teclado', total: 184.80, status: 'ready' },
  ]

  const toggleStore = () => {
    setIsOpen(!isOpen)
    toast.success(isOpen ? 'Loja fechada' : 'Loja aberta')
  }

  return (
    <div className="min-h-screen bg-brand-paper pb-8">
      <NavBar>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Link href="/merchant" className="text-brand-muted hover:text-brand-ink">
              ←
            </Link>
            <span className="text-lg font-extrabold text-brand-ink">📊 Dashboard</span>
          </div>
          <Link href="/merchant/orders" className="text-sm text-brand-red font-medium hover:underline">
            Ver pedidos →
          </Link>
        </div>
      </NavBar>

      <div className="px-4 py-4 max-w-[390px] mx-auto space-y-4">
        {/* Store Status */}
        <Card padding="md" className={isOpen ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <div>
                <p className={`font-bold ${isOpen ? 'text-emerald-700' : 'text-red-700'}`}>
                  {isOpen ? '🟢 Loja Aberta' : '🔴 Loja Fechada'}
                </p>
                <p className="text-xs text-brand-muted">Fanaticos FC</p>
              </div>
            </div>
            <button
              onClick={toggleStore}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                isOpen
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {isOpen ? 'Fechar' : 'Abrir'}
            </button>
          </div>
        </Card>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card padding="md" className="bg-blue-50 border-blue-100">
            <p className="text-xs text-blue-600 font-medium">Pedidos hoje</p>
            <p className="text-3xl font-extrabold text-blue-700">{stats.todayOrders}</p>
            <p className="text-xs text-blue-500">+12% vs ontem</p>
          </Card>
          <Card padding="md" className="bg-emerald-50 border-emerald-100">
            <p className="text-xs text-emerald-600 font-medium">Faturamento</p>
            <p className="text-3xl font-extrabold text-emerald-700">
              R$ {stats.todayRevenue.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-xs text-emerald-500">+8% vs ontem</p>
          </Card>
          <Card padding="md" className="bg-amber-50 border-amber-100">
            <p className="text-xs text-amber-600 font-medium">Pendentes</p>
            <p className="text-3xl font-extrabold text-amber-700">{stats.pendingOrders}</p>
            <p className="text-xs text-amber-500">Aguardando preparo</p>
          </Card>
          <Card padding="md" className="bg-purple-50 border-purple-100">
            <p className="text-xs text-purple-600 font-medium">Tempo médio</p>
            <p className="text-3xl font-extrabold text-purple-700">{stats.avgPreparationTime}</p>
            <p className="text-xs text-purple-500">Preparo + entrega</p>
          </Card>
        </div>

        {/* Rating & Products */}
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-2xl">
                ⭐
              </div>
              <div>
                <p className="text-2xl font-extrabold text-brand-ink">{stats.rating}</p>
                <p className="text-xs text-brand-muted">234 avaliações</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-brand-muted">Produtos</p>
              <p className="text-xl font-extrabold text-brand-ink">{stats.totalProducts}</p>
            </div>
          </div>
        </Card>

        {/* Recent Orders */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brand-ink">📋 Pedidos recentes</h3>
            <Link href="/merchant/orders" className="text-sm text-brand-red hover:underline">
              Ver todos →
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="p-3 bg-brand-soft rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-brand-ink">{order.id}</p>
                    <p className="text-xs text-brand-muted">{order.items} • {order.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    order.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'preparing' ? 'bg-orange-100 text-orange-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {order.status === 'new' ? '🆕 Novo' :
                     order.status === 'preparing' ? '👨‍🍳 Preparando' : '✅ Pronto'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-ink">
                    R$ {order.total.toFixed(2).replace('.', ',')}
                  </span>
                  {order.status === 'new' && (
                    <Button size="sm" className="text-xs py-1 px-3">
                      Aceitar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/merchant/products" className="block">
            <Card padding="md" className="text-center hover:bg-brand-soft transition-colors cursor-pointer">
              <span className="text-3xl block mb-2">📦</span>
              <p className="font-bold text-brand-ink">Produtos</p>
              <p className="text-xs text-brand-muted">Gerenciar catálogo</p>
            </Card>
          </Link>
          <Link href="/merchant/analytics" className="block">
            <Card padding="md" className="text-center hover:bg-brand-soft transition-colors cursor-pointer">
              <span className="text-3xl block mb-2">📈</span>
              <p className="font-bold text-brand-ink">Relatórios</p>
              <p className="text-xs text-brand-muted">Ver métricas</p>
            </Card>
          </Link>
          <Link href="/merchant/promotion/create" className="block">
            <Card padding="md" className="text-center hover:bg-brand-soft transition-colors cursor-pointer">
              <span className="text-3xl block mb-2">🎁</span>
              <p className="font-bold text-brand-ink">Promoções</p>
              <p className="text-xs text-brand-muted">Criar ofertas</p>
            </Card>
          </Link>
          <Card padding="md" className="text-center hover:bg-brand-soft transition-colors cursor-pointer">
            <span className="text-3xl block mb-2">⚙️</span>
            <p className="font-bold text-brand-ink">Configurações</p>
            <p className="text-xs text-brand-muted">Horário, delivery</p>
          </Card>
        </div>

        {/* Alerts */}
        {stats.pendingOrders > 3 && (
          <Card padding="md" className="bg-amber-50 border-amber-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <p className="font-bold text-amber-700">Você tem {stats.pendingOrders} pedidos pendentes</p>
                <p className="text-sm text-amber-600">Hora de acelerar o preparo!</p>
              </div>
              <Link href="/merchant/orders" className="ml-auto">
                <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                  Ver pedidos
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}