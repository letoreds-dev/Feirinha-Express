'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import Link from 'next/link'

interface AnalyticsData {
  label: string
  value: number | string
  change?: number
  icon: string
  color: string
}

interface ChartData {
  label: string
  value: number
}

export function MerchantAnalytics() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week')

  const analytics: AnalyticsData[] = [
    { label: 'Pedidos', value: 234, change: 12, icon: '📦', color: 'bg-blue-100' },
    { label: 'Faturamento', value: 'R$ 12.450', change: 8, icon: '💰', color: 'bg-emerald-100' },
    { label: 'Ticket médio', value: 'R$ 53', change: 5, icon: '🛒', color: 'bg-purple-100' },
    { label: 'Avaliação', value: '4.8', change: 2, icon: '⭐', color: 'bg-yellow-100' },
  ]

  const chartData: ChartData[] = [
    { label: 'Seg', value: 45 },
    { label: 'Ter', value: 52 },
    { label: 'Qua', value: 38 },
    { label: 'Qui', value: 65 },
    { label: 'Sex', value: 78 },
    { label: 'Sáb', value: 92 },
    { label: 'Dom', value: 68 },
  ]

  const maxValue = Math.max(...chartData.map(d => d.value))

  const topProducts = [
    { name: 'Hambúrguer Especial', sales: 89, revenue: 2670, trend: 15 },
    { name: 'Batata Frita', sales: 67, revenue: 1005, trend: 8 },
    { name: 'Refrigerante', sales: 54, revenue: 378, trend: -3 },
    { name: 'Sobremesa', sales: 32, revenue: 640, trend: 22 },
  ]

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex gap-2">
        {(['week', 'month', 'year'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
              period === p ? 'bg-brand-red text-white' : 'bg-white border border-brand-line text-brand-ink'
            }`}
          >
            {p === 'week' && 'Esta semana'}
            {p === 'month' && 'Este mês'}
            {p === 'year' && 'Este ano'}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        {analytics.map((item, idx) => (
          <Card key={idx} padding="md">
            <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center text-xl mb-2`}>
              {item.icon}
            </div>
            <p className="text-2xl font-extrabold text-brand-ink">{item.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {item.change !== undefined && (
                <>
                  <Badge variant={item.change >= 0 ? 'success' : 'danger'} className="text-xs">
                    {item.change >= 0 ? '↑' : '↓'} {Math.abs(item.change)}%
                  </Badge>
                  <span className="text-xs text-brand-muted">vs período anterior</span>
                </>
              )}
            </div>
            <p className="text-xs text-brand-muted mt-1">{item.label}</p>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">📊 Pedidos por dia</h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {chartData.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-brand-red to-red-400 rounded-t-lg transition-all hover:opacity-80"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              />
              <p className="text-xs text-brand-muted mt-2">{item.label}</p>
              <p className="text-sm font-bold text-brand-ink">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Top products */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-brand-ink">🏆 Produtos mais vendidos</h3>
          <Link href="/merchant/products" className="text-xs text-brand-red hover:underline">
            Gerenciar →
          </Link>
        </div>
        <div className="space-y-3">
          {topProducts.map((product, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-red text-white text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-brand-ink">{product.name}</p>
                <p className="text-xs text-brand-muted">{product.sales} vendas</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-brand-ink">R$ {product.revenue}</p>
                <Badge variant={product.trend >= 0 ? 'success' : 'danger'} className="text-xs">
                  {product.trend >= 0 ? '↑' : '↓'} {Math.abs(product.trend)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent orders */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-brand-ink">📋 Últimos pedidos</h3>
          <Badge variant="filled" className="text-xs">{analytics[0].value} hoje</Badge>
        </div>
        <div className="space-y-3">
          {[
            { id: '#1234', items: '2x Hambúrguer, 1x Batata', total: 78.70, time: 'agora', status: 'new' },
            { id: '#1233', items: '1x Pizza Média', total: 45.90, time: '5 min', status: 'preparing' },
            { id: '#1232', items: '3x Açaí, 2x Complementary', total: 95.70, time: '12 min', status: 'ready' },
          ].map((order, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-brand-soft rounded-xl">
              <div className="flex-1">
                <p className="font-bold text-brand-ink">{order.id}</p>
                <p className="text-xs text-brand-muted">{order.items}</p>
                <p className="text-xs text-brand-muted mt-1">{order.time}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-brand-ink">R$ {order.total.toFixed(2).replace('.', ',')}</p>
                <Badge
                  variant={order.status === 'new' ? 'warning' : order.status === 'preparing' ? 'info' : 'success'}
                  className="text-xs mt-1"
                >
                  {order.status === 'new' && '🆕 Novo'}
                  {order.status === 'preparing' && '👨‍🍳 Preparando'}
                  {order.status === 'ready' && '✅ Pronto'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">
          Ver todos os pedidos →
        </Button>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline">
          📦 Editar catálogo
        </Button>
        <Button variant="outline">
          🎁 Criar promoção
        </Button>
      </div>
    </div>
  )
}