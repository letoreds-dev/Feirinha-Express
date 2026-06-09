'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'

interface Notification {
  id: string
  type: 'order' | 'promo' | 'system' | 'chat'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Pedido confirmado!',
      message: 'Seu pedido #FE-1234 foi confirmado e está sendo preparado.',
      timestamp: new Date(Date.now() - 300000),
      read: false,
      actionUrl: '/user/orders/FE-1234',
      actionLabel: 'Ver pedido',
    },
    {
      id: '2',
      type: 'promo',
      title: '🎉 Oferta especial!',
      message: 'Hoje: 10% OFF em toda a Burguer House! Use o cupom BURGUER10.',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: '3',
      type: 'order',
      title: 'Saiu para entrega!',
      message: 'Seu pedido #FE-1233 já saiu! Chega em aproximadamente 20 minutos.',
      timestamp: new Date(Date.now() - 7200000),
      read: true,
      actionUrl: '/user/tracking/FE-1233',
      actionLabel: 'Acompanhar',
    },
    {
      id: '4',
      type: 'system',
      title: 'Pontos disponíveis',
      message: 'Você tem 50 pontos para resgatar! Acesse o programa de fidelidade.',
      timestamp: new Date(Date.now() - 86400000),
      read: true,
    },
    {
      id: '5',
      type: 'chat',
      title: 'Nova mensagem',
      message: 'Burguer House enviou uma mensagem sobre seu pedido.',
      timestamp: new Date(Date.now() - 172800000),
      read: true,
      actionUrl: '/user/chat',
      actionLabel: 'Ver chat',
    },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  }
}

export function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'order' | 'promo' | 'system'>('all')

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter)

  const typeConfig = {
    order: { icon: '📦', color: 'bg-blue-100' },
    promo: { icon: '🎁', color: 'bg-pink-100' },
    system: { icon: '⚙️', color: 'bg-gray-100' },
    chat: { icon: '💬', color: 'bg-green-100' },
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-brand-ink">🔔 Notificações</h2>
          <p className="text-sm text-brand-muted">{unreadCount} não lidas</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-brand-red"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'Todas' },
          { key: 'order', label: '📦 Pedidos' },
          { key: 'promo', label: '🎁 Promoções' },
          { key: 'system', label: '⚙️ Sistema' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === f.key
                ? 'bg-brand-red text-white'
                : 'bg-white border border-brand-line'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card padding="lg" className="text-center">
            <p className="text-4xl mb-3">🔔</p>
            <p className="text-brand-muted">Nenhuma notificação</p>
          </Card>
        ) : (
          filteredNotifications.map(notification => {
            const config = typeConfig[notification.type]
            return (
              <Card
                key={notification.id}
                padding="md"
                className={`transition-all ${!notification.read ? 'border-l-4 border-l-brand-red' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center text-xl`}>
                    {config.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`font-bold ${!notification.read ? 'text-brand-ink' : 'text-brand-muted'}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-brand-muted mt-1">{notification.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <span className="w-2 h-2 bg-brand-red rounded-full" />
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-brand-muted hover:text-red-500"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-brand-muted">{formatTime(notification.timestamp)}</span>
                      {notification.actionUrl && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm text-brand-red font-medium"
                        >
                          {notification.actionLabel} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

// ==================== PUSH NOTIFICATION PERMISSION ====================

export function PushNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Este navegador não suporta notificações push')
      return
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === 'granted') {
        setIsSubscribed(true)
        new Notification('Feirinha Express', {
          body: 'Notificações ativadas! Agora você não perde nenhum pedido.',
          icon: '🍎',
        })
      }
    } catch (error) {
      console.error('Error requesting permission:', error)
    }
  }

  if (permission === 'granted' && isSubscribed) {
    return (
      <Card padding="md" className="bg-emerald-50 border border-emerald-200">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔔</span>
          <div className="flex-1">
            <p className="font-bold text-emerald-800">Notificações ativas</p>
            <p className="text-sm text-emerald-600">Você receberá alertas sobre seus pedidos</p>
          </div>
          <Badge variant="success">Ativo</Badge>
        </div>
      </Card>
    )
  }

  return (
    <Card padding="md" className="bg-gradient-to-r from-brand-red to-red-600 text-white">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🔔</span>
        <div className="flex-1">
          <p className="font-bold">Ative as notificações</p>
          <p className="text-sm text-white text-opacity-80">
            Receba alertas sobre seus pedidos e promoções
          </p>
        </div>
        <Button
          onClick={requestPermission}
          className="bg-white text-brand-red hover:bg-white"
        >
          Ativar
        </Button>
      </div>
    </Card>
  )
}

// ==================== NOTIFICATION BADGE ====================

interface NotificationBadgeProps {
  count: number
  children: React.ReactNode
  max?: number
}

export function NotificationBadge({ count, children, max = 99 }: NotificationBadgeProps) {
  return (
    <div className="relative inline-flex">
      {children}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-red text-white rounded-full text-xs flex items-center justify-center font-bold animate-pulse">
          {count > max ? `${max}+` : count}
        </span>
      )}
    </div>
  )
}
