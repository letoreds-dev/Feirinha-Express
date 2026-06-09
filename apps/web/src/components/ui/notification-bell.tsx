'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { OrderHistory } from '@/components/ui/order-history'

interface Notification {
  id: string
  type: 'order' | 'promo' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
  icon?: string
}

interface NotificationBellProps {
  className?: string
}

export function NotificationBell({ className }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Mock notifications
  useEffect(() => {
    setNotifications([
      {
        id: '1',
        type: 'order',
        title: 'Pedido a caminho! 🚴',
        message: 'Seu pedido #2024-002 está sendo preparado',
        read: false,
        createdAt: new Date(Date.now() - 300000).toISOString(),
        icon: '📦'
      },
      {
        id: '2',
        type: 'promo',
        title: '🎉 Cupom exclusivo',
        message: 'Use FRETE10 e ganhe frete grátis!',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        actionUrl: '/'
      },
      {
        id: '3',
        type: 'order',
        title: 'Pedido entregue! ⭐',
        message: 'Seu pedido #2024-001 foi entregue',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        icon: '✅'
      },
      {
        id: '4',
        type: 'system',
        title: 'Bem-vindo! 👋',
        message: 'Que bom ter você aqui na Feirinha Express',
        read: true,
        createdAt: new Date(Date.now() - 604800000).toISOString(),
      },
    ])
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const formatTime = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}min`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'order': return 'bg-blue-50 border-blue-100'
      case 'promo': return 'bg-amber-50 border-amber-100'
      case 'system': return 'bg-gray-50 border-gray-100'
    }
  }

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${className} ${
          isOpen ? 'bg-brand-soft' : 'hover:bg-brand-soft'
        }`}
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-12 w-80 max-h-96 bg-white rounded-xl shadow-2xl border border-brand-line z-50 overflow-hidden animate-fade-up">
            {/* Header */}
            <div className="px-4 py-3 border-b border-brand-line bg-brand-paper">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-brand-ink">Notificações</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-brand-red hover:underline"
                  >
                    Marcar todas como lidas
                  </button>
                )}
              </div>
            </div>

            {/* Notifications list */}
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-4xl mb-2">🔔</p>
                  <p className="text-sm text-brand-muted">Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y divide-brand-line">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 transition-colors ${
                        getTypeColor(notification.type)
                      } ${!notification.read ? 'bg-opacity-70' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg flex-shrink-0">
                          {notification.icon || (notification.type === 'promo' ? '🎁' : '📢')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-bold text-brand-ink text-sm">{notification.title}</p>
                            <span className="text-xs text-brand-muted whitespace-nowrap">
                              {formatTime(notification.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-brand-muted mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.actionUrl && (
                            <Link
                              href={notification.actionUrl}
                              className="text-xs text-brand-red font-medium mt-1 inline-block hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Ver detalhes →
                            </Link>
                          )}
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-brand-line bg-brand-paper">
              <Link
                href="/notifications"
                className="block text-center text-sm text-brand-red font-medium hover:underline"
              >
                Ver todas as notificações
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Page component for notifications
export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    // Mock data
    setNotifications([
      {
        id: '1',
        type: 'order',
        title: 'Pedido a caminho!',
        message: 'Seu pedido #2024-002 está sendo preparado e logo chegará',
        read: false,
        createdAt: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: '2',
        type: 'promo',
        title: 'Cupom exclusivo',
        message: 'Use FRETE10 e ganhe frete grátis em qualquer pedido',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        type: 'order',
        title: 'Pedido entregue',
        message: 'Seu pedido #2024-001 foi entregue com sucesso',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ])
  }, [])

  const filtered = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-brand-ink">Notificações</h1>
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllRead}
            className="text-sm text-brand-red hover:underline"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
            filter === 'all'
              ? 'bg-brand-red text-white'
              : 'bg-white border border-brand-line text-brand-ink'
          }`}
        >
          Todas ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
            filter === 'unread'
              ? 'bg-brand-red text-white'
              : 'bg-white border border-brand-line text-brand-ink'
          }`}
        >
          Não lidas ({notifications.filter(n => !n.read).length})
        </button>
      </div>

      {/* Notifications */}
      {filtered.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="text-5xl mb-3">📭</p>
          <p className="font-bold text-brand-ink">
            {filter === 'unread' ? 'Todas foram lidas!' : 'Nenhuma notificação'}
          </p>
          <p className="text-sm text-brand-muted mt-1">
            {filter === 'unread'
              ? 'Volte mais tarde para novidades'
              : 'Você receberá notificações sobre seus pedidos aqui'
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(notification => (
            <Card key={notification.id} padding="md" className={`${!notification.read ? 'border-l-4 border-l-brand-red' : ''}`}>
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center text-2xl">
                  {notification.type === 'order' ? '📦' : notification.type === 'promo' ? '🎁' : '📢'}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-brand-ink">{notification.title}</h3>
                    <Badge variant={notification.read ? 'outline' : 'filled'} className="text-xs">
                      {notification.read ? 'Lida' : 'Nova'}
                    </Badge>
                  </div>
                  <p className="text-sm text-brand-muted mt-1">{notification.message}</p>
                  <p className="text-xs text-brand-muted mt-2">
                    {new Date(notification.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}