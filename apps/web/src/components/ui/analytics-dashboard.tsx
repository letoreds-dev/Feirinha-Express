/**
 * Feirinha Express - Analytics & Metrics System
 * Track and display app metrics and statistics
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { AnimatedNumber } from '@/lib/animations/micro-interactions'

// ==================== METRICS TYPES ====================

interface MetricData {
  value: number
  previousValue: number
  change: number
  changePercent: number
  label: string
  icon: string
  trend: 'up' | 'down' | 'neutral'
}

interface OrderMetrics {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  cancelledOrders: number
  averageOrderValue: number
  totalRevenue: number
}

interface StoreMetrics {
  totalStores: number
  activeStores: number
  averageRating: number
  totalReviews: number
  popularCategories: { name: string; count: number }[]
}

interface UserMetrics {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  newUsersThisWeek: number
  retentionRate: number
}

interface TimeSeriesData {
  date: string
  value: number
}

// ==================== ANALYTICS HOOK ====================

export function useAnalytics() {
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const [orderMetrics] = useState<OrderMetrics>({
    totalOrders: 15847,
    pendingOrders: 23,
    completedOrders: 15234,
    cancelledOrders: 590,
    averageOrderValue: 47.50,
    totalRevenue: 752832.50,
  })

  const [storeMetrics] = useState<StoreMetrics>({
    totalStores: 245,
    activeStores: 198,
    averageRating: 4.6,
    totalReviews: 12456,
    popularCategories: [
      { name: 'Hambúrgueres', count: 45 },
      { name: 'Pizza', count: 38 },
      { name: 'Açaí', count: 32 },
      { name: 'Japonês', count: 28 },
      { name: 'Mexicano', count: 22 },
    ],
  })

  const [userMetrics] = useState<UserMetrics>({
    totalUsers: 45230,
    activeUsers: 12890,
    newUsersToday: 156,
    newUsersThisWeek: 892,
    retentionRate: 68.5,
  })

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setLastUpdated(new Date())
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Calculate metrics with trends
  const getMetricWithTrend = useCallback((value: number, previousValue: number, label: string, icon: string): MetricData => {
    const change = value - previousValue
    const changePercent = previousValue > 0 ? (change / previousValue) * 100 : 0
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'

    return { value, previousValue, change, changePercent, label, icon, trend }
  }, [])

  const orderMetricsData: MetricData[] = useMemo(() => [
    getMetricWithTrend(orderMetrics.totalOrders, 14250, 'Pedidos Totais', '📦'),
    getMetricWithTrend(orderMetrics.totalRevenue, 698450, 'Receita Total', '💰'),
    getMetricWithTrend(orderMetrics.averageOrderValue, 45.80, 'Ticket Médio', '🎫'),
    getMetricWithTrend(storeMetrics.averageRating, 4.4, 'Avaliação Média', '⭐'),
  ], [getMetricWithTrend, orderMetrics, storeMetrics])

  const [orderTimeSeries] = useState<TimeSeriesData[]>([
    { date: 'Seg', value: 1245 },
    { date: 'Ter', value: 1389 },
    { date: 'Qua', value: 1156 },
    { date: 'Qui', value: 1523 },
    { date: 'Sex', value: 1890 },
    { date: 'Sáb', value: 2456 },
    { date: 'Dom', value: 2189 },
  ])

  const [revenueTimeSeries] = useState<TimeSeriesData[]>([
    { date: 'Seg', value: 59213 },
    { date: 'Ter', value: 66045 },
    { date: 'Qua', value: 54932 },
    { date: 'Qui', value: 72345 },
    { date: 'Sex', value: 89832 },
    { date: 'Sáb', value: 116745 },
    { date: 'Dom', value: 104032 },
  ])

  return {
    isLoading,
    lastUpdated,
    orderMetrics,
    storeMetrics,
    userMetrics,
    orderMetricsData,
    orderTimeSeries,
    revenueTimeSeries,
  }
}

// ==================== METRICS CARD ====================

interface MetricsCardProps {
  metric: MetricData
  color?: string
}

export function MetricsCard({ metric, color = 'brand-red' }: MetricsCardProps) {
  const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
    'brand-red': { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500' },
    'emerald': { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-500' },
    'blue': { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
    'yellow': { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: 'text-yellow-500' },
    'purple': { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' },
  }

  const colors = colorClasses[color] || colorClasses['brand-red']

  return (
    <Card padding="md" className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center text-xl`}>
          {metric.icon}
        </div>
        <Badge
          variant={metric.trend === 'up' ? 'success' : metric.trend === 'down' ? 'error' : 'default'}
          className="text-xs"
        >
          {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
          {Math.abs(metric.changePercent).toFixed(1)}%
        </Badge>
      </div>
      <p className={`text-2xl font-extrabold ${colors.text} mt-3`}>
        <AnimatedNumber value={metric.value} decimals={metric.value % 1 !== 0 ? 2 : 0} />
      </p>
      <p className="text-sm text-brand-muted">{metric.label}</p>
      <p className="text-xs text-brand-muted mt-1">
        Anterior: {metric.previousValue.toLocaleString('pt-BR')}
      </p>
    </Card>
  )
}

// ==================== CHART COMPONENT ====================

interface MiniChartProps {
  data: TimeSeriesData[]
  color?: string
  height?: number
  showLabels?: boolean
}

export function MetricsChart({ data, color = '#FF6B6B', height = 120, showLabels = true }: MiniChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((d.value - minValue) / range) * 80 - 10
    return `${x},${y}`
  }).join(' ')

  const areaPoints = `0,100 ${points} 100,100`

  return (
    <div className="w-full">
      <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={areaPoints}
          fill={`url(#gradient-${color.replace('#', '')})`}
        />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100
          const y = 100 - ((d.value - minValue) / range) * 80 - 10
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill={color}
              className="hover:r-4 transition-all"
            />
          )
        })}
      </svg>
      {showLabels && (
        <div className="flex justify-between text-xs text-brand-muted mt-2 px-1">
          {data.map((d, i) => (
            <span key={i}>{d.date}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== PIE CHART ====================

interface PieChartProps {
  data: { label: string; value: number; color: string }[]
  size?: number
}

export function PieChart({ data, size = 160 }: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  let currentAngle = -90

  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 360
    const startAngle = currentAngle
    currentAngle += angle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (currentAngle * Math.PI) / 180

    const x1 = 50 + 40 * Math.cos(startRad)
    const y1 = 50 + 40 * Math.sin(startRad)
    const x2 = 50 + 40 * Math.cos(endRad)
    const y2 = 50 + 40 * Math.sin(endRad)

    const largeArc = angle > 180 ? 1 : 0

    const path = [
      `M 50 50`,
      `L ${x1} ${y1}`,
      `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
      `Z`,
    ].join(' ')

    return (
      <path
        key={i}
        d={path}
        fill={d.color}
        className="hover:opacity-80 transition-opacity cursor-pointer"
      />
    )
  })

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox="0 0 100 100">
        {slices}
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-sm text-brand-ink">{d.label}</span>
            <span className="text-xs text-brand-muted">
              ({((d.value / total) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== ANALYTICS DASHBOARD ====================

export function AnalyticsDashboard() {
  const { isLoading, lastUpdated, orderMetrics, storeMetrics, orderMetricsData, orderTimeSeries, revenueTimeSeries } = useAnalytics()

  const orderStatusData = [
    { label: 'Completados', value: orderMetrics.completedOrders, color: '#10B981' },
    { label: 'Cancelados', value: orderMetrics.cancelledOrders, color: '#EF4444' },
    { label: 'Pendentes', value: orderMetrics.pendingOrders, color: '#F59E0B' },
  ]

  const topCategoriesData = storeMetrics.popularCategories.map((c, i) => ({
    label: c.name,
    value: c.count,
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][i],
  }))

  if (isLoading) {
    return (
      <Card padding="lg" className="text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-brand-soft rounded w-1/3 mx-auto" />
          <div className="h-32 bg-brand-soft rounded" />
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-brand-ink">📊 Analytics</h2>
          <p className="text-sm text-brand-muted">
            Visão geral do desempenho
          </p>
        </div>
        {lastUpdated && (
          <Badge variant="default" className="text-xs">
            Atualizado: {lastUpdated.toLocaleTimeString('pt-BR')}
          </Badge>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {orderMetricsData.map((metric, i) => (
          <MetricsCard
            key={i}
            metric={metric}
            color={['brand-red', 'emerald', 'blue', 'yellow'][i] as any}
          />
        ))}
      </div>

      {/* Order Chart */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">📈 Pedidos da Semana</h3>
        <MetricsChart data={orderTimeSeries} color="#FF6B6B" />
      </Card>

      {/* Revenue Chart */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">💵 Receita da Semana</h3>
        <MetricsChart data={revenueTimeSeries} color="#10B981" height={100} />
        <p className="text-right text-sm text-brand-muted mt-2">
          Total: <span className="font-bold text-emerald-600">
            R$ {orderMetrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </p>
      </Card>

      {/* Status Distribution */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">📊 Status dos Pedidos</h3>
        <PieChart data={orderStatusData} />
      </Card>

      {/* Categories */}
      <Card padding="md">
        <h3 className="font-bold text-brand-ink mb-4">🏷️ Categorias Populares</h3>
        <PieChart data={topCategoriesData} />
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card padding="sm" className="text-center">
          <p className="text-2xl">🏪</p>
          <p className="font-extrabold text-brand-ink">{storeMetrics.totalStores}</p>
          <p className="text-xs text-brand-muted">Lojas</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl">👥</p>
          <p className="font-extrabold text-brand-ink">{storeMetrics.activeStores}</p>
          <p className="text-xs text-brand-muted">Ativas</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl">⭐</p>
          <p className="font-extrabold text-brand-ink">{storeMetrics.averageRating}</p>
          <p className="text-xs text-brand-muted">Avaliação</p>
        </Card>
      </div>
    </div>
  )
}

// ==================== REALTIME COUNTER ====================

interface RealtimeCounterProps {
  value: number
  label: string
  icon: string
  color?: string
}

export function RealtimeCounter({ value, label, icon, color = 'brand-red' }: RealtimeCounterProps) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setDisplayValue(v => v + Math.floor(Math.random() * 3))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3 p-4 bg-brand-soft rounded-xl">
      <div className={`w-12 h-12 rounded-xl bg-${color} bg-opacity-10 flex items-center justify-center text-2xl`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-brand-ink">
          <AnimatedNumber value={displayValue} />
        </p>
        <p className="text-sm text-brand-muted">{label}</p>
      </div>
      <div className="ml-auto">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
      </div>
    </div>
  )
}