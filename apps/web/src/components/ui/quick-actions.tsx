'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { toast } from '@/components/ui/toast'

export function QuickActions() {
  const [showAll, setShowAll] = useState(false)

  const quickActions = [
    { id: '1', icon: '🛒', label: 'Pedir again', href: '/user/stores', color: 'bg-brand-red' },
    { id: '2', icon: '📍', label: 'Endereço', href: '/user/addresses', color: 'bg-blue-500' },
    { id: '3', icon: '🎫', label: 'Cupons', href: '/user/wallet', color: 'bg-emerald-500' },
    { id: '4', icon: '❓', label: 'Ajuda', href: '/user/help', color: 'bg-amber-500' },
    { id: '5', icon: '💬', label: 'Suporte', href: '/user/help', color: 'bg-purple-500' },
    { id: '6', icon: '⭐', label: 'Avaliar', href: '/user/orders', color: 'bg-pink-500' },
  ]

  const visibleActions = showAll ? quickActions : quickActions.slice(0, 4)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-ink">⚡ Ações rápidas</h3>
        {quickActions.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-brand-red hover:underline"
          >
            {showAll ? 'Ver menos' : 'Ver mais'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {visibleActions.map(action => (
          <Link key={action.id} href={action.href}>
            <Card padding="sm" className="text-center hover-lift">
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center text-2xl mx-auto mb-2`}>
                {action.icon}
              </div>
              <p className="text-xs font-medium text-brand-ink">{action.label}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Floating action button
export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { icon: '🏠', label: 'Home', href: '/user' },
    { icon: '🛒', label: 'Carrinho', href: '/user/cart' },
    { icon: '❤️', label: 'Favoritos', href: '/user/favorites' },
    { icon: '💬', label: 'Suporte', href: '/user/help' },
  ]

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Menu */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 space-y-2 animate-fade-up">
          {actions.map(action => (
            <Link key={action.label} href={action.href}>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform">
                <span className="text-xl">{action.icon}</span>
                <span className="text-sm font-medium text-brand-ink">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-brand-red text-white shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110 ${
          isOpen ? 'rotate-45' : ''
        }`}
      >
        +
      </button>
    </div>
  )
}

// Stats card for dashboard
export function StatsCard({ icon, label, value, change, trend }: {
  icon: string
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
}) {
  return (
    <Card padding="md">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-xl">
          {icon}
        </div>
        {change && (
          <Badge
            variant={trend === 'up' ? 'success' : trend === 'down' ? 'danger' : 'outline'}
            className="text-xs"
          >
            {trend === 'up' && '↑ '}
            {trend === 'down' && '↓ '}
            {change}
          </Badge>
        )}
      </div>
      <p className="text-2xl font-extrabold text-brand-ink mt-3">{value}</p>
      <p className="text-sm text-brand-muted">{label}</p>
    </Card>
  )
}