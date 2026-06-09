'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

interface DashboardStats {
  totalOrders: number
  totalSpent: number
  savedAmount: number
  favoriteStores: number
  loyaltyPoints: number
  currentTier: string
}

interface RecentActivity {
  id: string
  type: 'order' | 'review' | 'points' | 'coupon'
  title: string
  subtitle: string
  timestamp: Date
  icon: string
}

export function UserDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 23,
    totalSpent: 1847.50,
    savedAmount: 156.30,
    favoriteStores: 5,
    loyaltyPoints: 1250,
    currentTier: 'silver',
  })

  const [activities, setActivities] = useState<RecentActivity[]>([
    { id: '1', type: 'order', title: 'Pedido entregue', subtitle: 'Burguer House - R$ 45,90', timestamp: new Date(Date.now() - 3600000), icon: '📦' },
    { id: '2', type: 'points', title: 'Pontos ganhos', subtitle: '+150 pontos', timestamp: new Date(Date.now() - 3600000), icon: '⭐' },
    { id: '3', type: 'coupon', title: 'Cupom aplicado', subtitle: '10% OFF', timestamp: new Date(Date.now() - 7200000), icon: '🎫' },
    { id: '4', type: 'review', title: 'Avaliação enviada', subtitle: 'Pizza Express', timestamp: new Date(Date.now() - 86400000), icon: '⭐' },
    { id: '5', type: 'order', title: 'Pedido cancelado', subtitle: 'Açaí House', timestamp: new Date(Date.now() - 172800000), icon: '❌' },
  ])

  const [quickActions] = useState([
    { icon: '📦', label: 'Pedidos', href: '/user/orders', color: 'bg-blue-50' },
    { icon: '❤️', label: 'Favoritos', href: '/user/favorites', color: 'bg-red-50' },
    { icon: '🎫', label: 'Cupons', href: '/user/wallet', color: 'bg-green-50' },
    { icon: '⭐', label: 'Avaliações', href: '/user/reviews', color: 'bg-yellow-50' },
    { icon: '📍', label: 'Endereços', href: '/user/addresses', color: 'bg-purple-50' },
    { icon: '💳', label: 'Pagamentos', href: '/user/payments', color: 'bg-indigo-50' },
  ])

  const tierProgress = {
    bronze: { current: 3500, next: 5000, label: 'Gold' },
    silver: { current: 3500, next: 5000, label: 'Gold' },
    gold: { current: 5000, next: 10000, label: 'Platinum' },
    platinum: { current: 10000, next: 10000, label: 'Max' },
  }

  const progress = tierProgress[stats.currentTier as keyof typeof tierProgress]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = diff / 60000
    if (minutes < 60) return `${Math.floor(minutes)} min`
    const hours = minutes / 60
    if (hours < 24) return `${Math.floor(hours)}h`
    return `${Math.floor(hours / 24)}d`
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-brand-red to-red-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl font-extrabold">
            👤
          </div>
          <div>
            <p className="text-white text-opacity-80 text-sm">Bem-vindo de volta!</p>
            <p className="text-xl font-extrabold">Carlos Silva</p>
            <Badge className="bg-white bg-opacity-20 text-white mt-1">
              🥈 Prata
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card padding="md" className="bg-gradient-to-br from-blue-50 to-blue-100">
          <p className="text-2xl font-extrabold text-blue-600">{stats.totalOrders}</p>
          <p className="text-xs text-blue-600">Pedidos</p>
        </Card>
        <Card padding="md" className="bg-gradient-to-br from-emerald-50 to-emerald-100">
          <p className="text-2xl font-extrabold text-emerald-600">{formatCurrency(stats.totalSpent)}</p>
          <p className="text-xs text-emerald-600">Total gasto</p>
        </Card>
        <Card padding="md" className="bg-gradient-to-br from-purple-50 to-purple-100">
          <p className="text-2xl font-extrabold text-purple-600">{formatCurrency(stats.savedAmount)}</p>
          <p className="text-xs text-purple-600">Economizado</p>
        </Card>
        <Card padding="md" className="bg-gradient-to-br from-orange-50 to-orange-100">
          <p className="text-2xl font-extrabold text-orange-600">{stats.loyaltyPoints}</p>
          <p className="text-xs text-orange-600">Pontos</p>
        </Card>
      </div>

      {/* Loyalty progress */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-brand-ink">🏆 Progresso do Programa</h3>
          <Badge variant="warning">🥈 {stats.currentTier}</Badge>
        </div>
        <ProgressBar
          value={stats.loyaltyPoints}
          max={progress.next}
          label={`Próximo: ${progress.label}`}
          color="brand"
        />
        <p className="text-sm text-brand-muted mt-2">
          {stats.loyaltyPoints} / {progress.next} pontos
        </p>
      </Card>

      {/* Quick actions */}
      <div>
        <h3 className="font-bold text-brand-ink mb-3">⚡ Ações Rápidas</h3>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, idx) => (
            <a
              key={idx}
              href={action.href}
              className={`${action.color} p-4 rounded-xl text-center hover:scale-105 transition-transform`}
            >
              <span className="text-2xl block mb-1">{action.icon}</span>
              <span className="text-xs font-medium text-brand-ink">{action.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-brand-ink">📜 Atividade Recente</h3>
          <a href="/user/activity" className="text-sm text-brand-red">Ver tudo</a>
        </div>
        <Card padding="none">
          <div className="divide-y divide-brand-line">
            {activities.map(activity => (
              <div key={activity.id} className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-lg">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-brand-ink">{activity.title}</p>
                  <p className="text-sm text-brand-muted">{activity.subtitle}</p>
                </div>
                <span className="text-xs text-brand-muted">{formatTime(activity.timestamp)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Active orders */}
      <div>
        <h3 className="font-bold text-brand-ink mb-3">🚚 Pedidos em Andamento</h3>
        <Card padding="md" className="border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-2xl">
              🛵
            </div>
            <div className="flex-1">
              <p className="font-bold text-brand-ink">Pedido #FE-2024-1235</p>
              <p className="text-sm text-brand-muted">Burguer House • Saiu para entrega</p>
              <p className="text-xs text-yellow-600 font-medium">⏱️ Chega em ~15 min</p>
            </div>
            <a href="/user/tracking/FE-2024-1235" className="text-brand-red">
              →
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ==================== PROGRESS BAR ====================

interface ProgressBarProps {
  value: number
  max: number
  label?: string
  color?: 'brand' | 'success' | 'warning' | 'error'
  showPercentage?: boolean
}

export function ProgressBar({
  value,
  max,
  label,
  color = 'brand',
  showPercentage = false,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((value / max) * 100))

  const colorClasses = {
    brand: 'bg-brand-red',
    success: 'bg-emerald-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  }

  return (
    <div>
      <div className="h-3 bg-brand-soft rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <p className="text-xs text-brand-muted mt-1 text-right">{percentage}%</p>
      )}
    </div>
  )
}

// ==================== STATS CARD ====================

interface StatsCardProps {
  icon: string
  label: string
  value: string | number
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: string
}

export function StatsCard({ icon, label, value, trend, color = 'brand-red' }: StatsCardProps) {
  return (
    <Card padding="md">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl bg-${color} bg-opacity-10 flex items-center justify-center text-xl`}>
          {icon}
        </div>
        {trend && (
          <Badge variant={trend.isPositive ? 'success' : 'error'} className="text-xs">
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </Badge>
        )}
      </div>
      <p className="text-2xl font-extrabold text-brand-ink mt-3">{value}</p>
      <p className="text-sm text-brand-muted">{label}</p>
    </Card>
  )
}

// ==================== MINI CHART ====================

interface MiniChartProps {
  data: number[]
  color?: string
  height?: number
}

export function MiniChart({ data, color = '#FF6B6B', height = 40 }: MiniChartProps) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 80 - 10
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,100 ${points} 100,100`}
        fill={`url(#gradient-${color})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}