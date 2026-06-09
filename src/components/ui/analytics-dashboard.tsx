'use client'

import { useState } from 'react'

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon?: string
}

function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
  const isPositive = trend === 'up'
  const isNeutral = trend === 'neutral'

  const trendColors = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trendColors[trend]}`}>
        {trend === 'up' && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        )}
        {trend === 'down' && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
        {change}
      </span>
    </div>
  )
}

interface ChartProps {
  title: string
  data: Array<{ label: string; value: number }>
}

function SimpleBarChart({ title, data }: ChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 mb-4">{title}</h3>
      <div className="flex items-end gap-2 h-32">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-emerald-500 rounded-t-sm transition-all"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            />
            <span className="text-xs text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface RecentOrder {
  id: string
  customer: string
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'delivered'
  time: string
}

function RecentOrdersTable({ orders }: { orders: RecentOrder[] }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    delivered: 'bg-gray-100 text-gray-800',
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 mb-4">Pedidos Recentes</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2 font-medium">Pedido</th>
              <th className="pb-2 font-medium">Cliente</th>
              <th className="pb-2 font-medium">Valor</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Tempo</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b last:border-0">
                <td className="py-3 font-mono text-xs">{order.id}</td>
                <td className="py-3">{order.customer}</td>
                <td className="py-3 font-medium">R$ {order.total.toFixed(2).replace('.', ',')}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status === 'pending' && 'Pendente'}
                    {order.status === 'preparing' && 'Preparando'}
                    {order.status === 'ready' && 'Pronto'}
                    {order.status === 'delivered' && 'Entregue'}
                  </span>
                </td>
                <td className="py-3 text-gray-400">{order.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
}

function TopProductsList({ products }: { products: TopProduct[] }) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 mb-4">Produtos Mais Vendidos</h3>
      <div className="space-y-3">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center gap-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              index === 0 ? 'bg-yellow-400 text-yellow-900' :
              index === 1 ? 'bg-gray-300 text-gray-700' :
              index === 2 ? 'bg-amber-600 text-white' :
              'bg-gray-100 text-gray-500'
            }`}>
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{product.name}</p>
              <p className="text-xs text-gray-400">{product.sales} vendas</p>
            </div>
            <p className="text-sm font-bold">R$ {product.revenue.toFixed(2).replace('.', ',')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today')

  // Dados simulados - substituir por dados reais da API
  const metrics = {
    today: {
      revenue: 'R$ 2.450,00',
      orders: 147,
      ticket: 16.67,
      conversion: 3.2,
    },
    week: {
      revenue: 'R$ 17.150,00',
      orders: 1029,
      ticket: 16.67,
      conversion: 3.5,
    },
    month: {
      revenue: 'R$ 73.500,00',
      orders: 4410,
      ticket: 16.67,
      conversion: 3.8,
    },
  }

  const currentData = metrics[period]

  // Dados para gráfico (vendas por hora)
  const hourlyData = [
    { label: '6h', value: 12 },
    { label: '8h', value: 45 },
    { label: '10h', value: 78 },
    { label: '12h', value: 92 },
    { label: '14h', value: 65 },
    { label: '16h', value: 88 },
    { label: '18h', value: 102 },
    { label: '20h', value: 55 },
  ]

  const recentOrders: RecentOrder[] = [
    { id: 'FE-2024-1847', customer: 'Maria Santos', total: 45.90, status: 'preparing', time: '2 min' },
    { id: 'FE-2024-1846', customer: 'João Silva', total: 23.50, status: 'ready', time: '5 min' },
    { id: 'FE-2024-1845', customer: 'Ana Oliveira', total: 67.80, status: 'pending', time: '8 min' },
    { id: 'FE-2024-1844', customer: 'Carlos Mendes', total: 12.00, status: 'delivered', time: '12 min' },
  ]

  const topProducts: TopProduct[] = [
    { id: '1', name: 'Morango 500g', sales: 89, revenue: 445.00 },
    { id: '2', name: 'Alface Crespa', sales: 67, revenue: 201.00 },
    { id: '3', name: 'Tomate Italiano', sales: 54, revenue: 162.00 },
    { id: '4', name: 'Banana Prata', sales: 48, revenue: 96.00 },
    { id: '5', name: 'Cebola Kg', sales: 42, revenue: 126.00 },
  ]

  return (
    <div className="space-y-6">
      {/* Seletor de período */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Período:</span>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {(['today', 'week', 'month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p === 'today' ? 'Hoje' : p === 'week' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>
      </div>

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Receita"
          value={currentData.revenue}
          change="+12%"
          trend="up"
          icon="💰"
        />
        <MetricCard
          title="Pedidos"
          value={currentData.orders.toString()}
          change="+8%"
          trend="up"
          icon="📦"
        />
        <MetricCard
          title="Ticket Médio"
          value={`R$ ${currentData.ticket.toFixed(2).replace('.', ',')}`}
          change="-2%"
          trend="down"
          icon="🛒"
        />
        <MetricCard
          title="Taxa Conversão"
          value={`${currentData.conversion}%`}
          change="+0.5%"
          trend="up"
          icon="📈"
        />
      </div>

      {/* Gráfico e tabela */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleBarChart title="Vendas por Hora" data={hourlyData} />
        <RecentOrdersTable orders={recentOrders} />
      </div>

      {/* Produtos mais vendidos */}
      <TopProductsList products={topProducts} />
    </div>
  )
}

// Exportar componentes individuais para uso separado
export { MetricCard, SimpleBarChart, RecentOrdersTable, TopProductsList }